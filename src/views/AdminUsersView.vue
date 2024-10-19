<template>
  <div class="user-report">
    <h2>Отчет по пользователям</h2>
    <table>
      <thead>
        <tr>
          <th>Пользователь (ФИО)</th>
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
          <td>{{ user.correctTranscriptions }}</td>
          <td>{{ user.incorrectTranscriptions }}</td>
          <td>{{ user.unsuitable }}</td>
          <td>{{ user.totalTasks }}</td>
          <td>{{ user.totalTime }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  {
    id: 1,
    name: 'Гончаров Иван',
    correctTranscriptions: 139,
    incorrectTranscriptions: 5,
    unsuitable: 2,
    totalTasks: 146,
    totalTime: '58 минут',
  },
])
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
