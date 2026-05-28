import { defineStore } from 'pinia'
export const useRoleStore = defineStore('role', { state: () => ({ currentRole: null as string | null }), actions: { setRole(role: string) { this.currentRole = role } } })

