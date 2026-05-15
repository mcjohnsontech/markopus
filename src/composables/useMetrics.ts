import { computed } from 'vue'
import { useMetricsStore } from '@/stores/metrics.store'

export function useMetrics() {
  const store = useMetricsStore()

  const timestamps = computed(() => {
    return store.metrics.map((m) => {
      const date = new Date(m.timestamp)
      return date.toLocaleTimeString()
    })
  })

  const cpuChartData = computed(() => ({
    timestamps: timestamps.value,
    data: store.cpuHistory,
  }))

  const memoryChartData = computed(() => ({
    timestamps: timestamps.value,
    data: store.memoryHistory,
  }))

  const networkChartData = computed(() => ({
    timestamps: timestamps.value,
    data: store.networkHistory,
  }))

  const requestsChartData = computed(() => ({
    timestamps: timestamps.value,
    data: store.requestsHistory,
  }))

  const latestMetric = computed(() => store.latestMetric)

  return {
    cpuChartData,
    memoryChartData,
    networkChartData,
    requestsChartData,
    latestMetric,
    timestamps,
  }
}
