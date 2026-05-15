<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle, Info } from 'lucide-vue-next'
import { useMetricsStore } from '@/stores/metrics.store'

const store = useMetricsStore()

const severityIcon = {
  critical: AlertCircle,
  warning: AlertCircle,
  info: Info,
}

const severityColor = {
  critical: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
}

const severityBg = {
  critical: 'bg-red-500/10',
  warning: 'bg-yellow-500/10',
  info: 'bg-blue-500/10',
}

const recentLogs = computed(() => store.filteredLogs.slice(0, 20))

const getRelativeTime = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  return `${Math.floor(seconds / 3600)}h ago`
}
</script>

<template>
  <div class="card flex flex-col h-full p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-5">
      <h3 class="card-header m-0">Live Activity Feed</h3>
      <span v-if="store.filteredLogs.length > 0" class="text-xs font-semibold text-slate-400">
        {{ store.filteredLogs.length }} events
      </span>
    </div>

    <!-- Activity list -->
    <div class="flex-1 overflow-y-auto space-y-3 mb-4">
      <!-- Empty state -->
      <div
        v-if="recentLogs.length === 0"
        class="flex flex-col items-center justify-center h-32 text-slate-400"
      >
        <div class="text-3xl mb-2">📭</div>
        <p class="text-sm">No recent activity</p>
      </div>

      <!-- Activity items -->
      <div
        v-for="log in recentLogs"
        :key="log.id"
        :class="[
          'p-4 rounded-lg border transition-all hover:border-opacity-100',
          severityBg[log.severity],
        ]"
      >
        <div class="flex items-start gap-3">
          <component
            :is="severityIcon[log.severity]"
            :class="['w-5 h-5 flex-shrink-0 mt-0', severityColor[log.severity]]"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-100 break-words">{{ log.message }}</p>
            <p class="text-xs text-slate-500 mt-1.5">{{ getRelativeTime(log.timestamp) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter buttons -->
    <div class="divider mb-4"></div>
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="filter in ['all', 'critical', 'warning', 'info']"
        :key="filter"
        @click="store.setLogFilter(filter as any)"
        :class="[
          'px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
          store.logFilter === filter
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
            : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600',
        ]"
      >
        {{ filter === 'critical' ? '🔴' : filter === 'warning' ? '🟡' : filter === 'info' ? '🔵' : '📋' }}
        {{ filter.charAt(0).toUpperCase() + filter.slice(1) }}
      </button>
    </div>
  </div>
</template>
