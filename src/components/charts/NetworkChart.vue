<script setup lang="ts">
import { computed } from 'vue'
import { graphic } from 'echarts'
import type { EChartsOption } from 'echarts'
import { useMetrics } from '@/composables/useMetrics'
import { useMetricsStore } from '@/stores/metrics.store'
import BaseChart from './BaseChart.vue'

const { networkChartData } = useMetrics()
const store = useMetricsStore()

const chartOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderColor: 'rgba(148, 163, 184, 0.2)',
    textStyle: { color: '#f1f5f9', fontSize: 12 },
    padding: [8, 12],
    borderRadius: 6,
    axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(6, 182, 212, 0.1)' } },
  },
  grid: { left: '12%', right: '12%', top: '15%', bottom: '12%', containLabel: true },
  xAxis: {
    type: 'category',
    data: networkChartData.value.timestamps,
    axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
    axisLabel: { color: '#94a3b8', fontSize: 11, margin: 8 },
    splitLine: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.15)' } },
    axisLabel: { color: '#94a3b8', fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.08)', type: 'dashed' } },
  },
  series: [
    {
      type: 'bar',
      name: 'Network Traffic',
      data: networkChartData.value.data,
      itemStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#06b6d4' },
          { offset: 1, color: '#0891b2' },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
      emphasis: { itemStyle: { color: new graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#22d3ee' },
        { offset: 1, color: '#06b6d4' },
      ]) } },
    },
  ],
}))

const fallbackState = computed(() => {
  if (store.connectionStatus !== 'connected' && networkChartData.value.data.length === 0)
    return 'reconnecting'
  if (networkChartData.value.data.length === 0) return 'no-data'
  return undefined
})
</script>

<template>
  <BaseChart :option="chartOption" :fallback-state="fallbackState" title="Network Traffic (MB/s)" />
</template>
