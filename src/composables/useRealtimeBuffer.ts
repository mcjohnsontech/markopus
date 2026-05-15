import { ref, onMounted, onBeforeUnmount } from 'vue'
import { v4 as uuid } from 'uuid'
import type { MetricPoint, ActivityLog } from '@/types'
import { useMetricsStore } from '@/stores/metrics.store'

const FLUSH_INTERVAL = 200 // ms - flush 5 times per second

interface ThresholdKey {
  key: string
  lastFiredAt: number
  cooldownMs: number
}

export function useRealtimeBuffer() {
  const store = useMetricsStore()
  const metricBuffer = ref<MetricPoint[]>([])
  const thresholdCooldowns = new Map<string, number>()

  const thresholdRules = [
    {
      key: 'cpu-critical',
      check: (m: MetricPoint) => m.cpu > 95,
      message: (m: MetricPoint) => `CPU critical: ${Math.round(m.cpu)}% usage`,
      severity: 'critical' as const,
      cooldownMs: 10000,
    },
    {
      key: 'cpu-warning',
      check: (m: MetricPoint) => m.cpu > 85 && m.cpu <= 95,
      message: (m: MetricPoint) => `CPU high: ${Math.round(m.cpu)}% usage`,
      severity: 'warning' as const,
      cooldownMs: 10000,
    },
    {
      key: 'memory-critical',
      check: (m: MetricPoint) => m.memory > 90,
      message: (m: MetricPoint) => `Memory critical: ${Math.round(m.memory)}% used`,
      severity: 'critical' as const,
      cooldownMs: 10000,
    },
    {
      key: 'memory-warning',
      check: (m: MetricPoint) => m.memory > 80 && m.memory <= 90,
      message: (m: MetricPoint) => `Memory high: ${Math.round(m.memory)}% used`,
      severity: 'warning' as const,
      cooldownMs: 10000,
    },
    {
      key: 'network-warning',
      check: (m: MetricPoint) => m.network > 900,
      message: (m: MetricPoint) => `Network traffic spike: ${Math.round(m.network)} MB/s`,
      severity: 'warning' as const,
      cooldownMs: 10000,
    },
    {
      key: 'requests-warning',
      check: (m: MetricPoint) => m.requests > 450,
      message: (m: MetricPoint) => `High request rate: ${Math.round(m.requests)} req/s`,
      severity: 'warning' as const,
      cooldownMs: 10000,
    },
    {
      key: 'connections-warning',
      check: (m: MetricPoint) => m.activeConnections < 5,
      message: (m: MetricPoint) => `Low active connections: ${m.activeConnections}`,
      severity: 'warning' as const,
      cooldownMs: 10000,
    },
  ]

  function pushMetric(metric: MetricPoint): void {
    metricBuffer.value.push(metric)
  }

  function checkThresholds(metric: MetricPoint): void {
    const now = Date.now()

    for (const rule of thresholdRules) {
      if (rule.check(metric)) {
        const lastFired = thresholdCooldowns.get(rule.key) || 0
        if (now - lastFired > rule.cooldownMs) {
          const alert: ActivityLog = {
            id: uuid(),
            severity: rule.severity,
            message: rule.message(metric),
            timestamp: now,
          }
          store.addActivityLog(alert)
          thresholdCooldowns.set(rule.key, now)
        }
      }
    }
  }

  function flush(): void {
    if (metricBuffer.value.length === 0) return

    for (const metric of metricBuffer.value) {
      store.addMetricPoint(metric)
      checkThresholds(metric)
    }

    metricBuffer.value = []
  }

  let flushInterval: ReturnType<typeof setInterval>

  onMounted(() => {
    flushInterval = setInterval(() => {
      flush()
    }, FLUSH_INTERVAL)
  })

  onBeforeUnmount(() => {
    clearInterval(flushInterval)
    flush() // Final flush
  })

  return {
    pushMetric,
    flush,
  }
}
