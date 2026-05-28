import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getScoutDocuments, getScoutDetail, saveScout, deleteScout } from '../api/scoutApi'
import type { ScoutMessage } from '../types'

export const useScoutStore = defineStore('scout', () => {
  const scouts = ref<ScoutMessage[]>([])
  const currentScout = ref<ScoutMessage | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  async function fetchScouts() {
    loading.value = true
    error.value = null
    try {
      scouts.value = await getScoutDocuments()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'スカウト文の取得に失敗しました'
      throw e
    } finally {
      loading.value = false
    }
  }
  async function fetchScoutById(id: number) {
    loading.value = true
    error.value = null
    try {
      currentScout.value = await getScoutDetail(id)
      return currentScout.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'スカウト文の取得に失敗しました'
      throw e
    } finally {
      loading.value = false
    }
  }
  async function updateScout(id: number, data: any) {
    loading.value = true
    error.value = null
    try {
      const updated = await saveScout(id, data)
      currentScout.value = updated
      const index = scouts.value.findIndex(s => s.scout_id === id)
      if (index !== -1) {
        scouts.value[index] = updated
      }
      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'スカウト文の更新に失敗しました'
      throw e
    } finally {
      loading.value = false
    }
  }
  async function removeScout(id: number) {
    loading.value = true
    error.value = null
    try {
      await deleteScout(id)
      scouts.value = scouts.value.filter(s => s.scout_id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'スカウト文の削除に失敗しました'
      throw e
    } finally {
      loading.value = false
    }
  }
  function clearError() {
    error.value = null
  }
  return {
    scouts, currentScout, loading, error,
    fetchScouts, fetchScoutById, updateScout, removeScout, clearError,
  }
})
