<script setup lang="ts">
import type { ConnectionStatus } from '@/types'

defineProps<{
  status: ConnectionStatus
}>()

const statusConfig: Record<ConnectionStatus, { color: string; label: string }> = {
  connecting: { color: 'bg-yellow-500', label: 'Connecting' },
  connected: { color: 'bg-green-500', label: 'Connected' },
  disconnected: { color: 'bg-slate-500', label: 'Disconnected' },
  error: { color: 'bg-red-500', label: 'Error' },
}
</script>

<template>
  <div class="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg">
    <div :class="[statusConfig[status].color, 'w-2 h-2 rounded-full animate-pulse']"></div>
    <span class="text-xs font-medium text-slate-300">{{ statusConfig[status].label }}</span>
  </div>
</template>
