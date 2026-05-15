import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ECharts from 'vue-echarts'

import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.component('EChart', ECharts)
app.use(createPinia())
app.use(router)

app.mount('#app')
