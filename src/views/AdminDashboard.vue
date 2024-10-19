<template>
  <div class="admin-dashboard">
    <h2>Панель администратора</h2>

    <div class="stats">
      <h3>Статистика</h3>
      <p>Обработанные записи: {{ stats.processedRecords }}</p>
      <p>Всего записей: {{ stats.totalRecords }}</p>
      <p>Оставшиеся записи: {{ stats.remainingRecords }}</p>
    </div>

    <div class="unsuitable-records">
      <h3>Записи, непригодные для транскрипции</h3>
      <ul>
        <li v-for="record in unsuitableRecords" :key="record._id">
          {{ record.filename }}
          <button @click="openTranscriber(record._id)">
            Открыть в транскрайбере
          </button>
        </li>
      </ul>
    </div>

    <div class="add-user">
      <h3>Добавить нового пользователя</h3>
      <form @submit.prevent="addUser">
        <input
          v-model="newUser.username"
          placeholder="Имя пользователя"
          required
        />
        <input
          v-model="newUser.password"
          type="password"
          placeholder="Пароль"
          required
        />
        <select v-model="newUser.role" required>
          <option value="admin">Администратор</option>
          <option value="transcriber">Транскрайбер</option>
          <option value="controller">Контролер</option>
        </select>
        <button type="submit">Добавить пользователя</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref({
  processedRecords: 0,
  totalRecords: 0,
  remainingRecords: 0,
})

const unsuitableRecords = ref([])

const newUser = ref({
  username: '',
  password: '',
  role: 'transcriber',
})

const fetchStats = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/admin/stats', {
      headers: { 'x-auth-token': authStore.token },
    })
    stats.value = response.data
  } catch (error) {
    console.error('Error fetching stats', error)
  }
}

const fetchUnsuitableRecords = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/admin/unsuitable-records',
      {
        headers: { 'x-auth-token': authStore.token },
      },
    )
    unsuitableRecords.value = response.data
  } catch (error) {
    console.error('Error fetching unsuitable records', error)
  }
}

const openTranscriber = recordId => {
  router.push({ name: 'Transcribe', params: { id: recordId } })
}

const addUser = async () => {
  try {
    await axios.post('http://localhost:5000/api/admin/users', newUser.value, {
      headers: { 'x-auth-token': authStore.token },
    })
    alert('User added successfully')
    newUser.value = { username: '', password: '', role: 'transcriber' }
  } catch (error) {
    console.error('Error adding user', error)
    alert('Failed to add user')
  }
}

onMounted(() => {
  fetchStats()
  fetchUnsuitableRecords()
})
</script>

<style scoped>
.admin-dashboard {
  max-width: 800px;
  margin: 0 auto;
}

.stats,
.unsuitable-records,
.add-user {
  margin-bottom: 2rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 0.5rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 300px;
}

button {
  cursor: pointer;
}
</style>
