import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, selectRole, logout, getUserRoles } from '../api/scoutApi'
import type { LoginRequest, UserRole, UserRoleInfo } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const userId = ref<string | null>(null)
  const userName = ref<string | null>(null)
  const userRoles = ref<string | null>(null)
  const selectedRole = ref<UserRole | null>(null)
  const availableRoleList = ref<UserRoleInfo[]>([])
  const isAuthenticated = computed(() => !!token.value)
  const availableRoles = computed((): UserRole[] => {
    if (!userRoles.value) return []
    return userRoles.value.split(',').map(r => r.trim()) as UserRole[]
  })
  async function signIn(payload: LoginRequest) {
    const result = await login(payload)
    token.value = result.token
    userId.value = result.userId
    userName.value = result.user.name
    userRoles.value = result.user.role
    localStorage.setItem('token', result.token)
    localStorage.setItem('userId', result.userId)
    localStorage.setItem('userName', result.user.name)
    localStorage.setItem('userRoles', result.user.role)
  }
  async function fetchUserRoles() {
    const roles = await getUserRoles()
    availableRoleList.value = roles
  }
  async function chooseRole(role: UserRole) {
    await selectRole(role)
    selectedRole.value = role
    localStorage.setItem('selectedRole', role)
  }
  async function signOut() {
    await logout()
    token.value = null
    userId.value = null
    userName.value = null
    userRoles.value = null
    selectedRole.value = null
    availableRoleList.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRoles')
    localStorage.removeItem('selectedRole')
  }
  function restoreSession() {
    token.value = localStorage.getItem('token')
    userId.value = localStorage.getItem('userId')
    userName.value = localStorage.getItem('userName')
    userRoles.value = localStorage.getItem('userRoles')
    selectedRole.value = localStorage.getItem('selectedRole') as UserRole | null
  }
  return {
    token, userId, userName, userRoles, selectedRole, availableRoleList,
    isAuthenticated, availableRoles,
    signIn, fetchUserRoles, chooseRole, signOut, restoreSession,
  }
})
