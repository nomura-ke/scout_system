<template>
  <div class="approval-container">
     <AppHeader :tabs="['スカウト文一覧']" active-tab="スカウト文一覧" @tab-change="adminListChange" />
    
    
    <!-- 管理者バナー -->
    <div class="admin-banner">
      <span class="admin-badge">🔧 管理者最終承認</span>
      <span class="status-badge">営業リーダー承認済み</span>
    </div>
    
    <div class="content">
      <div v-if="isLoading" class="state-message">読み込み中...</div>
      <div v-else-if="loadError" class="state-message error">{{ loadError }}</div>
      <div v-else class="approval-layout">
        <!-- 左側：スカウト文詳細 -->
        <div class="detail-section">
          <h2 class="section-title">スカウト文詳細</h2>
          <div class="detail-card">
            <div class="detail-row">
              <span class="detail-label">ID</span>
              <span class="detail-value">{{ scout.id }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">作成者名前</span>
              <span class="detail-value">{{ scout.creatorName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">申請日時</span>
              <span class="detail-value">{{ appliedAtJst }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">営業リーダー承認日</span>
              <span class="detail-value">{{ leaderApprovalDateJst }}</span>
            </div>
            <div class="detail-group">
              <div class="group-header">
                <span class="detail-label">送信者情報</span>
              </div>
              <div class="detail-row">
                <span class="sub-label">名前</span>
                <span class="sub-value">{{ scout.senderName }}</span>
                <input type="checkbox" class="detail-check" />
              </div>
              <div class="detail-row">
                <span class="sub-label">年齢</span>
                <span class="sub-value">{{ scout.senderAge }}</span>
                <input type="checkbox" class="detail-check" />
              </div>
              <div class="detail-row">
                <span class="sub-label">性別</span>
                <span class="sub-value">{{ scout.senderGender }}</span>
                <input type="checkbox" class="detail-check" />
              </div>
            </div>
            <div class="detail-row">
              <span class="detail-label">会社名</span>
              <span class="detail-value">{{ scout.companyName }}</span>
              <input type="checkbox" class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">職種</span>
              <span class="detail-value">{{ scout.jobType }}</span>
              <input type="checkbox" class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">業務内容</span>
              <span class="detail-value">{{ scout.jobDescription }}</span>
              <input type="checkbox" class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">必須スキル</span>
              <span class="detail-value">{{ scout.requiredSkills }}</span>
              <input type="checkbox" class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">勤務地</span>
              <span class="detail-value">{{ scout.location }}</span>
              <input type="checkbox" class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">給与</span>
              <span class="detail-value">{{ scout.salary }}</span>
              <input type="checkbox" class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">求人の魅力</span>
              <span class="detail-value">{{ scout.appeal }}</span>
              <input type="checkbox" class="detail-check" />
            </div>
          </div>
        </div>

        <!-- 中央：スカウト文章 -->
        <div class="scout-text-section">
          <h2 class="section-title">スカウト文章</h2>
          <div class="scout-text-card">
            <p class="scout-text">{{ scoutText }}</p>
          </div>
          <div class="reason-input">
            <label class="reason-label">差戻理由（管理者）</label>
            <input
              v-model="rejectionReason"
              type="text"
              placeholder="ここに差戻理由を入力してください"
              class="reason-field"
            />
          </div>
          <div class="action-buttons">
            <button @click="reject" class="btn-reject">差戻し</button>
            <button @click="approve" class="btn-final-approve">最終承認</button>
          </div>
        </div>

        <!-- 右側：承認履歴と過去の差戻しコメント -->
        <div class="comment-section">
          <div class="comment-box">
            <h3 class="comment-title">📋 承認履歴</h3>
            <div class="history-item">
              <div class="history-header">
                <span class="history-role">営業リーダー</span>
                <span class="history-status approved">✓ 承認済</span>
              </div>
              <div class="history-body">
                <p class="history-approver">承認者: {{ scout.leaderApproverName }}</p>
                <p class="history-date">{{ leaderApprovalDate }}</p>
              </div>
            </div>

            <h3 class="comment-title mt-3">💬 過去の差戻しコメント</h3>
            <div v-if="comments.length > 0">
              <div v-for="(comment, index) in comments" :key="index" class="comment-item">
                <p class="comment-role">{{ comment.role }}:</p>
                <p class="comment-text">{{ comment.text }}</p>
                <p class="comment-date">{{ comment.date }}</p>
              </div>
            </div>
            <p v-else class="no-comment">差戻しコメントはありません</p>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScoutStore } from '../stores/scoutStore' 
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

interface RejectionComment {
  role: string
  text: string
  date: string
}

const route = useRoute()
const router = useRouter()
const scoutStore = useScoutStore()
const isLoading = ref(true)
const loadError = ref('')

const scout = ref({
  id: 0,
  creatorName: '',
  appliedAt: '',
  leaderApprovedAt: '',
  leaderApproverName: '',
  senderName: '',
  senderAge: '',
  senderGender: '',
  companyName: '',
  jobType: '',
  jobDescription: '',
  requiredSkills: '',
  location: '',
  salary: '',
  appeal: ''
})

const scoutText = ref('')

const rejectionReason = ref('')

const leaderApprovalDate = computed(() => {
  const s = scout.value as any
  return s.leaderApprovedAt || s.approvedAt || ''
})

const formatJstDateTimeHM = (value: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

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

const appliedAtJst = computed(() => {
  return formatJstDateTimeHM(String((scout.value as any).appliedAt || ''))
})

const leaderApprovalDateJst = computed(() => {
  return formatJstDateTimeHM(String(leaderApprovalDate.value || ''))
})

const comments = ref<RejectionComment[]>([
  // 過去の差戻しコメントがあればここに表示
  // { role: '営業リーダー', text: '敬語を見直してください', date: '2025-09-15 14:30' }
])

onMounted(async () => {
  const id = Number(route.params.id)
  if (!Number.isFinite(id) || id <= 0) {
    loadError.value = '不正なIDです'
    isLoading.value = false
    return
  }

  try {
    const data = await scoutStore.fetchScoutDetail(id)
    scout.value = {
      ...scout.value,
      ...data
    }
    scoutText.value = data.scoutText || ''
    console.log('👔 管理者最終承認画面を表示:', id)
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'データ取得に失敗しました'
    console.error('❌ 管理者最終承認画面の取得失敗:', e)
  } finally {
    isLoading.value = false
  }
})

const approve = async () => {
  const confirmed = confirm('最終承認しますか？\n承認後、スカウト文のステータスが「承認済」になります。')
  if (!confirmed) return
  
  await scoutStore.approveByAdmin(scout.value.id)
  alert('✅ 最終承認しました！ステータスが「承認済」になりました。')
  router.push('/admin-list')
}

const reject = async () => {
  if (!rejectionReason.value) {
    alert('差戻理由を入力してください')
    return
  }
  
  const confirmed = confirm(`差戻しますか？\n理由: ${rejectionReason.value}`)
  if (!confirmed) return
  
  await scoutStore.rejectByAdmin(scout.value.id, rejectionReason.value)
  alert('❌ 差戻しました（管理者）')
  router.push('/admin-list')
}
const adminListChange= (tab: string) => {
  if (tab === 'スカウト文一覧') {
    router.push('/admin-list')
  }
}
</script>

<style scoped>
.approval-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.admin-banner {
  background: linear-gradient(135deg, #58d68d 0%, #27ae60 100%);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.admin-badge {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.status-badge {
  background: white;
  color: #27ae60;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

.content {
  flex: 1;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.state-message {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.state-message.error {
  color: #b71c1c;
}

.approval-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr 0.8fr;
  gap: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.detail-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.detail-row {
  display: grid;
  grid-template-columns: 120px 1fr 40px;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
}

.detail-row.highlight {
  grid-template-columns: 120px 1fr;
  background-color: #e8f5e9;
}

.detail-label,
.sub-label {
  padding: 0.75rem 1rem;
  background-color: #f5f5f5;
  font-weight: 500;
  border-right: 1px solid #e0e0e0;
}

.detail-value,
.sub-value {
  padding: 0.75rem 1rem;
}

.detail-value.approved {
  color: #27ae60;
  font-weight: bold;
}

.approved-mark {
  color: #27ae60;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 auto;
}

.detail-check {
  margin: 0 auto;
}

.detail-group {
  border-bottom: 1px solid #e0e0e0;
}

.group-header {
  padding: 0.75rem 1rem;
  background-color: #f5f5f5;
  font-weight: 500;
  border-bottom: 1px solid #e0e0e0;
}

.scout-text-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 300px;
  margin-bottom: 1.5rem;
}

.scout-text {
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
}

.reason-input {
  margin-bottom: 1.5rem;
}

.reason-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.reason-field {
  width: 100%;
  padding: 1rem;
  border: 2px solid #f44336;
  border-radius: 4px;
  font-size: 1rem;
}

.reason-field:focus {
  outline: none;
  border-color: #d32f2f;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-reject {
  padding: 0.75rem 2rem;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reject:hover {
  background-color: #b71c1c;
  transform: translateY(-2px);
}

.btn-final-approve {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #58d68d 0%, #27ae60 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(39, 174, 96, 0.3);
}

.btn-final-approve:hover {
  background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.4);
}

.comment-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.comment-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.comment-title.mt-3 {
  margin-top: 2rem;
}

.history-item {
  background: #e8f5e9;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #27ae60;
  margin-bottom: 1rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.history-role {
  font-weight: bold;
  color: #333;
}

.history-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.history-status.approved {
  background: #27ae60;
  color: white;
}

.history-body {
  font-size: 0.9rem;
  color: #666;
}

.history-approver {
  margin-bottom: 0.25rem;
}

.history-date {
  font-size: 0.85rem;
  color: #999;
}

.comment-item {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #fff9e6;
  border-left: 3px solid #ffc107;
  border-radius: 4px;
}

.comment-role {
  font-weight: bold;
  color: #f57c00;
  margin-bottom: 0.25rem;
}

.comment-text {
  color: #666;
  margin-bottom: 0.25rem;
}

.comment-date {
  font-size: 0.85rem;
  color: #999;
}

.no-comment {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

@media (max-width: 1200px) {
  .approval-layout {
    grid-template-columns: 1fr;
  }
}
</style>