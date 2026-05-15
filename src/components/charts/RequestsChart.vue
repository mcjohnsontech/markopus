<script setup lang="ts">
import { computed } from 'vue'
import { graphic } from 'echarts'
import type { EChartsOption } from 'echarts'
import { useMetrics } from '@/composables/useMetrics'
import { useMetricsStore } from '@/stores/metrics.store'
import BaseChart from './BaseChart.vue'

const { requestsChartData } = useMetrics()
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
    data: requestsChartData.value.timestamps,
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
  },
  series: [
    {
      type: 'line',
      name: 'Requests/sec',
      data: requestsChartData.value.data,
      smooth: true,
      lineStyle: { color: '#10b981', width: 2.5 },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(16, 185, 129, 0.35)' },
          { offset: 1, color: 'rgba(16, 185, 129, 0.02)' },
        ]),
      },
      itemStyle: { borderColor: '#10b981', borderWidth: 0, color: '#10b981' },
      symbolSize: 4,
      showSymbol: false,
    },
  ],
}))

const fallbackState = computed(() => {
  if (store.connectionStatus !== 'connected' && requestsChartData.value.data.length === 0)
    return 'reconnecting'
  if (requestsChartData.value.data.length === 0) return 'no-data'
  return undefined
})
</script>

<template>
  <BaseChart :option="chartOption" :fallback-state="fallbackState" title="Requests/sec" />
</template>
