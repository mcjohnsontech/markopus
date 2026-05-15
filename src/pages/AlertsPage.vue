<script setup lang="ts">
import { computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useMetricsStore } from '@/stores/metrics.store'
import { useWebSocket } from '@/composables/useWebSocket'
import { AlertCircle, Info } from 'lucide-vue-next'

const store = useMetricsStore()
useWebSocket()

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
  critical: 'bg-red-500/10 border-red-500/20',
  warning: 'bg-yellow-500/10 border-yellow-500/20',
  info: 'bg-blue-500/10 border-blue-500/20',
}

const criticalAndWarnings = computed(() => {
  return store.activityLogs.filter((log) => log.severity === 'critical' || log.severity === 'warning')
})

const getRelativeTime = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  return `${Math.floor(seconds / 3600)}h ago`
}
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-white">Alerts</h1>
        <div class="text-sm text-slate-400">
          <span class="text-red-500 font-semibold">{{ store.criticalAlertsCount }}</span>
          critical,
          <span class="text-yellow-500 font-semibold">{{ store.warningAlertsCount }}</span>
          warnings
        </div>
      </div>

      <!-- Alerts list -->
      <div class="card">
        <div v-if="criticalAndWarnings.length === 0" class="text-center py-12">
          <p class="text-slate-400">No alerts at this time</p>
        </div>

        <div v-else class="space-y-3 max-h-96 overflow-y-auto">
          <div
            v-for="log in criticalAndWarnings"
            :key="log.id"
            :class="[
              'p-4 rounded-lg border transition-colors',
              severityBg[log.severity],
            ]"
          >
            <div class="flex items-start gap-3">
              <component
                :is="severityIcon[log.severity]"
                :class="['w-5 h-5 flex-shrink-0 mt-0.5', severityColor[log.severity]]"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <p class="text-sm font-semibold text-slate-100">{{ log.message }}</p>
                  <span
                    :class="[
                      'text-xs px-2 py-1 rounded',
                      log.severity === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500',
                    ]"
                  >
                    {{ log.severity.toUpperCase() }}
                  </span>
                </div>
                <p class="text-xs text-slate-500">{{ getRelativeTime(log.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
