<template>
  <header class="app-header">
    <div class="header-content">
      <h1 class="app-title">スカウト文作成・承認管理アプリ</h1>
      <div class="header-actions">
        <nav v-if="tabs && tabs.length > 0" class="nav-tabs">
          <button
            v-for="tab in tabs"
            :key="tab"
            :class="['tab-btn', { active: tab === activeTab }]"
            @click="$emit('tab-change', tab)"
          >
            {{ tab }}
          </button>
        </nav>
        <button v-if="showRegister" class="btn-secondary" @click="goToRegister">
          ユーザ登録
        </button>
        <button v-if="showLogin" class="btn-secondary" @click="goToLogin">
          ログイン
        </button>
        <button v-if="showLogout" class="btn-secondary" @click="logout">
          ログアウト
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/mockAuthStore'

interface Props {
  tabs?: string[]
  activeTab?: string
  showRegister?: boolean
  showLogin?: boolean
  showLogout?: boolean
}

defineProps<Props>()
defineEmits(['tab-change'])

const router = useRouter()
const authStore = useAuthStore()

const goToRegister = () => router.push('/register')
const goToLogin = () => router.push('/login')
const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  background-color: #e0e0e0;
  border-bottom: 2px solid #ccc;
  padding: 1rem 2rem;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-btn {
  padding: 0.5rem 1.5rem;
  border: 1px solid #999;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.tab-btn:hover {
  background-color: #f5f5f5;
}

.tab-btn.active {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
}

.btn-secondary {
  padding: 0.5rem 1.5rem;
  border: 2px solid #333;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-secondary:hover {
  background-color: #f0f0f0;
}
</style>