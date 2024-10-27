<template>
  <div class="control">
    <ag-grid-vue
      class="ag-theme-alpine"
      style="height: 600px"
      :columnDefs="columnDefs"
      :rowData="audioFiles"
      :defaultColDef="defaultColDef"
      :pagination="true"
      :paginationPageSize="20"
      @row-clicked="onRowClicked"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const authStore = useAuthStore()
const audioFiles = ref([])

const onRowClicked = event => {
  const audioId = event.data._id
  router.push(`/verify/${audioId}`)
}

const columnDefs = [
  {
    field: '_id',
    headerName: 'ID',
  },
  {
    field: 'filename',
    headerName: 'Название файла',
  },
  {
    field: 'status',
    headerName: 'Status',
  },
  {
    field: 'assignedTo',
    headerName: 'Назначен на',
    valueGetter: params => {
      const assignedId = params.data.assignedTo?._id
      if (!assignedId) return 'N/A'

      if (assignedId === authStore.user.id) {
        return authStore.user.username
      }

      return assignedId
    },
  },
]

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
}

const fetchAudioFiles = async () => {
  if (!authStore.token) return

  try {
    const response = await axios.get('http://localhost:5000/api/audio', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    audioFiles.value = response.data
  } catch (err) {
    console.error('Error fetching audio files:', err)
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchAudioFiles()
  }
})
</script>

<style scoped>
.control {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
