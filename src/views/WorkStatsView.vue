<template>
  <div class="work-report">
    <h2>Отчет о проделанной работе</h2>
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <table v-else>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Транскрибация</th>
          <th>audio file</th>
          <th>Пользователь (ФИО)</th>
          <th>Контроль</th>
          <th>Контролер (ФИО)</th>
          <th>Длительность в сек.</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in reportItems" :key="item._id">
          <td>{{ formatDate(item.date) }}</td>
          <td>{{ item.transcription || 'Нет данных' }}</td>
          <td>{{ item.audioFile }}</td>
          <td>{{ item.user || 'Нет данных' }}</td>
          <td>{{ item.control || 'В ожидании' }}</td>
          <td>{{ item.controller || 'Нет данных' }}</td>
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

const authStore = useAuthStore()

const reportItems = ref([])
const loading = ref(true)
const error = ref(null)

const formatDate = dateString => {
  if (!dateString) return 'Нет данных'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

const fetchReport = async () => {
  try {
    loading.value = true
    const response = await axios.get(
      'http://localhost:5000/api/audio/work-report',
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )
    reportItems.value = response.data
  } catch (err) {
    error.value =
      'Ошибка при загрузке данных: ' + (err.response?.data || err.message)
    console.error('Error fetching report:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReport()
})
</script>

<style scoped>
.work-report {
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
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  font-size: 14px;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.filter-icon {
  margin-left: 5px;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.page-button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.page-button:hover {
  background-color: #f0f0f0;
}
</style>
