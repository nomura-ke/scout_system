<template>
  <div class="leader-list-container">
    <AppHeader :tabs="['スカウト文一覧']" active-tab="スカウト文一覧" />
    
    <div class="content">
      <div class="list-grid">
        <!-- 左側：承認待ち -->
        <div class="list-section">
          <h2 class="section-title pending">承認待ち<br/>スカウト文一覧</h2>
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
                  v-for="item in pendingList"
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
          <h2 class="section-title approved">承認済み<br/>スカウト文一覧</h2>
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
                  v-for="item in approvedList"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScoutStore } from '../stores/scoutStore'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
const scoutStore = useScoutStore()

const pendingList = ref([])
const approvedList = ref([])

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
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.list-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
}

.section-title.pending {
  color: #d32f2f;
  background-color: #ffebee;
}

.section-title.approved {
  color: #1976d2;
  background-color: #e3f2fd;
}

.table-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.scout-table {
  width: 100%;
  border-collapse: collapse;
}

.scout-table th {
  background-color: #f5f5f5;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
  font-size: 0.9rem;
}

.scout-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.clickable-row:hover {
  background-color: #f9f9f9;
}

.link {
  color: #0066cc;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 1200px) {
  .list-grid {
    grid-template-columns: 1fr;
  }
}
</style>