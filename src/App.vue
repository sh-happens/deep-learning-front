<template>
  <div id="app">
    <nav>
      <router-link to="/">Главная</router-link> |
      <template v-if="!authStore.isAuthenticated">
        <router-link to="/login">Вход</router-link>
      </template>
      <template v-else>
        <router-link v-if="authStore.user?.role === 'admin'" to="/admin"
          >Панель администратора</router-link
        >
        <router-link
          v-if="authStore.user?.role === 'transcriber'"
          to="/transcribe"
          >Транскрибировать</router-link
        >
        <router-link v-if="authStore.user?.role === 'controller'" to="/verify"
          >Проверить</router-link
        >
        <a href="#" @click.prevent="logout">| Выход</a>
      </template>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useAuthStore } from './store/auth'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}

watch(
  () => authStore.isAuthenticated,
  isAuthenticated => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  },
)
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  margin: 0 10px;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
