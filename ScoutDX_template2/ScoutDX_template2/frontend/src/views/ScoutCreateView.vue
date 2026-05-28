
<template>
  <div class="scout-create-container">
    <AppHeader :tabs="['スカウト文作成', 'スカウト文一覧']" active-tab="スカウト文作成" />
    
    <div class="content">
      <div class="two-column">
        <!-- 左側：求人ドラフトの入力 -->
        <div class="draft-section">
          <h2 class="section-title">求人ドラフトの入力</h2>
          <div class="form-card">
            <div class="form-group">
              <label>会社名：</label>
              <input v-model="draftForm.companyName" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>職種：</label>
              <input v-model="draftForm.jobType" type="text" placeholder="職種入力" class="form-input" />
            </div>
            <div class="form-group">
              <label>業務内容：</label>
              <input v-model="draftForm.jobDescription" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>必須スキル：</label>
              <input v-model="draftForm.requiredSkills" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>勤務地：</label>
              <input v-model="draftForm.location" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>給与：</label>
              <input v-model="draftForm.salary" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label>求人の魅力：</label>
              <textarea v-model="draftForm.appeal" class="form-textarea"></textarea>
            </div>
          </div>
        </div>

        <!-- 右側：AI生成条件の入力 -->
        <div class="ai-section">
          <h2 class="section-title">AI生成条件の入力</h2>
          <div class="form-card">
            <div class="form-group">
              <label>年齢：</label>
              <input v-model="aiForm.age" type="text" placeholder="年齢を入力" class="form-input" />
            </div>
            <div class="form-group">
              <label>性別：</label>
              <input v-model="aiForm.gender" type="text" placeholder="性別入力" class="form-input" />
            </div>
            <div class="form-group">
              <label>職種：</label>
              <input v-model="aiForm.jobType" type="text" placeholder="職種入力" class="form-input" />
            </div>
            <div class="form-group">
              <label>NGワード：</label>
              <textarea v-model="aiForm.ngWords" placeholder="NGワードを入力" class="form-textarea"></textarea>
            </div>
            <button @click="generateScout" class="btn-primary">
              AIにて生成する（現状疑似AI）
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useScoutStore } from '../stores/mockScoutStore' 
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

const generateScout = async () => {
  try {
    const result = await scoutStore.generateScout({
      ...draftForm.value,
      ...aiForm.value
    })
    router.push(`/scout-detail/${result.id}`)
  } catch (error) {
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
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
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
}

.form-input,
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

.btn-primary {
  width: 100%;
  padding: 1rem;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}

.btn-primary:hover {
  background-color: #0052a3;
}

@media (max-width: 968px) {
  .two-column {
    grid-template-columns: 1fr;
  }
}
</style>