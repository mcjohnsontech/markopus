import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'

export function useChartResize(chartRef: HTMLDivElement | null, chart: echarts.ECharts | null) {
  const resizeObserver = ref<ResizeObserver | null>(null)

  onMounted(() => {
    if (!chartRef || !chart) return

    resizeObserver.value = new ResizeObserver(() => {
      chart.resize()
    })

    resizeObserver.value.observe(chartRef)
  })

  onBeforeUnmount(() => {
    if (resizeObserver.value) {
      resizeObserver.value.disconnect()
      resizeObserver.value = null
    }
  })

  return {
    resizeObserver,
  }
}
