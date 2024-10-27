<script setup>
import AudioPlayerComponent from '@/components/AudioPlayerComponent.vue'
import { useAuthStore } from '@/store/auth'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const authStore = useAuthStore()
const route = useRoute()
const audioId = route.params.id

const stats = ref({
  totalProcessed: 0,
  totalHours: 0,
  correctTranscriptions: 0,
  incorrectTranscriptions: 0,
})

const audio = ref({})
const loading = ref(false)
const error = ref(null)
const successMessage = ref(null)

const history = ref([
  {
    date: '23.11.2023 16:44',
    text: 'Я делаю им все расписания...',
  },
])

const formatDate = date => {
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleSave = async () => {
  loading.value = true
  error.value = null
  successMessage.value = null

  try {
    await axios.put(
      `http://localhost:5000/api/transcriptions/transcriber/${audioId}`,
      {
        audioId: audioId,
        existingText: audio.value.existingText,
        isUnsuitable: false,
        comments: null,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )
    successMessage.value = 'Транскрипция успешно сохранена'
    await loadStats()
    await loadAudioTitle()
  } catch (err) {
    error.value = err.response?.data?.msg || 'Ошибка при сохранении'
  } finally {
    loading.value = false
  }
}

const handleReject = async () => {
  loading.value = true
  error.value = null
  successMessage.value = null

  try {
    await axios.put(
      `http://localhost:5000/api/transcriptions/transcriber/${audioId}`,
      {
        audioId: audioId,
        existingText: audio.value.existingText,
        isUnsuitable: true,
        comments: 'Not suitable for transcription',
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )
    successMessage.value = 'Аудио помечено как непригодное'
    await loadStats()
    await loadAudioTitle()
  } catch (err) {
    error.value = err.response?.data?.msg || 'Ошибка при отклонении'
  } finally {
    loading.value = false
  }
}

const fetchUserStats = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/transcriptions/user-stats',
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw error
  }
}

const fetchAudioById = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/audio/${audioId}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error fetching audio:', error)
    throw error
  }
}

const fetchHistoryById = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/transcriptions/history/${audioId}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )
    history.value = response.data
  } catch (error) {
    console.error('Error fetching history:', error)
  }
}

const loadStats = async () => {
  loading.value = true
  error.value = null

  try {
    const data = await fetchUserStats()
    stats.value = {
      totalProcessed: data.totalProcessed,
      totalHours: data.totalHours,
      correctTranscriptions: data.correctTranscriptions,
      incorrectTranscriptions: data.incorrectTranscriptions,
    }
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    error.value = 'Failed to load statistics'
  } finally {
    loading.value = false
  }
}

const loadAudioTitle = async () => {
  loading.value = true
  error.value = null

  try {
    if (authStore.userRole === 'transcriber') {
      try {
        await axios.put(
          `http://localhost:5000/api/audio/${audioId}/assign`,
          {
            userId: authStore.user.id, // Send userId in request body
          },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          },
        )
        // eslint-disable-next-line no-unused-vars
      } catch (assignError) {
        console.log('Assignment failed or already assigned')
      }
    }

    const data = await fetchAudioById()

    if (
      authStore.userRole === 'transcriber' &&
      data.audio.assignedTo?._id !== authStore.user.id
    ) {
      error.value = 'This audio is not assigned to you'
      return
    }

    audio.value = {
      audioFileName: data.audio.filename,
      existingText: data.transcription?.existingText || '',
    }
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    error.value = 'Failed to load audio data'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loadStats()
  loadAudioTitle()
  fetchHistoryById()
})
</script>

<template>
  <div class="transcribe-container">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">Loading...</div>
    </div>
    <div class="stats-header">
      <div class="role">Роль пользователя: {{ authStore.userRole }}</div>
      <div v-if="loading" class="stats">Loading...</div>
      <div v-else-if="error" class="stats error">{{ error }}</div>
      <div v-else class="stats">
        <div>Количество отработанных записей: {{ stats.totalProcessed }}</div>
        <div>Количество отработанных часов: {{ stats.totalHours }}</div>
        <div>Транскрибировано верно: {{ stats.correctTranscriptions }}</div>
        <div>Транскрибировано неверно: {{ stats.incorrectTranscriptions }}</div>
      </div>
    </div>

    <div class="main-content">
      <div class="left-section">
        <AudioPlayerComponent :audioSrc="`/audio/${audio.audioFileName}`" />
        <textarea
          v-model="audio.existingText"
          class="transcription-input"
          placeholder="Enter transcription here"
        ></textarea>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="action-buttons">
          <button class="reject-btn" @click="handleReject" :disabled="loading">
            {{ loading ? 'Обработка...' : 'Не годен для транскрибации' }}
          </button>
          <button class="save-btn" @click="handleSave" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </div>

      <div class="history-section">
        <div class="history-header">
          <div>Дата</div>
          <div>Транскрибация</div>
        </div>
        <div v-for="(item, index) in history" :key="index" class="history-item">
          <div>{{ formatDate(item.date) }}</div>
          <div>{{ item.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transcribe-container {
  padding: 20px;
  background-color: #f0e6ff;
  min-height: 100vh;
}

.stats-header {
  margin-bottom: 20px;
}

.role {
  font-weight: bold;
  margin-bottom: 10px;
}

.error-message {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.success-message {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.left-section {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
}

.speed-control {
  margin-bottom: 20px;
}

.speed-marks {
  display: flex;
  justify-content: space-between;
  width: 100px;
  margin-top: 5px;
}

.transcription-input {
  width: 100%;
  min-height: 100px;
  margin: 20px 0;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: white;
  resize: vertical;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.reject-btn,
.save-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reject-btn {
  background-color: #e0ffe0;
  color: #333;
}

.save-btn {
  background-color: #e0ffe0;
  color: #333;
}

.reject-btn:hover,
.save-btn:hover {
  opacity: 0.9;
}

.reject-btn:disabled,
.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.history-section {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
}

.history-table {
  width: 100%;
}

.history-header {
  display: grid;
  grid-template-columns: 1fr 2fr;
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.history-item {
  display: grid;
  grid-template-columns: 1fr 2fr;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
