<template>
  <section class="view" v-if="scout">
    <h2>営業リーダー承認</h2>
    <p><strong>ID:</strong> {{ scout.id }}</p>
    <p><strong>タイトル:</strong> {{ scout.title }}</p>
    <p><strong>本文:</strong><br />{{ scout.body }}</p>
    <ApprovalPanel @approve="approve" @remand="remand" />
  </section>
  <section v-else class="view">対象データがありません</section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ApprovalPanel from '../components/ApprovalPanel.vue'
import { useScoutStore } from '../stores/scoutStore'

const route = useRoute()
const router = useRouter()
const store = useScoutStore()

const scout = computed(() => store.scouts.find((item) => item.id === route.params.id))

async function approve() {
  await store.approve(String(route.params.id))
  await router.push('/leaders')
}

async function remand() {
  await store.remand(String(route.params.id))
  await router.push('/leaders')
}

onMounted(() => {
  if (store.scouts.length === 0) {
    store.loadScouts()
  }
})
</script>
