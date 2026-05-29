<template>
  <div class="approval-container">
    <AppHeader :tabs="['スカウト文一覧']" active-tab="スカウト文一覧" />
    
    <div class="content">
      <div class="approval-layout">
        <!-- 左側：スカウト文詳細 -->
        <div class="detail-section">
          <h2 class="section-title">スカウト文詳細</h2>
          <div class="detail-card">
            <div class="detail-row">
              <span class="detail-label">ID</span>
              <span class="detail-value">{{ scout.id }}</span>
              <input type="checkbox" checked class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">作成者名前</span>
              <span class="detail-value">{{ scout.creatorName }}</span>
              <input type="checkbox" checked class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">申請日時</span>
              <span class="detail-value">{{ scout.appliedAt }}</span>
              <input type="checkbox" checked class="detail-check" />
            </div>
            <div class="detail-group">
              <div class="group-header">
                <span class="detail-label">送信者情報</span>
              </div>
              <div class="detail-row">
                <span class="sub-label">名前</span>
                <span class="sub-value">{{ scout.senderName }}</span>
                <input type="checkbox" checked class="detail-check" />
              </div>
              <div class="detail-row">
                <span class="sub-label">年齢</span>
                <span class="sub-value">{{ scout.senderAge }}</span>
                <input type="checkbox" checked class="detail-check" />
              </div>
              <div class="detail-row">
                <span class="sub-label">性別</span>
                <span class="sub-value">{{ scout.senderGender }}</span>
                <input type="checkbox" checked class="detail-check" />
              </div>
            </div>
            <div class="detail-row">
              <span class="detail-label">会社名</span>
              <span class="detail-value">{{ scout.companyName }}</span>
              <input type="checkbox" checked class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">職種</span>
              <span class="detail-value">{{ scout.jobType }}</span>
              <input type="checkbox" checked class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">業務内容</span>
              <span class="detail-value"></span>
              <input type="checkbox" checked class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">必須スキル</span>
              <span class="detail-value"></span>
              <input type="checkbox" checked class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">勤務地</span>
              <span class="detail-value">{{ scout.location }}</span>
              <input type="checkbox" checked class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">給与</span>
              <span class="detail-value">{{ scout.salary }}</span>
              <input type="checkbox" checked class="detail-check" />
            </div>
            <div class="detail-row">
              <span class="detail-label">求人の魅力</span>
              <span class="detail-value"></span>
              <input type="checkbox" checked class="detail-check" />
            </div>
          </div>
        </div>

        <!-- 中央：スカウト文章 -->
        <div class="scout-text-section">
          <h2 class="section-title">スカウト文章</h2>
          <div class="scout-text-card">
            <p class="scout-text">Aiが生成したスカウト文</p>
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
            <p class="comment-item">差戻しコメント１：</p>
            <p class="comment-item">差戻しコメント２：</p>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScoutStore } from '../stores/scoutStore' 
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

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
  location: '東京都港区',
  salary: '600万円~'
})

const rejectionReason = ref('')

onMounted(async () => {
  const id = route.params.id
  const data = await scoutStore.fetchScoutDetail(Number(id))
  scout.value = data
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
</script>

<style scoped>
.approval-container {
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
  color: #666;
  line-height: 1.8;
}

.reason-input {
  margin-bottom: 1.5rem;
}

.reason-field {
  width: 100%;
  padding: 1rem;
  border: 2px solid #4caf50;
  border-radius: 4px;
  font-size: 1rem;
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
}

.btn-approve {
  padding: 0.75rem 2rem;
  background-color: #ffc107;
  color: #333;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
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
}

.comment-item {
  margin-bottom: 0.5rem;
  color: #666;
}

@media (max-width: 1200px) {
  .approval-layout {
    grid-template-columns: 1fr;
  }
}
</style>