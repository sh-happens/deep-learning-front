<template>
  <div class="admin-audio">
    <h2>Manage Audio Files</h2>
    <button @click="uploadAudio">Upload New Audio</button>
    <table>
      <thead>
        <tr>
          <th>Filename</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="audio in audioFiles" :key="audio._id">
          <td>{{ audio.filename }}</td>
          <td>{{ audio.status }}</td>
          <td>
            <button @click="deleteAudio(audio._id)">Delete</button>
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

const fetchAudioFiles = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/audio', {
      headers: { 'x-auth-token': authStore.token },
    })
    audioFiles.value = response.data
  } catch (error) {
    console.error('Error fetching audio files', error)
  }
}

const uploadAudio = async () => {
  console.log('Upload audio file')
}

const deleteAudio = async audioId => {
  try {
    await axios.delete(`http://localhost:5000/api/audio/${audioId}`, {
      headers: { 'x-auth-token': authStore.token },
    })
    await fetchAudioFiles()
  } catch (error) {
    console.error('Error deleting audio file', error)
  }
}

onMounted(fetchAudioFiles)
</script>
