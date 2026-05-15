<script setup lang="ts">
defineProps<{
  state: 'loading' | 'no-data' | 'reconnecting' | 'error'
}>()

const fallbackConfig = {
  loading: {
    title: 'Initializing Metrics',
    message: 'Setting up data collectors...',
    icon: '⏳',
    subtext: 'This usually takes a few seconds',
  },
  'no-data': {
    title: 'Awaiting Telemetry',
    message: 'No metrics have been collected yet',
    icon: '📊',
    subtext: 'Data should arrive shortly',
  },
  reconnecting: {
    title: 'Connection Lost',
    message: 'Attempting to reconnect to telemetry server',
    icon: '🔌',
    subtext: 'Auto-reconnecting with exponential backoff...',
  },
  error: {
    title: 'Telemetry Connection Failed',
    message: 'Unable to establish connection to metrics endpoint',
    icon: '⚠️',
    subtext: 'Check server status or network connectivity',
  },
}
</script>

<template>
  <div
    class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-lg backdrop-blur-sm border border-slate-700/30"
  >
    <div class="text-5xl mb-4 opacity-70">{{ fallbackConfig[state].icon }}</div>
    <h3 class="text-lg font-bold text-slate-100 mb-2 tracking-tight">
      {{ fallbackConfig[state].title }}
    </h3>
    <p class="text-sm text-slate-300 mb-2">{{ fallbackConfig[state].message }}</p>
    <p class="text-xs text-slate-500">{{ fallbackConfig[state].subtext }}</p>
  </div>
</template>
