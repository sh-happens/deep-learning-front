<template>
  <div class="home">
    <h1>Welcome to the Transcription App</h1>
    <div v-if="authStore.isAuthenticated">
      <p>Hello, {{ authStore.user?.username }}</p>
      <div v-if="authStore.user?.role === 'admin'">
        <h2>Admin Dashboard</h2>
        <button @click="navigateTo('/admin/users')">Manage Users</button>
        <button @click="navigateTo('/admin/audio')">Manage Audio Files</button>
      </div>
      <div v-else-if="authStore.user?.role === 'transcriber'">
        <h2>Transcriber Dashboard</h2>
        <button @click="navigateTo('/transcribe')">Start Transcribing</button>
      </div>
      <div v-else-if="authStore.user?.role === 'controller'">
        <h2>Controller Dashboard</h2>
        <button @click="navigateTo('/verify')">Verify Transcriptions</button>
      </div>
    </div>
    <div v-else>
      <p>Please log in to access the app features.</p>
      <button @click="navigateTo('/login')">Log In</button>
      <button @click="navigateTo('/register')">Register</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const navigateTo = path => {
  router.push(path)
}
</script>
