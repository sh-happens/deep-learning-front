import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/login',
          { username, password },
        )
        this.token = response.data.token
        localStorage.setItem('token', this.token)
      } catch (error) {
        console.error('Login failed', error)
        throw error
      }
    },
    async register(username, password, role) {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/register',
          { username, password, role },
        )
        this.token = response.data.token
        localStorage.setItem('token', this.token)
      } catch (error) {
        console.error('Registration failed', error)
        throw error
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },
  },
  getters: {
    isAuthenticated: state => !!state.token,
  },
})
