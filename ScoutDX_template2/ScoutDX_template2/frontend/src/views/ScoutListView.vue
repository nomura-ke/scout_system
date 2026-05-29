<template>
  <div class="scout-list-container">
    <AppHeader :tabs="['スカウト文作成', 'スカウト文一覧']" active-tab="スカウト文一覧" @tab-change="handleTabChange" />
    
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
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-section {
  display: flex;
  gap: 1rem;
}

.btn-filter {
  padding: 0.5rem 1.5rem;
  border: 1px solid #333;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-filter:hover {
  background-color: #f0f0f0;
}

.btn-create {
  padding: 0.75rem 2rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-create:hover {
  background-color: #0052a3;
}

.btn-create:active {
  transform: scale(0.98);
}
</style>