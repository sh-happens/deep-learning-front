import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import App from './App.vue'
import router from './router'

import { useAuthStore } from '@/store/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('AgGridVue', AgGridVue)
const authStore = useAuthStore()
authStore.initializeStore()

app.mount('#app')
