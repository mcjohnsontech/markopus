<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'
import ChartFallback from '@/components/ui/ChartFallback.vue'

const props = defineProps<{
  label: string
  value: number
  unit: string
  icon: string
  trend?: number
  delta?: number
  sparklineData: number[]
}>()

const chartContainer = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

const isTrendingUp = computed(() => (props.trend ?? 0) > 0)
const hasData = computed(() => props.sparklineData.length > 0)
const fallbackState = computed(() => (!hasData.value ? 'no-data' : undefined))

const initChart = () => {
  if (!chartContainer.value) return

  if (!chart) {
    chart = echarts.init(chartContainer.value)
  }

  const option: EChartsOption = {
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', boundaryGap: false, show: false },
    yAxis: { type: 'value', show: false },
    series: [
      {
        type: 'line',
        data: props.sparklineData,
        smooth: true,
        lineStyle: { color: '#3b82f6', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' },
          ]),
        },
        symbolSize: 0,
      },
    ],
  }

  chart.setOption(option, { notMerge: false, lazyUpdate: true })
}

const cleanup = () => {
  if (chart) {
    chart.dispose()
    chart = null
  }
}

watch(() => props.sparklineData, initChart, { deep: true })

onMounted(() => {
  initChart()
  const resizeObserver = new ResizeObserver(() => chart?.resize())
  if (chartContainer.value) resizeObserver.observe(chartContainer.value)
  onBeforeUnmount(() => {
    resizeObserver.disconnect()
    cleanup()
  })
})
</script>

<template>
  <div class="card relative overflow-hidden min-h-36">
    <!-- Fallback overlay -->
    <ChartFallback v-if="fallbackState" :state="fallbackState" />

    <!-- Card header with icon -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="card-header">{{ label }}</h3>
      <div class="text-3xl opacity-60">{{ icon }}</div>
    </div>

    <!-- Main metric value -->
    <div class="mb-4">
      <div class="flex items-baseline gap-3 mb-1">
        <span class="metric-value">{{ value }}</span>
        <span class="text-sm font-medium text-slate-400">{{ unit }}</span>
      </div>

      <!-- Trend indicator -->
      <div v-if="delta !== undefined" class="flex items-center gap-1.5 mt-2">
        <component
          :is="isTrendingUp ? TrendingUp : TrendingDown"
          :class="[
            'w-4 h-4',
            isTrendingUp ? 'text-green-400' : 'text-red-400',
          ]"
        />
        <span :class="isTrendingUp ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'">
          {{ isTrendingUp ? '+' : '' }}{{ delta }}%
        </span>
        <span class="text-xs text-slate-500">vs last period</span>
      </div>
    </div>

    <!-- Sparkline chart -->
    <div v-show="hasData" ref="chartContainer" class="w-full h-12 mt-auto"></div>
  </div>
</template>
