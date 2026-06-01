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
        <button v-if="showLogout" class="btn-secondary btn-logout" @click="logout">
          ログアウト
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

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
  background: linear-gradient(120deg, #ffffff 0%, #f4f8ff 100%);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-4) var(--space-6);
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: var(--font-xl);
  font-weight: bold;
  color: var(--color-text);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.nav-tabs {
  display: flex;
  gap: var(--space-2);
}

.tab-btn {
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
}

.btn-secondary {
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
}

.btn-logout {
  background-color: #c0392b;
  border: 1px solid #c0392b;
  color: #ffffff;
}

.btn-logout:hover {
  background-color: #a93226;
  border-color: #a93226;
}

@media (max-width: 980px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>