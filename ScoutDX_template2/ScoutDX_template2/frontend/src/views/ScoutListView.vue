<template>
  <section class="view">
    <div class="row space-between">
      <h2>スカウト文一覧</h2>
      <button @click="router.push('/scouts/create')">新規作成</button>
    </div>
    <ScoutTable :scouts="store.scouts" @select="openDetail" />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ScoutTable from '../components/ScoutTable.vue'
import { useScoutStore } from '../stores/scoutStore'

const store = useScoutStore()
const router = useRouter()

function openDetail(id: string) {
  if (!id) return
  router.push(`/scouts/${id}`)
}

onMounted(() => {
  store.loadScouts()
})
</script>
