<template>
  <div class="base-input">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input-field"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  modelValue: [String, Number],
  placeholder: String,
  disabled: Boolean,
  required: Boolean,
  error: String
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.input-label {
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.input-field {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #1976d2;
}

.input-field:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  margin-top: 4px;
  font-size: 12px;
  color: #e53935;
}
</style>