<template>
  <div class="work-report">
    <h2>Отчет о проделанной работе</h2>
    <table>
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
        <tr v-for="item in reportItems" :key="item.id">
          <td>{{ item.date }}</td>
          <td>{{ item.transcription }}</td>
          <td>{{ item.audioFile }}</td>
          <td>{{ item.user }}</td>
          <td>{{ item.control }}</td>
          <td>{{ item.controller }}</td>
          <td>{{ item.duration }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const reportItems = ref([
  {
    id: 1,
    date: '11.05.24',
    transcription: 'Я хотел оплатить',
    audioFile: 'mp3/d374-827-673d.mp3',
    user: 'Гончаров Иван',
    control: 'Верно',
    controller: 'Святослав Евлампий',
    duration: 22,
  },
  {
    id: 2,
    date: '11.05.24',
    transcription: 'Я хотел оплатить',
    audioFile: 'mp3/d374-827-673d.mp3',
    user: 'Гончаров Иван',
    control: 'Верно',
    controller: 'Святослав Евлампий',
    duration: 15,
  },
  {
    id: 3,
    date: '11.05.24',
    transcription: 'Я хотел оплатить',
    audioFile: 'mp3/d374-827-673d.mp3',
    user: 'Гончаров Иван',
    control: 'Верно',
    controller: 'Святослав Евлампий',
    duration: 44,
  },
])
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
