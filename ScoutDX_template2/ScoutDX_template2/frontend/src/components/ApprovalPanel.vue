<template>
  <div class="approval-panel">
    <button type="button" class="approve" @click="$emit('approve')">承認</button>
    <button type="button" class="remand" @click="$emit('remand')">差戻し</button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'approve'): void; (e: 'remand'): void }>()
</script>
