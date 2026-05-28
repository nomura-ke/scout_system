<template>
  <table class="scout-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>タイトル</th>
        <th>作成者</th>
        <th>作成日</th>
        <th>ステータス</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="scout in scouts" :key="scout.id" @click="$emit('select', scout.id || '')">
        <td>{{ scout.id }}</td>
        <td>{{ scout.title }}</td>
        <td>{{ scout.creator }}</td>
        <td>{{ formatDate(scout.createdAt) }}</td>
        <td><StatusBadge :status="scout.status" /></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import StatusBadge from './StatusBadge.vue'
import { formatDate } from '../utils/helpers'
import type { ScoutEntity } from '../types'

defineProps<{ scouts: ScoutEntity[] }>()
defineEmits<{ (e: 'select', id: string): void }>()
</script>
