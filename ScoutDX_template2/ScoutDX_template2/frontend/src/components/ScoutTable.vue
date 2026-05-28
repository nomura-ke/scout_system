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
            <button @click="$emit('delete', item.id)" class="btn-delete">削除</button>
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
</script>

<style scoped>
.table-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.scout-table {
  width: 100%;
  border-collapse: collapse;
}

.scout-table th {
  background-color: #f5f5f5;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

.scout-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.link {
  color: #0066cc;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.btn-edit {
  padding: 0.5rem 1rem;
  background-color: #ffc107;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-delete {
  padding: 0.5rem 1rem;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-edit:hover,
.btn-delete:hover {
  opacity: 0.9;
}
</style>