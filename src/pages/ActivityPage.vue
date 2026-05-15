<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import ActivityFeed from '@/components/widgets/ActivityFeed.vue'
import { useWebSocket } from '@/composables/useWebSocket'

useWebSocket()
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">Activity Log</h1>

      <div class="h-full">
        <ActivityFeed />
      </div>
    </div>
  </AppLayout>
</template>
