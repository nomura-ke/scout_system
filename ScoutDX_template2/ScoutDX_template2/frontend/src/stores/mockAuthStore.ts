import { ref, computed } from 'vue'

export const useAuthStore = () => {
  const user = ref({ name: 'テストユーザー', employeeId: '12345' })
  const token = ref('mock-token-12345')
  const role = ref<'creator' | 'leader' | 'admin' | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (employeeId: string, password: string) => {
    const normalizedEmployeeId = employeeId.trim()
    const normalizedPassword = password.trim()

    if (!normalizedEmployeeId || !normalizedPassword) {
      throw new Error('社員番号とパスワードを入力してください')
    }

    console.log('🔐 Mock Login 実行:', { employeeId, password })
    
    // 0.5秒待機（API呼び出しをシミュレート）
    await new Promise(resolve => setTimeout(resolve, 500))
    
    token.value = 'mock-token-' + normalizedEmployeeId
    user.value = { name: '田中太郎', employeeId: normalizedEmployeeId }
    
    console.log('✅ Mock Login 成功:', user.value)
    
    return { user: user.value, token: token.value }
  }

  const setRole = (selectedRole: 'creator' | 'leader' | 'admin') => {
    console.log('👤 Mock Role Selected:', selectedRole)
    role.value = selectedRole
  }

  const logout = () => {
    console.log('👋 Mock Logout')
    token.value = null
    user.value = { name: '', employeeId: '' }
    role.value = null
  }

  const restoreAuth = () => {
    console.log('🔄 Mock Restore Auth')
  }

  return {
    user,
    token,
    role,
    isAuthenticated,
    login,
    setRole,
    logout,
    restoreAuth
  }
}