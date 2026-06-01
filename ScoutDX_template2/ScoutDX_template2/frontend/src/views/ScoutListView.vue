<template>
  <div class="scout-list-container">
    <AppHeader :tabs="['スカウト文作成', 'スカウト文一覧']" active-tab="スカウト文一覧" :show-logout="true" @tab-change="handleTabChange" />
    
    <div class="content">
      <h1 class="page-title">スカウト文一覧</h1>
      
      <div class="action-bar">
        <div class="filter-section">
          <button class="btn-filter" @click="toggleFilterPanel">絞込 ▼</button>
          <div v-if="isFilterOpen" class="filter-panel">
            <div class="filter-item">
              <label>ステータス</label>
              <select v-model="filters.status" class="filter-select" @change="applyFilters">
                <option value="">すべて</option>
                <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
              </select>
            </div>
            <div class="filter-item">
              <label>募集職種</label>
              <select v-model="filters.recruitmentPosition" class="filter-select" @change="applyFilters">
                <option value="">すべて</option>
                <option
                  v-for="position in recruitmentPositionOptions"
                  :key="position"
                  :value="position"
                >
                  {{ position }}
                </option>
              </select>
            </div>
            <div class="filter-item">
              <label>会社名</label>
              <select v-model="filters.companyName" class="filter-select" @change="applyFilters">
                <option value="">すべて</option>
                <option v-for="company in companyNameOptions" :key="company" :value="company">
                  {{ company }}
                </option>
              </select>
            </div>
            <button class="btn-clear" @click="clearFilters">クリア</button>
          </div>
        </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useScoutStore } from '../stores/scoutStore'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import ScoutTable from '../components/ScoutTable.vue'

const router = useRouter()
const scoutStore = useScoutStore()

const scoutList = ref<any[]>([])
const allScouts = ref<any[]>([])
const isFilterOpen = ref(false)
const filters = ref({
  status: '',
  recruitmentPosition: '',
  companyName: ''
})

const statusOptions = ['編集中', '営業承認待ち', '管理者承認待ち', '差戻し', '承認済み']

const recruitmentPositionOptions = computed(() => {
  return [...new Set(allScouts.value.map((item: any) => item.recruitmentPosition).filter(Boolean).filter((value: string) => value !== '-'))]
})

const companyNameOptions = computed(() => {
  return [...new Set(allScouts.value.map((item: any) => item.companyName).filter(Boolean).filter((value: string) => value !== '-'))]
})

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'jobSeeker', label: '求職者' },
  { key: 'recruitmentPosition', label: '募集職種' },
  { key: 'senderAge', label: '年代' },
  { key: 'senderGender', label: '性別' },
  { key: 'companyName', label: '求人をだしている会社名' },
  { key: 'createdAt', label: '作成日' },
  { key: 'status', label: 'ステータス' }
]

const formatJstDateTimeHM = (value: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)
}

const mapDisplayDate = (items: any[]) =>
  items.map((item: any) => ({
    ...item,
    createdAt: formatJstDateTimeHM(String(item.createdAt || ''))
  }))

onMounted(async () => {
  allScouts.value = await scoutStore.fetchScoutList()
  scoutList.value = mapDisplayDate([...allScouts.value])
})

const toggleFilterPanel = () => {
  isFilterOpen.value = !isFilterOpen.value
}

const applyFilters = () => {
  const filtered = allScouts.value.filter((item: any) => {
    const statusMatched = !filters.value.status || item.status === filters.value.status
    const positionMatched = !filters.value.recruitmentPosition || item.recruitmentPosition === filters.value.recruitmentPosition
    const companyMatched = !filters.value.companyName || item.companyName === filters.value.companyName
    return statusMatched && positionMatched && companyMatched
  })

  scoutList.value = mapDisplayDate(filtered)
}

const clearFilters = () => {
  filters.value.status = ''
  filters.value.recruitmentPosition = ''
  filters.value.companyName = ''
  scoutList.value = mapDisplayDate([...allScouts.value])
}

// タブ切り替え
const handleTabChange = (tab: string) => {
  if (tab === 'スカウト文作成') {
    router.push('/scout-create')
  } else if (tab === 'スカウト文一覧') {
    router.push('/scout-list')
  }
}

const handleEdit = (id: number) => {
  router.push(`/scout-detail/${id}`)
}

const handleDelete = async (id: number) => {
  if (confirm('削除してもよろしいですか？')) {
    await scoutStore.deleteScout(id)
    allScouts.value = await scoutStore.fetchScoutList()
    applyFilters()
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
  position: relative;
  display: flex;
  gap: 1rem;
}

.filter-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 320px;
  padding: 1rem;
  background: #fff;
  border: 1px solid #d7d7d7;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  z-index: 20;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.8rem;
}

.filter-item label {
  font-size: 0.85rem;
  color: #333;
  font-weight: 600;
}

.filter-select {
  padding: 0.55rem 0.7rem;
  border: 1px solid #c7c7c7;
  border-radius: 6px;
  background: #fff;
}

.btn-clear {
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 1px solid #b8b8b8;
  background: #f8f8f8;
  border-radius: 6px;
  cursor: pointer;
}

.btn-clear:hover {
  background: #efefef;
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
</style>