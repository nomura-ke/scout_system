<template>
  <section class="view">
    <h2>ログイン</h2>
    <form @submit.prevent="submit">
      <input v-model="userId" type="text" placeholder="ユーザーID" required />
      <input v-model="password" type="password" placeholder="パスワード" required />
      <button type="submit">ログイン</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const userId = ref('')
const password = ref('')

async function submit() {
  await authStore.signIn({ userId: userId.value, password: password.value })
  await router.push('/role-select')
}
</script>
