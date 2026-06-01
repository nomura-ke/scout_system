<template>
  <div class="scout-detail-container">
    <AppHeader :tabs="['スカウト文作成', 'スカウト文一覧']" active-tab="スカウト文一覧" :show-logout="true" @tab-change="handleTabChange" />
    
    <div class="content">
      <div class="detail-layout">
        <!-- 左側：ドラフト文詳細 -->
        <div class="detail-section">
          <h2 class="section-title">ドラフト文詳細</h2>
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
            <div class="detail-group">
              <span class="detail-label">送信者情報</span>
              <div class="detail-sub">
                <div class="detail-row">
                  <span class="sub-label">名前</span>
                  <span class="sub-value">{{ scout.senderName }}</span>
                </div>
                <div class="detail-row">
                  <span class="sub-label">年齢</span>
                  <span class="sub-value">{{ scout.senderAge }}</span>
                </div>
                <div class="detail-row">
                  <span class="sub-label">性別</span>
                  <span class="sub-value">{{ scout.senderGender }}</span>
                </div>
              </div>
            </div>
            <div class="detail-row">
              <span class="detail-label">会社名</span>
              <span class="detail-value">{{ scout.companyName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">募集職種</span>
              <span class="detail-value">{{ scout.jobType }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">業務内容</span>
              <span class="detail-value">{{ scout.jobDescription }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">必須スキル</span>
              <span class="detail-value">{{ scout.requiredSkills }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">勤務地</span>
              <span class="detail-value">{{ scout.location }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">給与</span>
              <span class="detail-value">{{ scout.salary }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">求人の魅力</span>
              <span class="detail-value">{{ scout.appeal }}</span>
            </div>
          </div>
        </div>

        <!-- 右側：スカウト文 -->
        <div class="scout-text-section">
          <h2 class="section-title">スカウト文：</h2>
          <div class="scout-text-card">
            <textarea
              v-model="scoutText"
              class="scout-textarea"
              placeholder="Aiが生成したスカウト文"
            ></textarea>
          </div>
          <div class="action-buttons">
            <button @click="saveScout" class="btn-save" :disabled="!isActionEnabled">保存</button>
            <button @click="requestApproval" class="btn-approval" :disabled="!isActionEnabled">
              承認申請(営業リーダーへ)
            </button>
          </div>
           
          <div v-if="showRejectionComments" class="rejection-comments">
            <h3 class="rejection-title">差戻しコメント</h3>
            <div v-if="rejectionComments.length > 0" class="rejection-list">
              <div v-for="(comment, index) in rejectionComments" :key="index" class="rejection-item">
                <p class="rejection-meta">{{ comment.role }} / {{ comment.date }}</p>
                <p class="rejection-text">{{ comment.text }}</p>
              </div>
            </div>
            <p v-else class="rejection-empty">差戻しコメントはありません</p>
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
import AppHeader from '../components/AppHeader.vue'      // ← 修正
import AppFooter from '../components/AppFooter.vue' 


interface RejectionCommentView {
  role: string
  text: string
  date: string
}
const route = useRoute()
const router = useRouter()
const scoutStore = useScoutStore()

const scout = ref({
  id: 1,
  creatorName: '賀上',
  appliedAt: '2025-09-15 23:47:43',
  senderName: '山田太郎',
  senderAge: 23,
  senderGender: '男',
  companyName: '(株)トラスト',
  jobType: 'エンジニア',
  jobDescription: '',
  requiredSkills: '',
  location: '東京都港区',
  salary: '600万円~',
  appeal: '',
  status: 'draft'
})

const scoutText = ref('Aiが生成したスカウト文')
const rejectionComments = ref<RejectionCommentView[]>([])

const isActionEnabled = computed(() => ['draft', 'rejected'].includes(scout.value.status))
const showRejectionComments = computed(() => scout.value.status === 'rejected')

const appliedAtJst = computed(() => {
  if (!scout.value.appliedAt) return ''
  const date = new Date(scout.value.appliedAt)
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
})


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

const resolveRejectionComments = (data: any): RejectionCommentView[] => {
  const mapped = Array.isArray(data?.rejectionComments) ? data.rejectionComments : []
  if (mapped.length > 0) {
    return dedupeComments(mapped.map(normalizeComment))
  }

  const raw = Array.isArray(data?.raw?.comments) ? data.raw.comments : []
  return dedupeComments(raw.map(normalizeComment))
}

onMounted(async () => {
  const id = route.params.id
  const data = await scoutStore.fetchScoutDetail(Number(id))
  scout.value = data
  scoutText.value = data.scoutText
  if (data.status === 'rejected') {
    rejectionComments.value = resolveRejectionComments(data)
  }
})

const handleTabChange = (tab: string) => {
  console.log('📑 タブ切り替え:', tab)
  if (tab === 'スカウト文作成') {
    router.push('/scout-create')
  } else if (tab === 'スカウト文一覧') {
    router.push('/scout-list')
  }
}

const saveScout = async () => {
  if (!isActionEnabled.value) return
  await scoutStore.updateScout(scout.value.id, { scoutText: scoutText.value })
  alert('保存しました')
}

const requestApproval = async () => {
  if (!isActionEnabled.value) return
  try {
    console.log('🚀 承認申請を送信中...');
    await scoutStore.requestApproval(scout.value.id);
    console.log('✅ 承認申請成功');
    alert('承認申請しました');
    router.push('/scout-list');
  } catch (e) {
    console.error('❌ 承認申請失敗:', e);
    alert('申請に失敗しました: ' + (e instanceof Error ? e.message : e));
  }
};

</script>

<style scoped>
.scout-detail-container {
  min-height: 100vh;
}

.content {
  max-width: 1400px;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
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
  grid-template-columns: 140px 1fr;
  border-bottom: 1px solid var(--color-border);
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

.detail-group {
  border-bottom: 1px solid var(--color-border);
}

.detail-group .detail-label {
  display: block;
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface-muted);
  font-weight: 500;
  border-bottom: 1px solid var(--color-border);
}

.detail-sub {
  background: white;
}

.scout-text-card {
  padding: var(--space-6);
  margin-bottom: var(--space-6);
}

.scout-textarea {
  min-height: 400px;
  resize: vertical;
}

.action-buttons {
  display: flex;
  gap: var(--space-4);
  justify-content: flex-end;
}

.btn-save {
  padding: var(--space-3) var(--space-7);
  border-radius: var(--radius-sm);
  font-weight: bold;
  cursor: pointer;
}

.btn-approval {
  padding: var(--space-3) var(--space-7);
  border-radius: var(--radius-sm);
  font-weight: bold;
  cursor: pointer;
}

.btn-save:disabled,
.btn-approval:disabled {
  background-color: #9aa8bf;
  border-color: #9aa8bf;
  color: #f4f7fc;
  cursor: not-allowed;
  opacity: 1;
}


.rejection-comments {
  background: #fff7f7;
  border: 1px solid #ffd7d7;
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.rejection-title {
  margin: 0 0 var(--space-3);
  font-size: 1.05rem;
  color: #b71c1c;
}

.rejection-list {
  display: grid;
  gap: var(--space-3);
}

.rejection-item {
  background: #ffffff;
  border: 1px solid #ffe3e3;
  border-radius: var(--radius-sm);
  padding: var(--space-3);
}

.rejection-meta {
  margin: 0 0 0.35rem;
  font-size: 0.85rem;
  color: #666;
}

.rejection-text {
  margin: 0;
  line-height: 1.6;
  color: #333;
}

.rejection-empty {
  margin: 0;
  color: #666;
}

@media (max-width: 968px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
}
</style>