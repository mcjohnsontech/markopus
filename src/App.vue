<script setup lang="ts">
import { Suspense } from 'vue'
</script>

<template>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <div class="flex items-center justify-center h-screen bg-slate-950">
        <div class="text-center">
          <div class="text-2xl font-bold text-white mb-2">Loading Dashboard...</div>
          <div class="text-slate-400">Initializing InfraWatch</div>
        </div>
      </div>
    </template>
  </Suspense>
</template>
