import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userType = computed(() => user.value?.type || null)
  const userName = computed(() => user.value?.name || '')

  async function login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password })
      
      if (response.data.success) {
        user.value = response.data.user
        token.value = response.data.token
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('userEmail', email) // Salva email para headers
        return { success: true }
      }
      
      return { success: false, message: response.data.message }
    } catch (error) {
      return { success: false, message: 'Erro ao conectar com servidor' }
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
  }

  async function checkAuth() {
    if (token.value) {
      try {
        const response = await api.get('/auth/me')
        user.value = response.data.user
      } catch (error) {
        logout()
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    userType,
    userName,
    login,
    logout,
    checkAuth
  }
})
