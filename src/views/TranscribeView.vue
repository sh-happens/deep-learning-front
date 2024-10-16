<template>
  <div class="transcribe">
    <h2>Transcribe Audio</h2>
    <div v-if="currentAudio">
      <audio controls :src="currentAudio.url"></audio>
      <textarea v-model="transcription" rows="10" cols="50"></textarea>
      <button @click="submitTranscription">Submit Transcription</button>
    </div>
    <div v-else>
      <p>No audio files available for transcription.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../store/auth.js'

const authStore = useAuthStore()
const currentAudio = ref(null)
const transcription = ref('')

const fetchAudioForTranscription = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/audio/next-for-transcription',
      {
        headers: { 'x-auth-token': authStore.token },
      },
    )
    currentAudio.value = response.data
  } catch (error) {
    console.error('Error fetching audio for transcription', error)
  }
}

const submitTranscription = async () => {
  try {
    await axios.post(
      'http://localhost:5000/api/transcriptions',
      {
        audioId: currentAudio.value._id,
        text: transcription.value,
      },
      {
        headers: { 'x-auth-token': authStore.token },
      },
    )
    transcription.value = ''
    await fetchAudioForTranscription()
  } catch (error) {
    console.error('Error submitting transcription', error)
  }
}

onMounted(fetchAudioForTranscription)
</script>
