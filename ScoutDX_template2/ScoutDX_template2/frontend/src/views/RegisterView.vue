<template>
  <div class="register-container">
    <AppFooter />
    <div class="register-content">
      <h1 class="register-title">ユーザー登録</h1>
      <div class="register-card">
        <form @submit.prevent="handleRegister">
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
            <label>ロール：</label>
            <select v-model="selectedRole" class="form-input" required>
              <option value="creator">作成者</option>
              <option value="leader">営業リーダー</option>
              <option value="admin">管理者</option>
            </select>
          </div>

          <div class="form-group">
            <label>パスワード：</label>
            <input
              v-model="password"
              type="password"
              placeholder="8文字以上で入力"
              class="form-input"
              required
              minlength="8"
            />
          </div>

          <div class="form-group">
            <label>パスワード（確認）：</label>
            <input
              v-model="passwordConfirm"
              type="password"
              placeholder="確認用パスワードを入力"
              class="form-input"
              required
              minlength="8"
            />
          </div>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

          <button type="submit" class="btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? '登録中...' : '新規登録' }}
          </button>

          <p class="login-link-text">
            すでにアカウントをお持ちの方は
            <RouterLink to="/login" class="link">ログインへ</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppFooter from '../components/AppFooter.vue'
import { useAuthStore, type UserRole } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const employeeId = ref('')
const selectedRole = ref<UserRole>('creator')
const password = ref('')
const passwordConfirm = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const normalizedEmployeeId = employeeId.value.trim()
  const normalizedPassword = password.value.trim()
  const normalizedPasswordConfirm = passwordConfirm.value.trim()

  if (!normalizedEmployeeId || !normalizedPassword || !normalizedPasswordConfirm || !selectedRole.value) {
    errorMessage.value = '社員番号・ロール・パスワードは必須です'
    return
  }

  if (normalizedPassword.length < 8) {
    errorMessage.value = 'パスワードは8文字以上で入力してください'
    return
  }

  if (normalizedPassword !== normalizedPasswordConfirm) {
    errorMessage.value = 'パスワードが一致しません'
    return
  }

  isSubmitting.value = true

  try {
    await authStore.register(normalizedEmployeeId, normalizedPassword, selectedRole.value)
    successMessage.value = '登録が完了しました。ログイン画面へ移動します。'
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'ユーザー登録に失敗しました'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
}

.register-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-7);
}

.register-title {
  font-size: var(--font-3xl);
  font-weight: 700;
  margin-bottom: var(--space-7);
  color: var(--color-text);
}

.register-card {
  width: 100%;
  max-width: 500px;
  padding: var(--space-8);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
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
  color: var(--color-danger);
}

.success-message {
  margin-top: calc(var(--space-2) * -1);
  margin-bottom: var(--space-3);
  font-size: var(--font-sm);
  color: var(--color-success);
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

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-link-text {
  margin-top: var(--space-4);
  text-align: center;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .register-content {
    padding: var(--space-5) var(--space-4);
  }

  .register-title {
    font-size: var(--font-2xl);
  }

  .register-card {
    padding: var(--space-6);
  }
}
</style>
