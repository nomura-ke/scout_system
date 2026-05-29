import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getUserRoles, login as loginApi, logout as logoutApi, selectRole } from '../api/scoutApi'

export type UserRole = 'creator' | 'leader' | 'admin'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<{ name: string; employeeId: string }>({
    name: localStorage.getItem('userName') || '',
    employeeId: localStorage.getItem('userId') || ''
  })
  const role = ref<UserRole | null>((localStorage.getItem('selectedRole') as UserRole | null) || null)
  const availableRoleList = ref<Array<{ id: number; role: UserRole; role_name: string }>>([])

  const isAuthenticated = computed(() => !!token.value)

  const login = async (employeeId: string, password: string) => {
    const username = employeeId.trim()
    const pass = password.trim()

    if (!username || !pass) {
      throw new Error('社員番号とパスワードを入力してください')
    }

    const result = await loginApi({ username, password: pass })
    const data = result?.data

    if (!result?.success || !data?.token) {
      throw new Error('ログインに失敗しました')
    }

    token.value = data.token
    user.value = {
      name: data.username || username,
      employeeId: String(data.userId || '')
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', String(data.userId || ''))
    localStorage.setItem('userName', data.username || username)

    const roles = Array.isArray(data.roles) ? data.roles : await getUserRoles()
    availableRoleList.value = roles.map((r: any) => ({
      id: Number(r.id),
      role: r.role,
      role_name: r.role_name
    }))

    return { user: user.value, token: data.token }
  }

  const setRole = async (selectedRole: UserRole) => {
    if (!availableRoleList.value.length) {
      const roles = await getUserRoles()
      availableRoleList.value = roles.map((r: any) => ({
        id: Number(r.id),
        role: r.role,
        role_name: r.role_name
      }))
    }

    const target = availableRoleList.value.find((r) => r.role === selectedRole)
    if (!target) {
      throw new Error('選択可能なロールが見つかりません')
    }

    await selectRole(target.id)
    role.value = selectedRole
    localStorage.setItem('selectedRole', selectedRole)
  }

  const logout = async () => {
    try {
      if (token.value) {
        await logoutApi()
      }
    } finally {
      token.value = null
      user.value = { name: '', employeeId: '' }
      role.value = null
      availableRoleList.value = []
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      localStorage.removeItem('selectedRole')
    }
  }

  const restoreAuth = async () => {
    token.value = localStorage.getItem('token')
    user.value = {
      name: localStorage.getItem('userName') || '',
      employeeId: localStorage.getItem('userId') || ''
    }
    role.value = (localStorage.getItem('selectedRole') as UserRole | null) || null

    if (token.value) {
      try {
        const roles = await getUserRoles()
        availableRoleList.value = roles.map((r: any) => ({
          id: Number(r.id),
          role: r.role,
          role_name: r.role_name
        }))
      } catch {
        await logout()
      }
    }
  }

  return {
    user,
    token,
    role,
    availableRoleList,
    isAuthenticated,
    login,
    setRole,
    logout,
    restoreAuth
  }
})
