<template>
  <div class="approval-panel">
    <h3 class="panel-title">{{ title }}</h3>
    <div class="panel-content">
      <slot />
    </div>
    <div v-if="showActions" class="panel-actions">
      <button @click="$emit('reject')" class="btn-reject">差戻し</button>
      <button @click="$emit('approve')" class="btn-approve">承認</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  showActions?: boolean
}

withDefaults(defineProps<Props>(), {
  showActions: true
})

defineEmits(['approve', 'reject'])
</script>

<style scoped>
.approval-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.panel-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.panel-content {
  margin-bottom: 1.5rem;
}

.panel-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-reject {
  padding: 0.75rem 2rem;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.btn-approve {
  padding: 0.75rem 2rem;
  background-color: #ffc107;
  color: #333;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.btn-reject:hover,
.btn-approve:hover {
  opacity: 0.9;
}
</style>