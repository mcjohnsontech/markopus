<script setup lang="ts">
import { computed } from 'vue'
import { graphic } from 'echarts'
import type { EChartsOption } from 'echarts'
import { useMetrics } from '@/composables/useMetrics'
import { useMetricsStore } from '@/stores/metrics.store'
import BaseChart from './BaseChart.vue'

const { cpuChartData } = useMetrics()
const store = useMetricsStore()

const chartOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: 'rgba(148, 163, 184, 0.2)',
    textStyle: { color: '#f1f5f9', fontSize: 12 },
    padding: [8, 12],
    borderRadius: 6,
    axisPointer: { type: 'cross', lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
  },
  grid: { left: '12%', right: '12%', top: '15%', bottom: '12%', containLabel: true },
  xAxis: {
    type: 'category',
    data: cpuChartData.value.timestamps,
    axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
    axisLabel: { color: '#94a3b8', fontSize: 11, margin: 8 },
    splitLine: { show: false },
    boundaryGap: false,
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
    axisLabel: { color: '#94a3b8', fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.08)', type: 'dashed' } },
    max: 100,
  },
  series: [
    {
      type: 'line',
      name: 'CPU Usage',
      data: cpuChartData.value.data,
      smooth: true,
      lineStyle: { color: '#3b82f6', width: 2.5 },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(59, 130, 246, 0.35)' },
          { offset: 1, color: 'rgba(59, 130, 246, 0.02)' },
        ]),
      },
      itemStyle: { borderColor: '#3b82f6', borderWidth: 0, color: '#3b82f6' },
      symbolSize: 4,
      showSymbol: false,
    },
  ],
}))

const fallbackState = computed(() => {
  if (store.connectionStatus !== 'connected' && cpuChartData.value.data.length === 0)
    return 'reconnecting'
  if (cpuChartData.value.data.length === 0) return 'no-data'
  return undefined
})
</script>

<template>
  <BaseChart :option="chartOption" :fallback-state="fallbackState" title="CPU Usage (%)" />
</template>
