<template>
  <section class="view">
    <h2>ロール選択</h2>
    <div class="row">
      <button @click="choose('SCOUT_USER')">スカウト担当</button>
      <button @click="choose('SALES_LEADER')">営業リーダー</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import type { UserRole } from '../types'

const authStore = useAuthStore()
const router = useRouter()

async function choose(role: UserRole) {
  await authStore.chooseRole(role)
  await router.push(role === 'SALES_LEADER' ? '/leaders' : '/scouts')
}
</script>
