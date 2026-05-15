import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { MetricPoint, ActivityLog, ActivitySeverity, ConnectionStatus } from '@/types'

const MAX_METRICS = 100
const MAX_LOGS = 200

export const useMetricsStore = defineStore('metrics', () => {
  const metrics = ref<MetricPoint[]>([])
  const activityLogs = ref<ActivityLog[]>([])
  const connectionStatus = ref<ConnectionStatus>('disconnected')
  const isPaused = ref(false)
  const logFilter = ref<ActivitySeverity | 'all'>('all')
  const uptime = ref(0)
  const avgLatency = ref(0)
  const packetLoss = ref(0)
  const errorRate = ref(0)

  const latestMetric = computed(() => metrics.value[metrics.value.length - 1])

  const cpuHistory = computed(() => metrics.value.map((m) => m.cpu))
  const memoryHistory = computed(() => metrics.value.map((m) => m.memory))
  const networkHistory = computed(() => metrics.value.map((m) => m.network))
  const requestsHistory = computed(() => metrics.value.map((m) => m.requests))

  const filteredLogs = computed(() => {
    if (logFilter.value === 'all') return activityLogs.value
    return activityLogs.value.filter((log) => log.severity === logFilter.value)
  })

  const criticalAlertsCount = computed(
    () => activityLogs.value.filter((log) => log.severity === 'critical').length
  )

  const warningAlertsCount = computed(
    () => activityLogs.value.filter((log) => log.severity === 'warning').length
  )

  function addMetricPoint(point: MetricPoint): void {
    if (isPaused.value) return

    metrics.value.push(point)
    if (metrics.value.length > MAX_METRICS) {
      metrics.value.shift()
    }
  }

  function addActivityLog(log: ActivityLog): void {
    activityLogs.value.unshift(log) // Newest first
    if (activityLogs.value.length > MAX_LOGS) {
      activityLogs.value.pop()
    }
  }

  function setConnectionStatus(status: ConnectionStatus): void {
    connectionStatus.value = status
  }

  function togglePause(): void {
    isPaused.value = !isPaused.value
  }

  function setLogFilter(filter: ActivitySeverity | 'all'): void {
    logFilter.value = filter
  }

  function setSummaryMetrics(data: {
    uptime?: number
    avgLatency?: number
    packetLoss?: number
    errorRate?: number
  }): void {
    if (data.uptime !== undefined) uptime.value = data.uptime
    if (data.avgLatency !== undefined) avgLatency.value = data.avgLatency
    if (data.packetLoss !== undefined) packetLoss.value = data.packetLoss
    if (data.errorRate !== undefined) errorRate.value = data.errorRate
  }

  function clearAllMetrics(): void {
    metrics.value = []
    activityLogs.value = []
  }

  return {
    metrics,
    activityLogs,
    connectionStatus,
    isPaused,
    logFilter,
    uptime,
    avgLatency,
    packetLoss,
    errorRate,
    latestMetric,
    cpuHistory,
    memoryHistory,
    networkHistory,
    requestsHistory,
    filteredLogs,
    criticalAlertsCount,
    warningAlertsCount,
    addMetricPoint,
    addActivityLog,
    setConnectionStatus,
    togglePause,
    setLogFilter,
    setSummaryMetrics,
    clearAllMetrics,
  }
})
