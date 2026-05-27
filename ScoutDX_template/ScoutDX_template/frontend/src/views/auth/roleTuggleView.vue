<template>
  <div class="role-selection-container">
    <div class="role-selection-card">
      <div class="card-header">
        <h1>ロール選択</h1>
        <BaseButton color="danger" size="small" @click="handleLogout">
          ログアウト
        </BaseButton>
      </div>

      <p class="subtitle">使用するロールを選択してください</p>

      <div v-if="isLoading" class="loading">
        読み込み中...
      </div>

      <div v-else-if="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>

      <div v-else class="role-buttons">
        <button
          v-for="role in authStore.availableRoles"
          :key="role.id"
          @click="selectRole(role.id)"
          :class="['role-button', `role-${role.name}`]"
          :disabled="isSelecting"
        >
          <div class="role-icon">
            <i :class="getRoleIcon(role.name)"></i>
          </div>
          <span class="role-name">{{ role.display_name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(true)
const isSelecting = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  const result = await authStore.fetchUserRoles()
  
  if (!result.success) {
    errorMessage.value = 'ロール情報の取得に失敗しました'
  }
  
  isLoading.value = false
})

const getRoleIcon = (roleName) => {
  const icons = {
    creator: '✏️',
    leader: '👔',
    admin: '⚙️'
  }
  return icons[roleName] || '👤'
}

const selectRole = async (roleId) => {
  isSelecting.value = true
  errorMessage.value = ''

  try {
    const result = await authStore.selectRole(roleId)
    
    if (result.success) {
      // ロールに応じた画面へ遷移
      if (authStore.isCreator) {
        router.push('/scout')
      } else if (authStore.isLeader) {
        router.push('/leader/approvals')
      } else {
        router.push('/scout')
      }
    } else {
      errorMessage.value = 'ロールの選択に失敗しました'
    }
  } catch (error) {
    errorMessage.value = '予期しないエラーが発生しました'
    console.error('Role selection error:', error)
  } finally {
    isSelecting.value = false
  }
}

const handleLogout = async () => {
  await auth Store.logout()
  router.push('/login')
}
</script>

<style scoped>
.role-selection-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.role-selection-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 600px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 16px;
  color: #666;
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

.role-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.role-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
  font-weight: 500;
}

.role-button:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.role-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.role-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.role-name {
  font-size: 18px;
  font-weight: 600;
}

/* ロール別の色設定 */
.role-creator {
  background-color: #e3f2fd;
  border-color: #1976d2;
  color: #1976d2;
}

.role-creator:hover:not(:disabled) {
  background-color: #bbdefb;
}

.role-leader {
  background-color: #fff9c4;
  border-color: #f57f17;
  color: #f57f17;
}

.role-leader:hover:not(:disabled) {
  background-color: #fff59d;
}

.role-admin {
  background-color: #e8f5e9;
  border-color: #388e3c;
  color: #388e3c;
}

.role-admin:hover:not(:disabled) {
  background-color: #c8e6c9;
}
</style>