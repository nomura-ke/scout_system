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
  padding: var(--space-6);
}

.panel-title {
  margin-bottom: var(--space-4);
}

.panel-content {
  margin-bottom: var(--space-6);
}

.panel-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

.btn-reject {
  padding: var(--space-3) var(--space-7);
  border-radius: var(--radius-sm);
  font-weight: bold;
  cursor: pointer;
}

.btn-approve {
  padding: var(--space-3) var(--space-7);
  border-radius: var(--radius-sm);
  font-weight: bold;
  cursor: pointer;
}

.btn-approve {
  background: var(--color-primary);
  color: #fff;
  border: 1px solid var(--color-primary);
}

.btn-approve:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}
</style>