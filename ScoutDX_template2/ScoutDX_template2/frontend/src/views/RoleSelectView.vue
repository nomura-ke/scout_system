<template>
  <div class="role-select-container">
    <AppHeader :show-logout="true" />
    <div class="role-content">
      <h1 class="role-title">ロール選択</h1>
      <div class="role-cards">
        <div class="role-card role-creator" @click="selectRole('creator')">
          <span class="role-name">作成者</span>
        </div>
        <div class="role-card role-leader" @click="selectRole('leader')">
          <span class="role-name">営業リーダー</span>
        </div>
        <div class="role-card role-admin" @click="selectRole('admin')">
          <span class="role-name">管理者</span>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import AppHeader from '../components/AppHeader.vue'  // ⚠️ 修正2: 相対パスに
import AppFooter from '../components/AppFooter.vue'  // ⚠️ 修正2: 相対パスに

const router = useRouter()
const authStore = useAuthStore()

const selectRole = async (role: 'creator' | 'leader' | 'admin') => {
  await authStore.setRole(role)
  
  if (role === 'creator') {
    router.push('/scout-list')
  } else if (role === 'leader') {
    router.push('/leader-list')
  } else {
    router.push('/admin-list')
  }
}
</script>

<style scoped>
.role-select-container {
  min-height: 100vh;
}

.role-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-7);
}

.role-title {
  font-weight: bold;
  margin-bottom: var(--space-8);
}

.role-cards {
  display: flex;
  gap: var(--space-7);
  flex-wrap: wrap;
  justify-content: center;
}

.role-card {
  width: 280px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-width: 2px;
  border-style: solid;
}

.role-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.role-creator {
  background-color: var(--color-primary);
  border-color: var(--color-primary-hover);
}

.role-leader {
  background-color: #f0b84d;
  border-color: #d39728;
}

.role-admin {
  background-color: #34a66a;
  border-color: #238b53;
}

.role-name {
  font-size: var(--font-xl);
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

.role-admin .role-name {
  color: white;
}
</style>