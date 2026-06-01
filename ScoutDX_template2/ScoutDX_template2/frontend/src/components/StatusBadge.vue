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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1) var(--space-3);
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: var(--font-sm);
  font-weight: 700;
  white-space: nowrap;
}

.status-editing {
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  border-color: #b5d3f6;
}

.status-pending {
  background-color: var(--color-warning-soft);
  color: var(--color-warning);
  border-color: #f4d699;
}

.status-approved {
  background-color: var(--color-success-soft);
  color: var(--color-success);
  border-color: #bde6cb;
}

.status-rejected {
  background-color: var(--color-danger-soft);
  color: var(--color-danger);
  border-color: #f1c4c2;
}
</style>