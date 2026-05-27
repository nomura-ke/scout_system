import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    currentRole: localStorage.getItem('currentRole') || null,
    availableRoles: []
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    username: (state) => state.user?.username || '',
    isCreator: (state) => state.currentRole === 'creator',
    isLeader: (state) => state.currentRole === 'leader',
    isAdmin: (state) => state.currentRole === 'admin'
  },

  actions: {
    // ログイン
    async login(username, password) {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          username,
          password
        })
        
        this.token = response.data.token
        this.user = response.data.user
        
        localStorage.setItem('token', this.token)
        
        return { success: true }
      } catch (error) {
        console.error('Login error:', error)
        return { 
          success: false, 
          message: error.response?.data?.message || 'ログインに失敗しました'
        }
      }
    },

    // ユーザー登録
    async register(username, password) {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
          username,
          password
        })
        
        return { success: true, message: '登録が完了しました' }
      } catch (error) {
        console.error('Register error:', error)
        return { 
          success: false, 
          message: error.response?.data?.message || '登録に失敗しました'
        }
      }
    },

    // ロール一覧取得
    async fetchUserRoles() {
      try {
        const response = await axios.get(`${API_BASE_URL}/roles/user`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        
        this.availableRoles = response.data.roles
        return { success: true }
      } catch (error) {
        console.error('Fetch roles error:', error)
        return { success: false }
      }
    },

    // ロール選択
    async selectRole(roleId) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/roles/select`,
          { roleId },
          { headers: { Authorization: `Bearer ${this.token}` } }
        )
        
        const role = this.availableRoles.find(r => r.id === roleId)
        this.currentRole = role?.name
        localStorage.setItem('currentRole', this.currentRole)
        
        return { success: true }
      } catch (error) {
        console.error('Select role error:', error)
        return { success: false }
      }
    },

    // ログアウト
    async logout() {
      try {
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${this.token}` } }
        )
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.currentRole = null
        this.availableRoles = []
        localStorage.removeItem('token')
        localStorage.removeItem('currentRole')
      }
    }
  }
})