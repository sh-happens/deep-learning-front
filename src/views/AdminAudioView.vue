<template>
  <div class="admin-audio">
    <h2>Управление аудиофайлами</h2>
    <input type="file" @change="handleFileUpload" accept="audio/*" />
    <button @click="uploadAudio">Загрузить новое аудио</button>
    <table>
      <thead>
        <tr>
          <th>Имя файла</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="audio in audioFiles" :key="audio._id">
          <td>{{ audio.filename }}</td>
          <td>{{ audio.status }}</td>
          <td>
            <button @click="deleteAudio(audio._id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()
const audioFiles = ref([])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const fetchAudioFiles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/audio`, {
      headers: { 'x-auth-token': authStore.token },
    })
    audioFiles.value = response.data
  } catch (error) {
    console.error('Ошибка при получении аудиофайлов', error)
  }
}

const uploadAudio = async () => {
  console.log('Загрузка аудиофайла')
}

const deleteAudio = async audioId => {
  try {
    await axios.delete(`${API_BASE_URL}/api/audio/${audioId}`, {
      headers: { 'x-auth-token': authStore.token },
    })
    await fetchAudioFiles()
  } catch (error) {
    console.error('Ошибка при удалении аудиофайла', error)
  }
}

const handleFileUpload = event => {
  // Добавьте здесь логику загрузки файла
  console.log('Выбран файл:', event.target.files[0])
}

onMounted(fetchAudioFiles)
</script>
