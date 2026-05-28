RoleSelectView.vue


<template>
  <div class="role-select-container">
    <AppHeader show-logout />
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
import { useAuthStore } from '@/stores/authStore'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const router = useRouter()
const authStore = useAuthStore()

const selectRole = (role: 'creator' | 'leader' | 'admin') => {
  authStore.setRole(role)
  
  if (role === 'creator') {
    router.push('/scout-list')
  } else if (role === 'leader') {
    router.push('/leader-list')
  } else {
    router.push('/admin')
  }
}
</script>

<style scoped>
.role-select-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.role-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.role-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 3rem;
}

.role-cards {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.role-card {
  width: 280px;
  height: 150px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
}

.role-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.role-creator {
  background-color: #5dade2;
  border-color: #3498db;
}

.role-leader {
  background-color: #f9e79f;
  border-color: #f1c40f;
}

.role-admin {
  background-color: #58d68d;
  border-color: #27ae60;
}

.role-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.role-admin .role-name {
  color: white;
}
</style>
