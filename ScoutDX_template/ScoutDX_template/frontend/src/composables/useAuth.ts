import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
export const useAuth = () => { const store = useAuthStore(); return { ...storeToRefs(store), store } }

