<template>
  <div class="approval-container">
    <AppHeader :tabs="['スカウト文一覧']" active-tab="スカウト文一覧" :show-logout="true" @tab-change="adminListChange" />
    
    
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

const formatDateTime = (value: unknown) => {
  if (!value) return '-'
  const text = String(value)
  return text.replace('T', ' ').replace('Z', '')
}

const normalizeComment = (comment: any): RejectionComment => ({
  role: comment?.role || comment?.user_role || comment?.reviewer_name || comment?.user_name || '承認者',
  text: comment?.text || comment?.comment_text || comment?.comment || '',
  date: formatDateTime(comment?.date || comment?.created_at)
})

const dedupeComments = (items: RejectionComment[]) => {
  const unique = new Map<string, RejectionComment>()
  items.forEach((item: RejectionComment) => {
    unique.set(`${item.role}|${item.text}|${item.date}`, item)
  })
  return Array.from(unique.values())
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    const { detail, comments: rawComments } = await scoutStore.fetchApprovalDetail(id)
    scout.value = detail
    scoutText.value = detail.scoutText || detail?.raw?.aiInfo?.response || ''
    const normalized = (Array.isArray(rawComments) ? rawComments : []).map(normalizeComment)
    comments.value = dedupeComments(normalized)
    console.log('👔 管理者最終承認画面を表示:', id)
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'スカウト文詳細の取得に失敗しました'
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
}

.admin-banner {
  background: linear-gradient(135deg, #43b177 0%, #238b53 100%);
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.admin-badge {
  color: white;
  font-weight: bold;
  font-size: var(--font-lg);
}

.status-badge {
  background: white;
  color: var(--color-success);
  padding: var(--space-1) var(--space-3);
  border-radius: 20px;
  font-size: var(--font-sm);
  font-weight: bold;
}

.content {
  max-width: 1600px;
}

.state-message {
  border-radius: var(--radius-md);
  padding: var(--space-6);
  text-align: center;
}

.state-message.error {
  color: var(--color-danger);
}

.approval-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr 0.8fr;
  gap: var(--space-7);
}

.section-title {
  margin-bottom: var(--space-6);
}

.detail-card {
  overflow: hidden;
}

.detail-row {
  display: grid;
  grid-template-columns: 120px 1fr 40px;
  border-bottom: 1px solid var(--color-border);
  align-items: center;
}

.detail-row.highlight {
  grid-template-columns: 120px 1fr;
  background-color: var(--color-success-soft);
}

.detail-label,
.sub-label {
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface-muted);
  font-weight: 500;
  border-right: 1px solid var(--color-border);
}

.detail-value,
.sub-value {
  padding: var(--space-3) var(--space-4);
}

.detail-value.approved {
  color: var(--color-success);
  font-weight: bold;
}

.approved-mark {
  color: var(--color-success);
  font-size: var(--font-lg);
  font-weight: bold;
  margin: 0 auto;
}

.detail-check {
  margin: 0 auto;
}

.detail-group {
  border-bottom: 1px solid var(--color-border);
}

.group-header {
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface-muted);
  font-weight: 500;
  border-bottom: 1px solid var(--color-border);
}

.scout-text-card {
  padding: var(--space-7);
  min-height: 300px;
  margin-bottom: var(--space-6);
}

.scout-text {
  color: var(--color-text);
  line-height: 1.8;
  white-space: pre-wrap;
}

.reason-input {
  margin-bottom: var(--space-6);
}

.reason-label {
  display: block;
  font-weight: 500;
  margin-bottom: var(--space-2);
  color: var(--color-text);
}

.reason-field {
  border-color: #e3a29f;
}

.reason-field:focus {
  border-color: var(--color-danger);
}

.action-buttons {
  display: flex;
  gap: var(--space-4);
  justify-content: flex-end;
}

.btn-reject {
  padding: var(--space-3) var(--space-7);
  border-radius: var(--radius-sm);
  font-weight: bold;
  cursor: pointer;
}

.btn-final-approve {
  padding: var(--space-3) var(--space-7);
  background: linear-gradient(135deg, #43b177 0%, #238b53 100%);
  color: white;
  border: 1px solid #238b53;
  border-radius: var(--radius-sm);
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(35, 139, 83, 0.25);
}

.btn-final-approve:hover {
  background: linear-gradient(135deg, #2f9e62 0%, #1c7445 100%);
}

.comment-section {
  padding: var(--space-6);
  height: fit-content;
}

.comment-title {
  font-size: var(--font-lg);
  font-weight: bold;
  margin-bottom: var(--space-4);
  color: var(--color-text);
}

.comment-title.mt-3 {
  margin-top: var(--space-7);
}

.history-item {
  background: var(--color-success-soft);
  padding: var(--space-4);
  border-radius: var(--radius-sm);
  border-left: 4px solid var(--color-success);
  margin-bottom: var(--space-4);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.history-role {
  font-weight: bold;
  color: var(--color-text);
}

.history-status {
  padding: var(--space-1) var(--space-3);
  border-radius: 20px;
  font-size: var(--font-sm);
  font-weight: bold;
}

.history-status.approved {
  background: var(--color-success);
  color: white;
}

.history-body {
  font-size: var(--font-sm);
}

.history-approver {
  margin-bottom: var(--space-1);
}

.history-date {
  font-size: var(--font-sm);
}

.comment-item {
  margin-bottom: var(--space-4);
  padding: var(--space-3);
  background: #fff9e6;
  border-left: 3px solid #ffc107;
  border-radius: var(--radius-sm);
}

.comment-role {
  font-weight: bold;
  color: #f57c00;
  margin-bottom: var(--space-1);
}

.comment-text {
  margin-bottom: var(--space-1);
}

.comment-date {
  font-size: var(--font-sm);
}

.no-comment {
  color: var(--color-text-muted);
  font-style: italic;
  text-align: center;
  padding: var(--space-4);
}

@media (max-width: 1200px) {
  .approval-layout {
    grid-template-columns: 1fr;
  }
}
</style>