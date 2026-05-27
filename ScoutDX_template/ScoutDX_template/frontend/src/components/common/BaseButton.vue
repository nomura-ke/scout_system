<template>
  <button 
    :class="['base-button', colorClass, sizeClass]" 
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'warning', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const colorClass = computed(() => `button-${props.color}`)
const sizeClass = computed(() => `button-${props.size}`)
</script>

<style scoped>
.base-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Colors */
.button-primary {
  background-color: #1976d2;
  color: white;
}

.button-primary:hover:not(:disabled) {
  background-color: #1565c0;
}

.button-secondary {
  background-color: #ffa726;
  color: white;
}

.button-secondary:hover:not(:disabled) {
  background-color: #fb8c00;
}

.button-danger {
  background-color: #e53935;
  color: white;
}

.button-danger:hover:not(:disabled) {
  background-color: #c62828;
}

.button-warning {
  background-color: #fdd835;
  color: #333;
}

.button-warning:hover:not(:disabled) {
  background-color: #fbc02d;
}

.button-success {
  background-color: #43a047;
  color: white;
}

.button-success:hover:not(:disabled) {
  background-color: #388e3c;
}

/* Sizes */
.button-small {
  padding: 6px 12px;
  font-size: 12px;
}

.button-medium {
  padding: 10px 20px;
  font-size: 14px;
}

.button-large {
  padding: 14px 28px;
  font-size: 16px;
}
</style>