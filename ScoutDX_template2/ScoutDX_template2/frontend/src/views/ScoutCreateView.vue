<template>
  <section class="view">
    <h2>スカウト文作成</h2>
    <form @submit.prevent="submit">
      <input v-model="form.creator" type="text" placeholder="作成者" required />
      <input v-model="form.title" type="text" placeholder="タイトル" required />
      <textarea v-model="form.body" rows="8" placeholder="本文" required />
      <div class="row">
        <button type="button" @click="generate">AI生成</button>
        <button type="submit">保存</button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { generateScoutBody } from '../api/scoutApi'
import { useScoutStore } from '../stores/scoutStore'

const store = useScoutStore()
const router = useRouter()

const form = reactive({
  creator: '',
  title: '',
  body: '',
})

async function generate() {
  const sample = await generateScoutBody()
  form.body = sample.body
}

async function submit() {
  await store.addScout(form)
  await router.push('/scouts')
}
</script>
