<template>
  <div class="admin-approval-view">
    <AppHeader />
    
    <main class="main-content">
      <h1>スカウト文作成・承認管理アプリ</h1>

      <!-- ローディング -->
      <div v-if="loading" class="loading">
        <p>読み込み中...</p>
      </div>

      <!-- エラー -->
      <div v-else-if="error" class="error">
        <p>❌ {{ error }}</p>
      </div>

      <!-- 2カラムレイアウト -->
      <div v-else class="two-column-layout">
        <!-- 左側：承認待ち -->
        <div class="column pending-column">
          <h2 class="column-title pending-title">承認待ち<br />スカウト文一覧</h2>
          
          <div class="table-container">
            <table class="scout-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>会社名</th>
                  <th>送信先名</th>
                  <th>作成者</th>
                  <th>申請日 (更新日順番)</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="scout in pendingScouts" 
                  :key="scout.id"
                  @click="goToApprovalDetail(scout.id)"
                  class="clickable-row"
                >
                  <td>{{ scout.id }}</td>
                  <td>{{ scout.companyName || '（未設定）' }}</td>
                  <td>{{ scout.senderName }}</td>
                  <td>{{ scout.creatorName }}</td>
                  <td>{{ formatDate(scout.appliedAt) }}</td>
                </tr>
              </tbody>
            </table>

            <div v-if="pendingScouts.length === 0" class="no-data">
              <p>📭 承認待ちのスカウト文はありません</p>
            </div>
          </div>
        </div>

        <!-- 右側：承認済み -->
        <div class="column approved-column">
          <h2 class="column-title approved-title">承認済み<br />スカウト文一覧</h2>
          
          <div class="table-container">
            <table class="scout-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>会社名</th>
                  <th>送信先名</th>
                  <th>作成者 (更新者名前)</th>
                  <th>承認日</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="scout in approvedScouts" 
                  :key="scout.id"
                  class="view-only-row"
                >
                  <td>{{ scout.id }}</td>
                  <td>{{ scout.companyName || '（未設定）' }}</td>
                  <td>{{ scout.senderName }}</td>
                  <td>{{ scout.creatorName }}</td>
                  <td>{{ formatDate(scout.approvedAt) }}</td>
                </tr>
              </tbody>
            </table>

            <div v-if="approvedScouts.length === 0" class="no-data">
              <p>📭 承認済みのスカウト文はありません</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScoutStore } from '@/stores/mockScoutStore'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const router = useRouter()
const scoutStore = useScoutStore()

// State
const loading = ref(false)
const error = ref<string | null>(null)
const pendingScoutsData = ref<any[]>([])
const approvedScoutsData = ref<any[]>([])

// 承認待ちのスカウト文（左側）
const pendingScouts = computed(() => {
  return pendingScoutsData.value.sort((a, b) => {
    const dateA = new Date(a.appliedAt).getTime()
    const dateB = new Date(b.appliedAt).getTime()
    return dateB - dateA // 新しい順
  })
})

// 承認済みのスカウト文（右側）
const approvedScouts = computed(() => {
  return approvedScoutsData.value.sort((a, b) => {
    const dateA = new Date(a.approvedAt).getTime()
    const dateB = new Date(b.approvedAt).getTime()
    return dateB - dateA // 新しい順
  })
})

// データ取得
async function fetchScouts() {
  loading.value = true
  error.value = null
  
  try {
    const data = await scoutStore.fetchLeaderList()
    pendingScoutsData.value = data.pending
    approvedScoutsData.value = data.approved
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'データ取得に失敗しました'
    console.error('データ取得エラー:', e)
  } finally {
    loading.value = false
  }
}

// 承認・差戻し画面に遷移
function goToApprovalDetail(scoutId: number) {
  router.push(`/admin-approval/${scoutId}`)
}

// ユーティリティ関数
function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 初期化
onMounted(() => {
  fetchScouts()
})
</script>

<style scoped>
/* スタイルはそのまま */
.admin-approval-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

h1 {
  text-align: center;
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: bold;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #e74c3c;
}

.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.column {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.column-title {
  padding: 1.5rem;
  text-align: center;
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
}

.pending-title {
  background: #e74c3c;
}

.approved-title {
  background: #3498db;
}

.table-container {
  overflow-x: auto;
}

.scout-table {
  width: 100%;
  border-collapse: collapse;
}

.scout-table thead {
  background: #f8f9fa;
}

.scout-table th {
  padding: 1rem 0.5rem;
  text-align: left;
  font-weight: bold;
  color: #555;
  font-size: 0.85rem;
  border-bottom: 2px solid #ddd;
}

.scout-table td {
  padding: 1rem 0.5rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
}

.clickable-row {
  cursor: pointer;
  transition: background 0.2s;
}

.clickable-row:hover {
  background: #e3f2fd;
}

.view-only-row {
  cursor: default;
}

.view-only-row:hover {
  background: #f8f9fa;
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1rem;
}

@media (max-width: 1200px) {
  .two-column-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  h1 {
    font-size: 1.3rem;
  }

  .column-title {
    font-size: 1.1rem;
    padding: 1rem;
  }

  .scout-table th,
  .scout-table td {
    padding: 0.5rem 0.3rem;
    font-size: 0.75rem;
  }
}
</style>