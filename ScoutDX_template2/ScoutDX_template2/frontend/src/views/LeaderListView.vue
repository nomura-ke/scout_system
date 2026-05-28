<template>
  <section class="view">
    <h2>営業リーダー一覧</h2>
    <ScoutTable :scouts="draftScouts" @select="openApproval" />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ScoutTable from '../components/ScoutTable.vue'
import { useScoutStore } from '../stores/scoutStore'

const store = useScoutStore()
const router = useRouter()

const draftScouts = computed(() => store.scouts.filter((item) => item.status === 'DRAFT'))

function openApproval(id: string) {
  if (!id) return
  router.push(`/leaders/${id}/approval`)
}

onMounted(() => {
  store.loadScouts()
})
</script>
