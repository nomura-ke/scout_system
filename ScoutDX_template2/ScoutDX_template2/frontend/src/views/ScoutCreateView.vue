<template>
  <div class="scout-create-container">
    <AppHeader 
      :tabs="['スカウト文作成', 'スカウト文一覧']" 
      active-tab="スカウト文作成"
      :show-logout="true"
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
            <label>募集職種</label>
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
          <div class="form-row">
            <div class="form-group">
              <label>年齢 <span style="color: red">*</span></label>
              <input v-model="aiForm.age" type="text" class="form-input" required />
            </div>
           <div class="form-group">
              <label>性別 <span style="color: red">*</span></label>
              <select v-model="aiForm.gender" class="form-select" required>
                <option value="">選択してください</option>
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>
          <div class="form-group">
           <label>職種 <span style="color: red">*</span></label>
            <input v-model="aiForm.jobType" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label>追加NGワード（カンマ区切り）</label>
            <input v-model="aiForm.ngWords" type="text" class="form-input" placeholder="例: 残業, 休日出勤" />
            <p class="form-note">
              固定NGワード（必ず、絶対に、誰でも、簡単に、確実に、今だけ、早い者勝ち、限定、日本人限定、外国人NG、女性限定、男性歓迎、既婚者歓迎、若手限定、高収入保証）は常にチェックされます。
            </p>
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
    console.log('🤖 スカウト文を生成中...')
    const result = await scoutStore.generateScout({
      ...aiForm.value,     
      ...draftForm.value
    })
    console.log('✅ 生成完了:', result)
    alert('スカウト文を生成しました！')
    router.push(`/scout-detail/${result.id}`)
  } catch (error) {
    console.error('❌ 生成失敗:', error)
    const message = error instanceof Error ? error.message : '生成に失敗しました'
    alert(message)
  }
}
</script>

<style scoped>
.scout-create-container {
  min-height: 100vh;
}

.content {
  max-width: 1200px;
}

.page-title {
  font-weight: bold;
  text-align: center;
  margin-bottom: var(--space-7);
}

.form-section {
  margin-bottom: var(--space-7);
}

.section-title {
  margin-bottom: var(--space-4);
}

.form-card {
  padding: var(--space-7);
}

.form-group {
  margin-bottom: var(--space-6);
}

.form-group label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: 500;
}

.form-note {
  margin-top: var(--space-2);
  color: var(--text-secondary);
  font-size: var(--font-sm);
  line-height: 1.5;
}

.form-input,
.form-select,
.form-textarea {
  font-size: var(--font-md);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.btn-generate {
  width: 100%;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--font-lg);
  font-weight: bold;
  cursor: pointer;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>