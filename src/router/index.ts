import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const DashboardPage = defineAsyncComponent(() => import('@/pages/DashboardPage.vue'))
const MetricsPage = defineAsyncComponent(() => import('@/pages/MetricsPage.vue'))
const ActivityPage = defineAsyncComponent(() => import('@/pages/ActivityPage.vue'))
const AlertsPage = defineAsyncComponent(() => import('@/pages/AlertsPage.vue'))
const SettingsPage = defineAsyncComponent(() => import('@/pages/SettingsPage.vue'))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: DashboardPage,
    },
    {
      path: '/metrics',
      name: 'Metrics',
      component: MetricsPage,
    },
    {
      path: '/activity',
      name: 'Activity',
      component: ActivityPage,
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: AlertsPage,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsPage,
    },
  ],
})

export default router
