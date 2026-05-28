<template>
  <span class="badge" :class="statusClass">{{ label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScoutStatus } from '../types'
import { toStatusLabel } from '../utils/helpers'

const props = defineProps<{ status?: ScoutStatus }>()

const label = computed(() => toStatusLabel(props.status))
const statusClass = computed(() => `is-${(props.status || 'DRAFT').toLowerCase()}`)
</script>
