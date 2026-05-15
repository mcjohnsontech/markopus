<script setup lang="ts">
import { useMetricsStore } from '@/stores/metrics.store'
import { Clock, Gauge, Radio, AlertTriangle } from 'lucide-vue-next'

const store = useMetricsStore()

const summaryItems = [
  {
    icon: Clock,
    label: 'Uptime',
    value: () => {
      const hours = Math.floor(store.uptime / 3600)
      const minutes = Math.floor((store.uptime % 3600) / 60)
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
    },
  },
  {
    icon: Gauge,
    label: 'Avg Latency',
    value: () => `${Math.round(store.avgLatency)}ms`,
  },
  {
    icon: Radio,
    label: 'Packet Loss',
    value: () => `${store.packetLoss.toFixed(2)}%`,
  },
  {
    icon: AlertTriangle,
    label: 'Error Rate',
    value: () => `${store.errorRate.toFixed(2)}%`,
  },
]
</script>

<template>
  <div class="card p-6">
    <h3 class="card-header mb-5">System Summary</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in summaryItems"
        :key="item.label"
        class="p-4 rounded-lg border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:border-slate-600 transition-colors"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 rounded-lg bg-blue-500/20">
            <component :is="item.icon" class="w-5 h-5 text-blue-400" />
          </div>
          <span class="text-xs font-semibold tracking-widest text-slate-400 uppercase">{{ item.label }}</span>
        </div>
        <p class="text-2xl font-bold text-white">{{ item.value() }}</p>
      </div>
    </div>
  </div>
</template>
