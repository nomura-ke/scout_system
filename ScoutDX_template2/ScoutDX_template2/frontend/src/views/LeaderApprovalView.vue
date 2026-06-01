<template>
  <div class="approval-container">
    <AppHeader :tabs="['スカウト文一覧']" active-tab="スカウト文一覧" :show-logout="true" @tab-change="handleTabChange" />
    
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
              <input type="checkbox" class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">作成者名前</span>
              <span class="detail-value">{{ scout.creatorName }}</span>
              <input type="checkbox" class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">申請日時</span>
              <span class="detail-value">{{ appliedAtJst }}</span>
              <input type="checkbox" class="detail-check" />
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
              <span class="detail-value"></span>
              <input type="checkbox" class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">必須スキル</span>
              <span class="detail-value"></span>
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
              <span class="detail-value"></span>
              <input type="checkbox" class="detail-check" />
            </div>
          </div>
        </div>

        <!-- 中央：スカウト文章 -->
        <div class="scout-text-section">
          <h2 class="section-title">スカウト文章</h2>
          <div class="scout-text-card">
            <p class="scout-text">{{ scoutTextDisplay }}</p>
          </div>
          <div class="reason-input">
            <input
              v-model="rejectionReason"
              type="text"
              placeholder="ここに差戻理由を入力してください"
              class="reason-field"
            />
          </div>
          <div class="action-buttons">
            <button @click="reject" class="btn-reject">差戻し</button>
            <button @click="approve" class="btn-approve">承認</button>
          </div>
        </div>

        <!-- 右側：過去の差戻しコメント -->
        <div class="comment-section">
          <div class="comment-box">
            <h3 class="comment-title">過去の差戻しコメント</h3>
            <div v-if="comments.length > 0">
              <div v-for="(comment, index) in comments" :key="index" class="comment-item">
                <p class="comment-role">{{ comment.role }}:</p>
                <p class="comment-text">{{ comment.text }}</p>
                <p class="comment-date">{{ comment.date }}</p>
              </div>
            </div>
            <p v-else class="comment-item">差戻しコメントはありません</p>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScoutStore } from '../stores/scoutStore' 
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

interface RejectionCommentView {
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
  senderName: '',
  senderAge: '',
  senderGender: '',
  companyName: '',
  jobType: '',
  location: '',
  salary: '',
  scoutText: ''
})

const rejectionReason = ref('')
const comments = ref<RejectionCommentView[]>([])

const formatDateTime = (value: unknown) => {
  if (!value) return '-'
  const text = String(value)
  return text.replace('T', ' ').replace('Z', '')
}

const normalizeComment = (comment: any): RejectionCommentView => ({
  role: comment?.role || comment?.user_role || comment?.reviewer_name || comment?.user_name || '承認者',
  text: comment?.text || comment?.comment_text || comment?.comment || '',
  date: formatDateTime(comment?.date || comment?.created_at)
})

const dedupeComments = (items: RejectionCommentView[]) => {
  const unique = new Map<string, RejectionCommentView>()
  items.forEach((item: RejectionCommentView) => {
    unique.set(`${item.role}|${item.text}|${item.date}`, item)
  })
  return Array.from(unique.values())
}

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

const scoutTextDisplay = computed(() => {
  const value = (scout.value as any).scoutText
  if (value) return String(value)
  return String((scout.value as any)?.raw?.aiInfo?.response || '')
})

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    const { detail, comments: rawComments } = await scoutStore.fetchApprovalDetail(id)
    scout.value = detail
    const normalized = (Array.isArray(rawComments) ? rawComments : []).map(normalizeComment)
    comments.value = dedupeComments(normalized)
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'スカウト文詳細の取得に失敗しました'
  } finally {
    isLoading.value = false
  }
})

const approve = async () => {
  await scoutStore.approveScout(scout.value.id)
  alert('承認しました')
  router.push('/leader-list')
}

const reject = async () => {
  if (!rejectionReason.value) {
    alert('差戻理由を入力してください')
    return
  }
  await scoutStore.rejectScout(scout.value.id, rejectionReason.value)
  alert('差戻しました')
  router.push('/leader-list')
}

const handleTabChange = (tab: string) => {
  if (tab === 'スカウト文一覧') {
    router.push('/leader-list')
  }
}
</script>

<style scoped>
.approval-container {
  min-height: 100vh;
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

.reason-field {
  border-width: 1px;
  border-color: #95c2ad;
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

.btn-approve {
  padding: var(--space-3) var(--space-7);
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  border: 1px solid var(--color-primary);
  font-weight: bold;
  cursor: pointer;
}

.btn-approve:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.comment-section {
  padding: var(--space-6);
  height: fit-content;
}

.comment-title {
  font-size: var(--font-lg);
  font-weight: 700;
  margin: 0 0 var(--space-4);
}

.comment-item {
  margin-bottom: var(--space-4);
  padding: var(--space-3);
  background: #fff9e6;
  border-left: 3px solid #ffc107;
  border-radius: var(--radius-sm);
}

.comment-role {
  margin: 0 0 var(--space-1);
  font-weight: 600;
  color: var(--color-text);
}

.comment-text {
  margin: 0 0 var(--space-1);
  color: var(--color-text-muted);
}

.comment-date {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-sm);
}

@media (max-width: 1200px) {
  .approval-layout {
    grid-template-columns: 1fr;
  }
}
</style>