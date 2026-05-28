import { defineStore } from 'pinia'
export const useApprovalStore = defineStore('approval', { state: () => ({ pending: [] as unknown[], approved: [] as unknown[] }) })

