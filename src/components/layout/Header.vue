<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useMetricsStore } from '@/stores/metrics.store'
import { Menu, Moon, Sun } from 'lucide-vue-next'
import StatusBadge from '@/components/ui/StatusBadge.vue'

defineEmits<{
  toggleSidebar: []
}>()

const store = useMetricsStore()
const currentTime = ref('')
const isDarkMode = ref(true)

onMounted(() => {
  const updateTime = () => {
    currentTime.value = new Date().toLocaleTimeString()
  }
  updateTime()
  const interval = setInterval(updateTime, 1000)

  onBeforeUnmount(() => clearInterval(interval))
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <header class="h-16 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border-b border-slate-800/50 flex items-center justify-between px-6 backdrop-blur-sm">
    <!-- Left side -->
    <div class="flex items-center gap-4">
      <button
        @click="$emit('toggleSidebar')"
        class="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-slate-100"
        title="Toggle Sidebar"
      >
        <Menu class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-lg font-bold text-white tracking-tight">InfraWatch</h1>
        <p class="text-xs text-slate-500">Real-Time Infrastructure Monitor</p>
      </div>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-6">
      <!-- Connection Status -->
      <StatusBadge :status="store.connectionStatus" />

      <!-- Clock -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-500">UTC</span>
        <time class="text-sm text-slate-300 font-mono font-semibold min-w-24 text-right">
          {{ currentTime }}
        </time>
      </div>

      <!-- Theme Toggle -->
      <button
        @click="toggleTheme"
        class="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
        title="Toggle Theme"
      >
        <Moon v-if="isDarkMode" class="w-5 h-5" />
        <Sun v-else class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>
