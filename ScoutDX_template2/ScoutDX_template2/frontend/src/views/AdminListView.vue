<template>
  <div class="admin-approval-view">
    <AppHeader :show-logout="true" />
    
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
          <h2 class="column-title pending-title">管理者承認待ち<br />スカウト文一覧</h2>
          
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
          <h2 class="column-title approved-title">最終承認済み<br />スカウト文一覧</h2>
          
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
import { useScoutStore } from '../stores/scoutStore'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
const scoutStore = useScoutStore()

// State
const loading = ref(false)
const error = ref<string | null>(null)
const pendingScoutsData = ref<any[]>([])
const approvedScoutsData = ref<any[]>([])

// 承認待ちのスカウト文（左側）
const pendingScouts = computed(() => {
  return pendingScoutsData.value.sort((a: any, b: any) => {
    const dateA = new Date(a.appliedAt).getTime()
    const dateB = new Date(b.appliedAt).getTime()
    return dateB - dateA // 新しい順
  })
})

// 承認済みのスカウト文（右側）
const approvedScouts = computed(() => {
  return approvedScoutsData.value.sort((a: any, b: any) => {
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
.admin-approval-view {
  min-height: 100vh;
}

.main-content {
  max-width: 1600px;
}

h1 {
  text-align: center;
  font-size: var(--font-2xl);
  color: var(--color-text);
  margin-bottom: var(--space-7);
  font-weight: bold;
}

.loading,
.error {
  text-align: center;
  padding: var(--space-8);
  font-size: var(--font-lg);
}

.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-7);
}

.column {
  overflow: hidden;
}

.column-title {
  padding: var(--space-6);
  text-align: center;
  color: white;
  font-size: var(--font-lg);
  font-weight: bold;
  margin: 0;
}

.pending-title {
  background: #cf5641;
}

.approved-title {
  background: var(--color-primary);
}

.table-container {
  overflow-x: auto;
}

.scout-table {
  width: 100%;
  border-collapse: collapse;
}

.scout-table thead {
  background: var(--color-surface-muted);
}

.scout-table th {
  padding: var(--space-4) var(--space-2);
  text-align: left;
  font-weight: bold;
  color: var(--color-text);
  font-size: var(--font-sm);
  border-bottom: 1px solid var(--color-border);
}

.scout-table td {
  padding: var(--space-4) var(--space-2);
  font-size: var(--font-sm);
}

.clickable-row {
  cursor: pointer;
}

.view-only-row {
  cursor: default;
}

.view-only-row:hover {
  background: var(--color-surface-muted);
}

.no-data {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-muted);
  font-size: var(--font-md);
}

@media (max-width: 1200px) {
  .two-column-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--space-4);
  }

  h1 {
    font-size: var(--font-xl);
  }

  .column-title {
    font-size: var(--font-lg);
    padding: var(--space-4);
  }

  .scout-table th,
  .scout-table td {
    padding: var(--space-2) var(--space-1);
    font-size: var(--font-xs);
  }
}
</style>