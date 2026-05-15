<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LayoutDashboard, BarChart3, Activity, AlertCircle, Settings, Menu, X } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  toggle: []
}>()

const router = useRouter()
const route = useRoute()

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    to: '/',
  },
  {
    icon: BarChart3,
    label: 'Metrics',
    to: '/metrics',
  },
  {
    icon: Activity,
    label: 'Activity',
    to: '/activity',
  },
  {
    icon: AlertCircle,
    label: 'Alerts',
    to: '/alerts',
  },
  {
    icon: Settings,
    label: 'Settings',
    to: '/settings',
  },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <aside
    :class="[
      'bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col',
      isOpen ? 'w-64' : 'w-20',
    ]"
  >
    <!-- Logo -->
    <div class="h-16 flex items-center justify-center border-b border-slate-800 px-4">
      <div v-if="isOpen" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">IW</span>
        </div>
        <span class="text-white font-semibold truncate">InfraWatch</span>
      </div>
      <div v-else class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-sm">IW</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <router-link
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
          isActive(item.to)
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800',
        ]"
      >
        <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
        <span v-if="isOpen" class="text-sm font-medium truncate">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>
