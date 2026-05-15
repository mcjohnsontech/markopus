<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import ChartFallback from '@/components/ui/ChartFallback.vue'

const props = defineProps<{
  option: EChartsOption
  fallbackState?: 'loading' | 'no-data' | 'reconnecting' | 'error'
  title?: string
}>()

const chartContainer = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartContainer.value) return

  if (!chart) {
    chart = echarts.init(chartContainer.value, 'dark')
  }

  chart.setOption(props.option, { notMerge: false, lazyUpdate: true })
}

const cleanup = () => {
  if (chart) {
    chart.dispose()
    chart = null
  }
}

watch(() => props.option, initChart, { deep: true })

onMounted(() => {
  initChart()

  const resizeObserver = new ResizeObserver(() => {
    chart?.resize()
  })

  if (chartContainer.value) {
    resizeObserver.observe(chartContainer.value)
  }

  onBeforeUnmount(() => {
    resizeObserver.disconnect()
    cleanup()
  })
})
</script>

<template>
  <div class="card flex flex-col h-full p-6">
    <!-- Header -->
    <div v-if="title" class="mb-4">
      <h3 class="card-header">{{ title }}</h3>
    </div>

    <!-- Chart or fallback -->
    <div class="flex-1 relative rounded-lg overflow-hidden">
      <!-- Chart -->
      <div ref="chartContainer" class="w-full h-full"></div>

      <!-- Fallback overlay -->
      <ChartFallback v-if="fallbackState" :state="fallbackState" />
    </div>
  </div>
</template>
