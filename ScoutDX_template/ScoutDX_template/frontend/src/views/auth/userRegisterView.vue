<template>
  <div class="register-container">
    <div class="register-card">
      <div class="card-header">
        <h1>ユーザー登録</h1>
        <router-link to="/login" class="login-link">ログイン</router-link>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
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
          placeholder="パスワードを入力（6文字以上）"
          required
          :error="errors.password"
        />

        <BaseInput
          id="passwordConfirm"
          v-model="formData.passwordConfirm"
          type="password"
          label="パスワード（確認）"
          placeholder="パスワードを再入力"
          required
          :error="errors.passwordConfirm"
        />

        <div v-if="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-alert">
          {{ successMessage }}
        </div>

        <BaseButton 
          type="submit" 
          color="success" 
          size="large"
          :disabled="isLoading"
          class="register-button"
        >
          {{ isLoading ? '登録中...' : '登録' }}
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
  password: '',
  passwordConfirm: ''
})

const errors = reactive({
  username: '',
  password: '',
  passwordConfirm: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const validateForm = () => {
  let isValid = true
  errors.username = ''
  errors.password = ''
  errors.passwordConfirm = ''

  // ユーザー名検証
  if (!formData.username.trim()) {
    errors.username = 'ユーザー名を入力してください'
    isValid = false
  } else if (formData.username.length < 3) {
    errors.username = 'ユーザー名は3文字以上で入力してください'
    isValid = false
  }

  // パスワード検証
  if (!formData.password) {
    errors.password = 'パスワードを入力してください'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = 'パスワードは6文字以上で入力してください'
    isValid = false
  }

  // パスワード確認検証
  if (!formData.passwordConfirm) {
    errors.passwordConfirm = 'パスワード（確認）を入力してください'
    isValid = false
  } else if (formData.password !== formData.passwordConfirm) {
    errors.passwordConfirm = 'パスワードが一致しません'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.register(formData.username, formData.password)
    
    if (result.success) {
      successMessage.value = '登録が完了しました。ログイン画面に移動します...'
      
      // フォームをリセット
      formData.username = ''
      formData.password = ''
      formData.passwordConfirm = ''
      
      // 2秒後にログイン画面へ遷移
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      errorMessage.value = result.message || '登録に失敗しました'
    }
  } catch (error) {
    errorMessage.value = '予期しないエラーが発生しました'
    console.error('Register error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
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

.login-link {
  color: #1976d2;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid #1976d2;
  border-radius: 4px;
  transition: all 0.3s;
}

.login-link:hover {
  background-color: #1976d2;
  color: white;
}

.register-form {
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

.success-alert {
  padding: 12px;
  margin-bottom: 16px;
  background-color: #e8f5e9;
  border: 1px solid #66bb6a;
  border-radius: 4px;
  color: #2e7d32;
  font-size: 14px;
}

.register-button {
  width: 100%;
  margin-top: 8px;
}
</style>