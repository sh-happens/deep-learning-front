import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
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
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
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
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        console.error('Registration failed', error)
        throw error
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    initializeStore() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
      }
    },
  },

  getters: {
    isAuthenticated: state => !!state.token,
    userRole: state => state.user?.role,
  },
})
