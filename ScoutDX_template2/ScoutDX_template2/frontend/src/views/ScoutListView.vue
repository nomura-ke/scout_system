<template>
  <div class="scout-list-container">
    <AppHeader :tabs="['スカウト文作成', 'スカウト文一覧']" active-tab="スカウト文一覧" :show-logout="true" @tab-change="handleTabChange" />
    
    <div class="content">
      <h1 class="page-title">スカウト文一覧</h1>
      
      <div class="action-bar">
        <div class="filter-section">
          <button class="btn-filter">絞込 ▼</button>
        </div>
        <button @click="goToCreate" class="btn-create">スカウト文作成</button>
      </div>

      <ScoutTable
        :items="scoutList"
        :columns="columns"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScoutStore } from '../stores/scoutStore'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import ScoutTable from '../components/ScoutTable.vue'

const router = useRouter()
const scoutStore = useScoutStore()

const scoutList = ref([])

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'jobSeeker', label: '求職者' },
  { key: 'companyName', label: '求人をだしている会社名' },
  { key: 'createdAt', label: '作成日' },
  { key: 'status', label: 'ステータス' }
]

onMounted(async () => {
  scoutList.value = await scoutStore.fetchScoutList()
})

// タブ切り替え
const handleTabChange = (tab: string) => {
  if (tab === 'スカウト文作成') {
    router.push('/scout-create')
  } else if (tab === 'スカウト文一覧') {
    router.push('/scout-list')
  }
}

// スカウト文作成ボタン
const goToCreate = () => {
  console.log('📝 スカウト文作成ページへ遷移')
  router.push('/scout-create')
}

const handleEdit = (id: number) => {
  router.push(`/scout-detail/${id}`)
}

const handleDelete = async (id: number) => {
  if (confirm('削除してもよろしいですか？')) {
    await scoutStore.deleteScout(id)
    scoutList.value = await scoutStore.fetchScoutList()
  }
}
</script>

<style scoped>
.scout-list-container {
  min-height: 100vh;
}

.content {
  max-width: 1400px;
}

.page-title {
  font-weight: bold;
  text-align: center;
  margin-bottom: var(--space-7);
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.filter-section {
  display: flex;
  gap: var(--space-4);
}

.btn-filter {
  padding: var(--space-2) var(--space-5);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
}

.btn-create {
  padding: var(--space-3) var(--space-7);
  border-radius: var(--radius-sm);
  font-weight: bold;
  cursor: pointer;
}
</style>