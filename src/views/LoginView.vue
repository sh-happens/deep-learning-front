<template>
  <div>
    <h2>Вход</h2>
    <form @submit.prevent="handleLogin">
      <input
        v-model="username"
        type="text"
        placeholder="Имя пользователя"
        required
      />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <button type="submit">Войти</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value)
    router.push('/')
  } catch (error) {
    console.error('Login failed', error)
  }
}
</script>
