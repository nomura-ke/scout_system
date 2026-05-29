<template>
  <div class="login-container">
    <AppFooter />
    <div class="login-content">
      <h1 class="login-title">ログイン</h1>
      <div class="login-card">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>社員番号：</label>
            <input
              v-model="employeeId"
              type="text"
              placeholder="ユーザ名を入力"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label>パスワード：</label>
            <input
              v-model="password"
              type="password"
              placeholder="パスワードを入力"
              class="form-input"
              required
            />
          </div>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <button type="submit" class="btn-primary" @click.prevent="handleLogin">
            ログイン
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
const authStore = useAuthStore()

const employeeId = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  const normalizedEmployeeId = employeeId.value.trim()
  const normalizedPassword = password.value.trim()

  if (!normalizedEmployeeId || !normalizedPassword) {
    errorMessage.value = '社員番号とパスワードは必須です'
    return
  }

  console.log('🔐 ログインボタンがクリックされました')
  console.log('社員番号:', normalizedEmployeeId)
  console.log('パスワード:', password.value)
  
  try {
    await authStore.login(normalizedEmployeeId, normalizedPassword)
    console.log('✅ ログイン成功')
    router.push('/role-select')
  } catch (error) {
    console.error('❌ ログイン失敗:', error)
    errorMessage.value = error instanceof Error ? error.message : 'ログインに失敗しました'
  }
}

// マウント時の確認
console.log('LoginView がマウントされました')
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.login-card {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.error-message {
  color: #d32f2f;
  margin-top: -0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}

.btn-primary:hover {
  background-color: #0052a3;
}

.btn-primary:active {
  transform: scale(0.98);
}
</style>