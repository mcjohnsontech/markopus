<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useMetricsStore } from '@/stores/metrics.store'
import { useWebSocket } from '@/composables/useWebSocket'
import { Moon, Sun } from 'lucide-vue-next'

const store = useMetricsStore()
const isDarkMode = ref(true)
const isPaused = ref(false)

const { isConnected } = useWebSocket()

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const togglePause = () => {
  isPaused.value = !isPaused.value
  store.togglePause()
}

const clearAllData = () => {
  if (confirm('Are you sure you want to clear all metrics and logs?')) {
    store.clearAllMetrics()
  }
}
</script>

<template>
  <AppLayout>
    <div class="space-y-6 max-w-2xl">
      <h1 class="text-2xl font-bold text-white">Settings</h1>

      <!-- Display Settings -->
      <div class="card">
        <h2 class="card-header">Display</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div>
              <p class="text-sm font-medium text-white">Dark Mode</p>
              <p class="text-xs text-slate-400">Use dark theme throughout the application</p>
            </div>
            <button
              @click="toggleTheme"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                isDarkMode ? 'bg-blue-600' : 'bg-slate-600',
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  isDarkMode ? 'translate-x-6' : 'translate-x-1',
                ]"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Data Collection -->
      <div class="card">
        <h2 class="card-header">Data Collection</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div>
              <p class="text-sm font-medium text-white">Pause Collection</p>
              <p class="text-xs text-slate-400">Temporarily pause metrics collection</p>
            </div>
            <button
              @click="togglePause"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                store.isPaused ? 'bg-blue-600' : 'bg-slate-600',
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  store.isPaused ? 'translate-x-6' : 'translate-x-1',
                ]"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Connection Status -->
      <div class="card">
        <h2 class="card-header">Connection</h2>
        <div class="p-4 bg-slate-800 rounded-lg space-y-3">
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-300">WebSocket Status</p>
            <div class="flex items-center gap-2">
              <div
                :class="[
                  'w-2 h-2 rounded-full',
                  isConnected() ? 'bg-green-500' : 'bg-red-500',
                ]"
              ></div>
              <span class="text-sm font-medium">
                {{ isConnected() ? 'Connected' : 'Disconnected' }}
              </span>
            </div>
          </div>
          <p class="text-xs text-slate-400">Server: ws://localhost:8888</p>
        </div>
      </div>

      <!-- Data Management -->
      <div class="card">
        <h2 class="card-header">Data Management</h2>
        <div class="p-4 bg-slate-800 rounded-lg">
          <button
            @click="clearAllData"
            class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Clear All Metrics & Logs
          </button>
          <p class="text-xs text-slate-400 mt-2">This action cannot be undone</p>
        </div>
      </div>

      <!-- About -->
      <div class="card">
        <h2 class="card-header">About</h2>
        <div class="p-4 bg-slate-800 rounded-lg space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-400">Version</span>
            <span class="text-white">1.0.0</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Built with</span>
            <span class="text-white">Vue 3 + ECharts</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Metrics Stored</span>
            <span class="text-white">{{ store.metrics.length }}/100</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Activity Logs</span>
            <span class="text-white">{{ store.activityLogs.length }}/200</span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
