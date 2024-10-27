<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  audioSrc: {
    type: String,
    required: true,
  },
})

const audio = ref()
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const muted = ref(false)
const progress = ref(0)
const playbackRates = [0.5, 1, 1.5, 2]
const currentPlaybackRateIndex = ref(1)

const formatTime = time => {
  if (!time) return '00:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const togglePlay = async () => {
  if (!audio.value) return

  if (playing.value) {
    await audio.value.pause()
  } else {
    await audio.value.play()
  }
}

const updateProgress = () => {
  if (!audio.value || !duration.value) return
  progress.value = (currentTime.value / duration.value) * 100
}

const onProgressChange = event => {
  if (!audio.value || !duration.value) return
  const newTime = (event.target.value / 100) * duration.value
  currentTime.value = newTime
  audio.value.currentTime = newTime
}

const changePlaybackRate = () => {
  if (!audio.value) return
  currentPlaybackRateIndex.value =
    (currentPlaybackRateIndex.value + 1) % playbackRates.length
  audio.value.playbackRate = playbackRates[currentPlaybackRateIndex.value]
}

const toggleMute = () => {
  if (!audio.value) return
  audio.value.muted = !audio.value.muted
  muted.value = audio.value.muted
}

const updateVolume = event => {
  if (!audio.value) return
  audio.value.volume = event.target.value
  volume.value = event.target.value
}

const setupAudioEvents = () => {
  const audioElement = audio.value
  if (!audioElement) return

  audioElement.addEventListener('play', () => (playing.value = true))
  audioElement.addEventListener('pause', () => (playing.value = false))
  audioElement.addEventListener('timeupdate', () => {
    currentTime.value = audioElement.currentTime
    updateProgress()
  })
  audioElement.addEventListener('loadedmetadata', () => {
    duration.value = audioElement.duration
    volume.value = audioElement.volume
  })
  audioElement.addEventListener('volumechange', () => {
    volume.value = audioElement.volume
    muted.value = audioElement.muted
  })
  audioElement.addEventListener('ended', () => {
    playing.value = false
    currentTime.value = 0
  })
}

onMounted(() => {
  setupAudioEvents()
})

onUnmounted(() => {
  const audioElement = audio.value
  if (!audioElement) return

  audioElement.removeEventListener('play', () => {})
  audioElement.removeEventListener('pause', () => {})
  audioElement.removeEventListener('timeupdate', () => {})
  audioElement.removeEventListener('loadedmetadata', () => {})
  audioElement.removeEventListener('volumechange', () => {})
  audioElement.removeEventListener('ended', () => {})
})
</script>

<template>
  <div class="audio-player">
    <audio
      ref="audio"
      :src="audioSrc"
      preload="metadata"
      @error="e => console.error('Audio error:', e)"
    />
    <div class="controls">
      <button @click="togglePlay" class="play-btn">
        {{ playing ? '⏸️' : '▶️' }}
      </button>
      <div class="time-progress">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <input
          type="range"
          :value="progress"
          min="0"
          max="100"
          step="0.1"
          class="progress-bar"
          @input="onProgressChange"
        />
        <span class="time">{{ formatTime(duration) }}</span>
      </div>
      <div class="volume-controls">
        <button @click="toggleMute" class="mute-btn">
          {{ muted ? '🔇' : '🔊' }}
        </button>
        <input
          type="range"
          :value="volume"
          min="0"
          max="1"
          step="0.1"
          class="volume-slider"
          @input="updateVolume"
        />
      </div>
      <button @click="changePlaybackRate" class="speed-btn">
        {{ playbackRates[currentPlaybackRateIndex] }}x
      </button>
    </div>
  </div>
</template>

<style scoped>
.audio-player {
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  border-radius: 8px;
  background: #f5f5f5;
}

.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.time-progress {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 4px;
}

.volume-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.volume-slider {
  width: 80px;
}

button {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}

button:hover {
  background: #e0e0e0;
}

.time {
  font-family: monospace;
  min-width: 45px;
}
</style>
