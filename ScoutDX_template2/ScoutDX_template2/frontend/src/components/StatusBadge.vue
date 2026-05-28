<template>
  <span :class="['status-badge', statusClass]">
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: string
}

const props = defineProps<Props>()

const statusClass = computed(() => {
  switch (props.status) {
    case '編集中':
      return 'status-editing'
    case '営業リーダー承認待ち':
      return 'status-pending'
    case '承認済':
      return 'status-approved'
    case '差戻し':
      return 'status-rejected'
    default:
      return ''
  }
})

const statusText = computed(() => props.status)
</script>

<style scoped>
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-editing {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-pending {
  background-color: #fff3e0;
  color: #f57c00;
}

.status-approved {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-rejected {
  background-color: #ffebee;
  color: #d32f2f;
}
</style>