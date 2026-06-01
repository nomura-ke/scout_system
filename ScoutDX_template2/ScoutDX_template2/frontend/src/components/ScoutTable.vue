<template>
  <div class="table-wrapper">
    <table class="scout-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
          <th v-if="showActions" colspan="2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td v-for="col in columns" :key="col.key">
            <a v-if="col.key === 'jobSeeker'" href="#" class="link">
              {{ item[col.key] }}
            </a>
            <StatusBadge v-else-if="col.key === 'status'" :status="item[col.key]" />
            <span v-else>{{ item[col.key] }}</span>
          </td>
          <td v-if="showActions">
            <button @click="$emit('edit', item.id)" class="btn-edit">編集</button>
          </td>
          <td v-if="showActions">
            <button
              @click="$emit('delete', item.id)"
              class="btn-delete"
              :disabled="!isDraftStatus(item.status)"
            >
              削除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from './StatusBadge.vue'

interface Column {
  key: string
  label: string
}

interface Props {
  items: any[]
  columns: Column[]
  showActions?: boolean
}

withDefaults(defineProps<Props>(), {
  showActions: true
})

defineEmits(['edit', 'delete'])

const isDraftStatus = (status: string) => {
  // APIマッピングの違いに対応（生ステータス/表示ラベル）
  return status === 'draft' || status === '編集中'
}
</script>

<style scoped>
.table-wrapper {
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.scout-table {
  width: 100%;
  border-collapse: collapse;
}

.scout-table th {
  padding: var(--space-4);
  font-weight: 600;
}

.scout-table td {
  padding: var(--space-4);
}

.btn-edit {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: bold;
}

.btn-delete {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: bold;
}

.btn-delete:disabled {
  background-color: #9aa8bf;
  border-color: #9aa8bf;
  color: #f4f7fc;
  cursor: not-allowed;
  opacity: 1;
}

.btn-delete:disabled:hover {
  opacity: 1;
}
</style>