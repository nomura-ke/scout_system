<template>
  <div class="leader-list-container">
    <AppHeader :tabs="['スカウト文一覧']" active-tab="スカウト文一覧" :show-logout="true" />
    
    <div class="content">
      <div class="list-grid">
        <!-- 左側：承認待ち -->
        <div class="list-section">
          <h2 class="section-title pending">営業リーダー承認待ち<br/>スカウト文一覧</h2>
          <div class="table-wrapper">
            <table class="scout-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>会社名</th>
                  <th>送信先名前</th>
                  <th>作成者（営業担当者名）</th>
                  <th>申請日</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in pendingRows"
                  :key="item.id"
                  @click="viewDetail(item.id)"
                  class="clickable-row"
                >
                  <td>{{ item.id }}</td>
                  <td><a href="#" class="link">{{ item.companyName }}</a></td>
                  <td>{{ item.senderName }}</td>
                  <td>{{ item.creatorName }}</td>
                  <td>{{ item.appliedAt }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 右側：承認済み -->
        <div class="list-section">
          <h2 class="section-title approved">管理者承認待ち<br/>スカウト文一覧</h2>
          <div class="table-wrapper">
            <table class="scout-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>会社名</th>
                  <th>送信先名前</th>
                  <th>作成者（営業担当者名）</th>
                  <th>承認日</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in approvedRows"
                  :key="item.id"
                  class="clickable-row"
                >
                  <td>{{ item.id }}</td>
                  <td><a href="#" class="link">{{ item.companyName }}</a></td>
                  <td>{{ item.senderName }}</td>
                  <td>{{ item.creatorName }}</td>
                  <td>{{ item.approvedAt }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
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

const router = useRouter()
const scoutStore = useScoutStore()

const pendingList = ref<any[]>([])
const approvedList = ref<any[]>([])
const pendingRows = computed<any[]>(() => pendingList.value)
const approvedRows = computed<any[]>(() => approvedList.value)

onMounted(async () => {
  const data = await scoutStore.fetchLeaderList()
  pendingList.value = data.pending
  approvedList.value = data.approved
})

const viewDetail = (id: number) => {
  router.push(`/leader-approval/${id}`)
}
</script>

<style scoped>
.leader-list-container {
  min-height: 100vh;
}

.content {
  max-width: 1600px;
}

.list-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-7);
}

.section-title {
  margin-bottom: var(--space-6);
  text-align: center;
  padding: var(--space-4);
  border-radius: var(--radius-md);
}

.section-title.pending {
  color: var(--color-danger);
  background-color: var(--color-danger-soft);
}

.section-title.approved {
  color: var(--color-primary);
  background-color: var(--color-primary-soft);
}

.table-wrapper {
  border-radius: var(--radius-md);
  overflow: hidden;
}

.scout-table {
  width: 100%;
  border-collapse: collapse;
}

.scout-table th {
  padding: var(--space-3);
  font-weight: 600;
  font-size: var(--font-sm);
}

.scout-table td {
  padding: var(--space-3);
}

.clickable-row {
  cursor: pointer;
}

@media (max-width: 1200px) {
  .list-grid {
    grid-template-columns: 1fr;
  }
}
</style>