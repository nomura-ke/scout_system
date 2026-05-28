import { defineStore } from 'pinia'
import { login, selectRole } from '../api/scoutApi'
import type { LoginRequest, UserRole } from '../types'

interface AuthState {
  token: string | null
  userId: string | null
  role: UserRole | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    userId: null,
    role: null,
  }),
  actions: {
    async signIn(payload: LoginRequest) {
      const result = await login(payload)
      this.token = result.token
      this.userId = result.userId
    },
    async chooseRole(role: UserRole) {
      await selectRole(role)
      this.role = role
    },
    signOut() {
      this.token = null
      this.userId = null
      this.role = null
    },
  },
})
