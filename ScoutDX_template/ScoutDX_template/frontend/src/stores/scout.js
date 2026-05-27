import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const useScoutStore = defineStore('scout', {
  state: () => ({
    scoutDocuments: [],
    currentDocument: null,
    pendingDocuments: [],
    approvedDocuments: [],
    filterStatus: 'all'
  }),

  getters: {
    filteredDocuments: (state) => {
      if (state.filterStatus === 'all') return state.scoutDocuments
      return state.scoutDocuments.filter(doc => doc.status === state.filterStatus)
    },

    statusLabel: () => (status) => {
      const labels = {
        draft: '編集中',
        pending: '営業リーダー承認待ち',
        approved: '承認済',
        rejected: '差戻し'
      }
      return labels[status] || status
    }
  },

  actions: {
    getAuthHeaders() {
      const authStore = useAuthStore()
      return { Authorization: `Bearer ${authStore.token}` }
    },

    // スカウト文一覧取得
    async fetchScoutDocuments() {
      try {
        const response = await axios.get(`${API_BASE_URL}/scout-documents`, {
          headers: this.getAuthHeaders()
        })
        
        this.scoutDocuments = response.data.documents
        return { success: true }
      } catch (error) {
        console.error('Fetch documents error:', error)
        return { success: false, message: '一覧の取得に失敗しました' }
      }
    },

    // スカウト文詳細取得
    async fetchScoutDocument(id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/scout-documents/${id}`, {
          headers: this.getAuthHeaders()
        })
        
        this.currentDocument = response.data.document
        return { success: true }
      } catch (error) {
        console.error('Fetch document error:', error)
        return { success: false, message: '詳細の取得に失敗しました' }
      }
    },

    // AI生成（疑似）
    async generateScout(draftData, aiConditions) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/scout-documents/generate-full`,
          { draftData, aiConditions },
          { headers: this.getAuthHeaders() }
        )
        
        this.currentDocument = response.data.document
        return { success: true, document: response.data.document }
      } catch (error) {
        console.error('Generate scout error:', error)
        return { success: false, message: 'AI生成に失敗しました' }
      }
    },

    // スカウト文保存
    async saveScoutDocument(id, data) {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/scout-documents/${id}`,
          data,
          { headers: this.getAuthHeaders() }
        )
        
        return { success: true, message: '保存しました' }
      } catch (error) {
        console.error('Save document error:', error)
        return { success: false, message: '保存に失敗しました' }
      }
    },

    // 承認申請
    async submitForApproval(id) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/scout-documents/${id}/submit`,
          {},
          { headers: this.getAuthHeaders() }
        )
        
        return { success: true, message: '承認申請しました' }
      } catch (error) {
        console.error('Submit for approval error:', error)
        return { success: false, message: '承認申請に失敗しました' }
      }
    },

    // 削除
    async deleteScoutDocument(id) {
      try {
        await axios.delete(`${API_BASE_URL}/scout-documents/${id}`, {
          headers: this.getAuthHeaders()
        })
        
        this.scoutDocuments = this.scoutDocuments.filter(doc => doc.id !== id)
        return { success: true, message: '削除しました' }
      } catch (error) {
        console.error('Delete document error:', error)
        return { success: false, message: '削除に失敗しました' }
      }
    },

    // 承認待ち一覧取得（営業リーダー用）
    async fetchPendingDocuments() {
      try {
        const response = await axios.get(`${API_BASE_URL}/scout-documents/pending`, {
          headers: this.getAuthHeaders()
        })
        
        this.pendingDocuments = response.data.documents
        return { success: true }
      } catch (error) {
        console.error('Fetch pending documents error:', error)
        return { success: false }
      }
    },

    // 承認済み一覧取得（営業リーダー用）
    async fetchApprovedDocuments() {
      try {
        const response = await axios.get(`${API_BASE_URL}/scout-documents/approved`, {
          headers: this.getAuthHeaders()
        })
        
        this.approvedDocuments = response.data.documents
        return { success: true }
      } catch (error) {
        console.error('Fetch approved documents error:', error)
        return { success: false }
      }
    },

    // 承認
    async approveDocument(id) {
      try {
        await axios.post(
          `${API_BASE_URL}/scout-documents/${id}/approve`,
          {},
          { headers: this.getAuthHeaders() }
        )
        
        return { success: true, message: '承認しました' }
      } catch (error) {
        console.error('Approve document error:', error)
        return { success: false, message: '承認に失敗しました' }
      }
    },

    // 差戻し
    async rejectDocument(id, comment) {
      try {
        await axios.post(
          `${API_BASE_URL}/scout-documents/${id}/reject`,
          { comment },
          { headers: this.getAuthHeaders() }
        )
        
        return { success: true, message: '差戻しました' }
      } catch (error) {
        console.error('Reject document error:', error)
        return { success: false, message: '差戻しに失敗しました' }
      }
    }
  }
})