<template>
  <div class="user-report">
    <h2>Отчет по пользователям</h2>
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <table v-else>
      <thead>
        <tr>
          <th>Пользователь (ФИО)</th>
          <th>Роль</th>
          <th>Количество правильных транскрибаций</th>
          <th>Количество не правильных транскрибаций</th>
          <th>Количество негодных к транскрибации</th>
          <th>Общее кол-во выполненных заданий</th>
          <th>Общее отработанное время</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ formatRole(user.role) }}</td>
          <td>{{ user.correctTranscriptions || 0 }}</td>
          <td>{{ user.incorrectTranscriptions || 0 }}</td>
          <td>{{ user.unsuitable || 0 }}</td>
          <td>{{ user.totalTasks || 0 }}</td>
          <td>Не доступно</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const users = ref([])
const loading = ref(true)
const error = ref(null)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const authStore = useAuthStore()

const formatRole = role => {
  const roles = {
    transcriber: 'Транскрайбер',
    controller: 'Контроллер',
    admin: 'Администратор',
  }
  return roles[role] || role
}

const fetchStats = async () => {
  try {
    loading.value = true
    const response = await axios.get(
      `${API_BASE_URL}/api/transcriptions/stats`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )
    console.log('Response:', response.data)
    users.value = response.data
  } catch (err) {
    error.value =
      'Ошибка при загрузке данных: ' + (err.response?.data || err.message)
    console.error('Error fetching stats:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.user-report {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff1f1;
  border-radius: 8px;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  font-size: 1.1em;
}

.error {
  color: #dc3545;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
