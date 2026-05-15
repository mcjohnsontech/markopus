<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import CpuChart from '@/components/charts/CpuChart.vue'
import MemoryChart from '@/components/charts/MemoryChart.vue'
import NetworkChart from '@/components/charts/NetworkChart.vue'
import RequestsChart from '@/components/charts/RequestsChart.vue'
import { useWebSocket } from '@/composables/useWebSocket'

useWebSocket()
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-white">Metrics</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        <CpuChart />
        <MemoryChart />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        <NetworkChart />
        <RequestsChart />
      </div>
    </div>
  </AppLayout>
</template>
