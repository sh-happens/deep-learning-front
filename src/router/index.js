import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import AdminAudio from '../views/AdminAudioView.vue'
import Transcribe from '../views/TranscribeView.vue'
import { useAuthStore } from '@/store/auth'
import AdminDashboard from '../views/AdminDashboard.vue'
import Control from '../views/ControlView.vue'
import AdminUsers from '../views/AdminUsersView.vue'
import AdminWorkStats from '@/views/WorkStatsView.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/audio',
    name: 'AdminAudio',
    component: AdminAudio,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/work-stats',
    name: 'AdminWorkStats',
    component: AdminWorkStats,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/transcribe',
    name: 'Transcribe',
    component: Transcribe,
    meta: { requiresAuth: true, roles: ['transcriber'] },
  },
  {
    path: '/verify',
    name: 'Control',
    component: Control,
    meta: { requiresAuth: true, roles: ['controller'] },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !authStore.isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router
