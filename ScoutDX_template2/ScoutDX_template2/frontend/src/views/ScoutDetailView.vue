<template>
  <div class="scout-detail-container">
    <AppHeader :tabs="['スカウト文作成', 'スカウト文一覧']" active-tab="スカウト文一覧" />
    
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
              <span class="detail-value">{{ scout.appliedAt }}</span>
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
              <span class="detail-label">職種</span>
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
            <button @click="saveScout" class="btn-save">保存</button>
            <button @click="requestApproval" class="btn-approval">
              承認申請(営業リーダーへ)
            </button>
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
import { useScoutStore } from '../stores/mockScoutStore' 
import AppHeader from '../components/AppHeader.vue'      // ← 修正
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
  jobDescription: '',
  requiredSkills: '',
  location: '東京都港区',
  salary: '600万円~',
  appeal: ''
})

const scoutText = ref('Aiが生成したスカウト文')

onMounted(async () => {
  const id = route.params.id
  const data = await scoutStore.fetchScoutDetail(Number(id))
  scout.value = data
  scoutText.value = data.scoutText
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
  await scoutStore.updateScout(scout.value.id, { scoutText: scoutText.value })
  alert('保存しました')
}

const requestApproval = async () => {
  await scoutStore.requestApproval(scout.value.id)
  alert('承認申請しました')
  router.push('/scout-list')
}



</script>

<style scoped>
.scout-detail-container {
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

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
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
  grid-template-columns: 140px 1fr;
  border-bottom: 1px solid #e0e0e0;
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

.detail-group {
  border-bottom: 1px solid #e0e0e0;
}

.detail-group .detail-label {
  display: block;
  padding: 0.75rem 1rem;
  background-color: #f5f5f5;
  font-weight: 500;
  border-bottom: 1px solid #e0e0e0;
}

.detail-sub {
  background: white;
}

.scout-text-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.scout-textarea {
  width: 100%;
  min-height: 400px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-save {
  padding: 0.75rem 2rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.btn-approval {
  padding: 0.75rem 2rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.btn-save:hover,
.btn-approval:hover {
  opacity: 0.9;
}

@media (max-width: 968px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
}
</style>