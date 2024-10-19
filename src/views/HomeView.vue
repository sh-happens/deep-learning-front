<template>
  <div class="home">
    <h1>Добро пожаловать в приложение для транскрипции</h1>
    <div v-if="authStore.isAuthenticated">
      <p>Здравствуйте, {{ authStore.user?.username }}</p>
      <div v-if="authStore.user?.role === 'admin'">
        <h2>Панель администратора</h2>
        <button @click="navigateTo('/admin/users')">
          Управление пользователями
        </button>
        <button @click="navigateTo('/admin/audio')">
          Управление аудиофайлами
        </button>
      </div>
      <div v-else-if="authStore.user?.role === 'transcriber'">
        <h2>Панель транскрайбера</h2>
        <button @click="navigateTo('/transcribe')">
          Начать транскрибирование
        </button>
      </div>
      <div v-else-if="authStore.user?.role === 'controller'">
        <h2>Панель контролера</h2>
        <button @click="navigateTo('/verify')">Проверить транскрипции</button>
      </div>
    </div>
    <div v-else>
      <p>
        Пожалуйста, войдите в систему, чтобы получить доступ к функциям
        приложения.
      </p>
      <button @click="navigateTo('/login')">Войти</button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
console.log('authstore: ', authStore)
const router = useRouter()

const navigateTo = path => {
  router.push(path)
}
</script>
