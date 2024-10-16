<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="username">Username:</label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
          autocomplete="username"
        />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          autocomplete="new-password"
        />
      </div>
      <div>
        <label for="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          required
          autocomplete="new-password"
        />
      </div>
      <div>
        <label for="role">Role:</label>
        <select id="role" v-model="role" required>
          <option value="transcriber">Transcriber</option>
          <option value="controller">Controller</option>
        </select>
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('transcriber')
const error = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords don't match"
    return
  }

  try {
    await authStore.register(username.value, password.value, role.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.msg || 'Registration failed'
  }
}
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 0.5rem;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
