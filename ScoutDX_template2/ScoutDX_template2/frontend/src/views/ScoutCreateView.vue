<template>
  <div class="scout-create-container">
    <AppHeader 
      :tabs="['スカウト文作成', 'スカウト文一覧']" 
      active-tab="スカウト文作成"
      @tab-change="handleTabChange"
    />
    
    <div class="content">
      <h1 class="page-title">スカウト文作成</h1>

      <!-- 下書き入力フォーム -->
      <div class="form-section">
        <h2 class="section-title">下書き入力</h2>
        <div class="form-card">
          <div class="form-group">
            <label>会社名</label>
            <input v-model="draftForm.companyName" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>職種</label>
            <input v-model="draftForm.jobType" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>業務内容</label>
            <textarea v-model="draftForm.jobDescription" class="form-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>必須スキル</label>
            <input v-model="draftForm.requiredSkills" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>勤務地</label>
            <input v-model="draftForm.location" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>給与</label>
            <input v-model="draftForm.salary" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>求人の魅力</label>
            <textarea v-model="draftForm.appeal" class="form-textarea"></textarea>
          </div>
        </div>
      </div>

      <!-- AI生成用入力フォーム -->
      <div class="form-section">
        <h2 class="section-title">AI生成用入力</h2>
        <div class="form-card">
          <div class="form-group">
            <label>求職者（必須）</label>
            <input v-model="aiForm.seekerName" type="text" class="form-input" placeholder="求職者名を入力（例: 山田 太郎）" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>年齢</label>
              <input v-model="aiForm.age" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>性別</label>
              <select v-model="aiForm.gender" class="form-select">
                <option value="">選択してください</option>
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>職種</label>
            <input v-model="aiForm.jobType" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>NGワード（カンマ区切り）</label>
            <input v-model="aiForm.ngWords" type="text" class="form-input" placeholder="例: 残業, 休日出勤" />
          </div>
          <button @click="generateScout" class="btn-generate">
            🤖 AIでスカウト文を生成
          </button>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useScoutStore } from '../stores/scoutStore'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
const scoutStore = useScoutStore()

const draftForm = ref({
  companyName: '',
  jobType: '',
  jobDescription: '',
  requiredSkills: '',
  location: '',
  salary: '',
  appeal: ''
})

const aiForm = ref({
  seekerName: '',
  age: '',
  gender: '',
  jobType: '',
  ngWords: ''
})

// タブ切り替え
const handleTabChange = (tab: string) => {
  console.log('📑 タブ切り替え:', tab)
  if (tab === 'スカウト文作成') {
    router.push('/scout-create')
  } else if (tab === 'スカウト文一覧') {
    router.push('/scout-list')
  }
}

const generateScout = async () => {
  try {
    if (!aiForm.value.seekerName.trim()) {
      alert('求職者の名前を入力してください')
      return
    }
    console.log('🤖 スカウト文を生成中...')
    const result = await scoutStore.generateScout({
      ...draftForm.value,
      ...aiForm.value
    })
    console.log('✅ 生成完了:', result)
    alert('スカウト文を生成しました！')
    router.push(`/scout-detail/${result.id}`)
  } catch (error) {
    console.error('❌ 生成失敗:', error)
    alert('生成に失敗しました')
  }
}
</script>

<style scoped>
.scout-create-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.form-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.btn-generate {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-generate:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}

.btn-generate:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>