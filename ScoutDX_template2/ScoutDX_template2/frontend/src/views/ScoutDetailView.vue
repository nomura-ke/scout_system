<template>
  <section class="view" v-if="scout">
    <h2>スカウト文詳細</h2>
    <p><strong>ID:</strong> {{ scout.id }}</p>
    <p><strong>タイトル:</strong> {{ scout.title }}</p>
    <p><strong>作成者:</strong> {{ scout.creator }}</p>
    <p><strong>本文:</strong><br />{{ scout.body }}</p>
    <ApprovalPanel @approve="approve" @remand="remand" />
  </section>
  <section v-else class="view">データが見つかりません</section>
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
  await router.push('/scouts')
}

async function remand() {
  await store.remand(String(route.params.id))
  await router.push('/scouts')
}

onMounted(() => {
  if (store.scouts.length === 0) {
    store.loadScouts()
  }
})
</script>
