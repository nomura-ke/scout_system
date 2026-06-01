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
              placeholder="社員番号を入力"
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
          <p class="register-link-text">
            まだアカウントをお持ちでない方は
            <RouterLink to="/register" class="link">こちら</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
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
}

.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-7);
}

.login-title {
  font-weight: bold;
  margin-bottom: var(--space-7);
}

.login-card {
  padding: var(--space-8);
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: var(--space-6);
}

.form-group label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: 500;
}

.form-input {
  font-size: var(--font-md);
}

.error-message {
  margin-top: calc(var(--space-2) * -1);
  margin-bottom: var(--space-3);
  font-size: var(--font-sm);
}

.btn-primary {
  width: 100%;
  padding: var(--space-4);
  border-radius: var(--radius-sm);
  font-size: var(--font-md);
  font-weight: bold;
  cursor: pointer;
  margin-top: var(--space-4);
}

.register-link-text {
  margin-top: var(--space-4);
  text-align: center;
  color: var(--color-text-muted);
}
</style>