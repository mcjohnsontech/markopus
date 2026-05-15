<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import MetricCard from '@/components/widgets/MetricCard.vue'
import CpuChart from '@/components/charts/CpuChart.vue'
import MemoryChart from '@/components/charts/MemoryChart.vue'
import NetworkChart from '@/components/charts/NetworkChart.vue'
import RequestsChart from '@/components/charts/RequestsChart.vue'
import ActivityFeed from '@/components/widgets/ActivityFeed.vue'
import SummaryBar from '@/components/widgets/SummaryBar.vue'
import { useWebSocket } from '@/composables/useWebSocket'
import { useRealtimeBuffer } from '@/composables/useRealtimeBuffer'
import { useMetricsStore } from '@/stores/metrics.store'
import { getWebSocketService } from '@/services/websocket.service'
import type { MetricPoint } from '@/types'
import { Cpu, MemoryStick, Radio, Zap } from 'lucide-vue-next'

const store = useMetricsStore()
const wsService = getWebSocketService()
const { pushMetric, flush } = useRealtimeBuffer()

useWebSocket()

const latestMetric = computed(() => store.latestMetric)
const cpuTrend = computed(() => {
  if (store.metrics.length < 2) return 0
  const prev = store.metrics[store.metrics.length - 2]
  const curr = store.metrics[store.metrics.length - 1]
  if (!prev || !curr) return 0
  return ((curr.cpu - prev.cpu) / prev.cpu) * 100
})

const memoryTrend = computed(() => {
  if (store.metrics.length < 2) return 0
  const prev = store.metrics[store.metrics.length - 2]
  const curr = store.metrics[store.metrics.length - 1]
  if (!prev || !curr) return 0
  return ((curr.memory - prev.memory) / prev.memory) * 100
})

const networkTrend = computed(() => {
  if (store.metrics.length < 2) return 0
  const prev = store.metrics[store.metrics.length - 2]
  const curr = store.metrics[store.metrics.length - 1]
  if (!prev || !curr) return 0
  return ((curr.network - prev.network) / prev.network) * 100
})

const requestsTrend = computed(() => {
  if (store.metrics.length < 2) return 0
  const prev = store.metrics[store.metrics.length - 2]
  const curr = store.metrics[store.metrics.length - 1]
  if (!prev || !curr) return 0
  return ((curr.requests - prev.requests) / prev.requests) * 100
})

onMounted(() => {
  // Simulate initial data update for demo purposes
  // In production, this comes from WebSocket
  if (store.metrics.length === 0) {
    for (let i = 0; i < 20; i++) {
      const metric: MetricPoint = {
        timestamp: Date.now() - (20 - i) * 1000,
        cpu: Math.floor(Math.random() * 80),
        memory: Math.floor(Math.random() * 70),
        network: Math.floor(Math.random() * 500),
        requests: Math.floor(Math.random() * 300) + 50,
        activeConnections: Math.floor(Math.random() * 50) + 20,
      }
      pushMetric(metric)
    }
    flush()
  }
})
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Top Metric Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          v-if="latestMetric"
          label="CPU Usage"
          :value="Math.round(latestMetric.cpu)"
          unit="%"
          icon="⚙️"
          :trend="cpuTrend"
          :delta="Math.round(cpuTrend)"
          :sparkline-data="store.cpuHistory"
        />
        <MetricCard
          v-if="latestMetric"
          label="Memory Usage"
          :value="Math.round(latestMetric.memory)"
          unit="%"
          icon="🧠"
          :trend="memoryTrend"
          :delta="Math.round(memoryTrend)"
          :sparkline-data="store.memoryHistory"
        />
        <MetricCard
          v-if="latestMetric"
          label="Network Traffic"
          :value="Math.round(latestMetric.network)"
          unit="MB/s"
          icon="🌐"
          :trend="networkTrend"
          :delta="Math.round(networkTrend)"
          :sparkline-data="store.networkHistory"
        />
        <MetricCard
          v-if="latestMetric"
          label="Requests/sec"
          :value="Math.round(latestMetric.requests)"
          unit="req/s"
          icon="⚡"
          :trend="requestsTrend"
          :delta="Math.round(requestsTrend)"
          :sparkline-data="store.requestsHistory"
        />
      </div>

      <!-- Main Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
        <CpuChart />
        <MemoryChart />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-80">
        <NetworkChart />
        <RequestsChart />
      </div>

      <!-- Activity Feed and Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 h-96">
          <ActivityFeed />
        </div>
        <div>
          <SummaryBar />
        </div>
      </div>
    </div>
  </AppLayout>
</template>
