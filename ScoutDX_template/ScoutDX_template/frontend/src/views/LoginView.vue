<template>
  <div class="login-container">
    <div class="login-card">
      <div class="card-header">
        <h1>ログイン</h1>
        <router-link to="/register" class="register-link">ユーザー登録</router-link>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <BaseInput
          id="username"
          v-model="formData.username"
          label="ユーザー名"
          placeholder="ユーザー名を入力"
          required
          :error="errors.username"
        />

        <BaseInput
          id="password"
          v-model="formData.password"
          type="password"
          label="パスワード"
          placeholder="パスワードを入力"
          required
          :error="errors.password"
        />

        <div v-if="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <BaseButton 
          type="submit" 
          color="primary" 
          size="large"
          :disabled="isLoading"
          class="login-button"
        >
          {{ isLoading ? 'ログイン中...' : 'ログイン' }}
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({
  username: '',
  password: ''
})

const errors = reactive({
  username: '',
  password: ''
})

const errorMessage = ref('')
const isLoading = ref(false)

const validateForm = () => {
  let isValid = true
  errors.username = ''
  errors.password = ''

  if (!formData.username.trim()) {
    errors.username = 'ユーザー名を入力してください'
    isValid = false
  }

  if (!formData.password) {
    errors.password = 'パスワードを入力してください'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = 'パスワードは6文字以上で入力してください'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  errorMessage.value = ''
  
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.login(formData.username, formData.password)
    
    if (result.success) {
      router.push('/roles')
    } else {
      errorMessage.value = result.message || 'ログインに失敗しました'
    }
  } catch (error) {
    errorMessage.value = '予期しないエラーが発生しました'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.card-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.register-link {
  color: #1976d2;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid #1976d2;
  border-radius: 4px;
  transition: all 0.3s;
}

.register-link:hover {
  background-color: #1976d2;
  color: white;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.error-alert {
  padding: 12px;
  margin-bottom: 16px;
  background-color: #ffebee;
  border: 1px solid #ef5350;
  border-radius: 4px;
  color: #c62828;
  font-size: 14px;
}

.login-button {
  width: 100%;
  margin-top: 8px;
}
</style>