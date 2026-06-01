import { defineStore } from 'pinia'
import { ref } from 'vue'
function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}
import {
  approveScoutByAdmin,
  approveScoutByLeader,
  deleteScout as deleteScoutApi,
  generateScoutFull,
  getApprovedScouts,
  getPendingScoutsForAdmin,
  getPendingScoutsForLeader,
  getRejectionComments,
  getScoutApprovalDetail,
  getScoutDetail,
  getScoutDocuments,
  rejectScout as rejectScoutApi,
  saveScout,
  submitForApproval
} from '../api/scoutApi'

export const useScoutStore = defineStore('scout', () => {
  const scouts = ref<any[]>([])
  const currentScout = ref<any | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const parseSeekerName = (item: any): string => {
    if (item?.seeker_name) return item.seeker_name
    const prompt = item?.ai_prompt || item?.prompt
    if (!prompt || typeof prompt !== 'string') return '候補者'

    try {
      const parsed = JSON.parse(prompt)
      return (
        parsed?.aiRequest?.seeker_name ||
        parsed?.aiRequest?.seekerName ||
        parsed?.seekerName ||
        parsed?.seeker_name ||
        '候補者'
      )
    } catch {
      return '候補者'
    }
  }

  const mapListItem = (item: any) => ({
    id: item.id,
    jobSeeker: parseSeekerName(item),
    senderAge: item.age_range || '-',
    senderGender: item.gender || '-',
    companyName: item.company_name || '-',
    createdAt: item.created_at || item.updated_at || '',
    status: item.status_label || item.status || '-',
    raw: item
  })

  const mapDetail = (detail: any) => {
    const scout = detail?.scout || {}
    const draft = detail?.draft || {}
    const aiInfo = detail?.aiInfo || {}

    return {
      id: scout.id,
      creatorName: detail?.creator?.username || '',
      appliedAt: scout.submitted_at || scout.updated_at || '',
      senderName: parseSeekerName(aiInfo),
      senderAge: aiInfo.age_range || '-',
      senderGender: aiInfo.gender || '-',
      companyName: draft.company_name || '',
      jobType: draft.position || '',
      jobDescription: draft.business_description || '',
      requiredSkills: draft.required_skills || '',
      location: draft.work_location || '',
      salary: draft.salary || '',
      appeal: draft.job_appeal || '',
      scoutText: scout.content || '',
      status: scout.status || '',
      raw: detail
    }
  }

  async function fetchScouts() {
    loading.value = true
    error.value = null
    try {
      const result = await getScoutDocuments()
      scouts.value = result.map(mapListItem)
      return scouts.value
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
      const detail = await getScoutDetail(id)
      currentScout.value = mapDetail(detail)
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
      await saveScout(id, {
        content: data.scoutText || data.content || '',
        draftData: data.draftData
      })
      const updated = await fetchScoutById(id)
      const index = scouts.value.findIndex((s: any) => s.id === id)
      if (index !== -1) {
        scouts.value[index] = mapListItem(updated.raw?.scout || updated.raw || updated)
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
      await deleteScoutApi(id)
      scouts.value = scouts.value.filter((s: any) => s.id !== id)
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

  const fetchScoutList = async () => fetchScouts()

  const fetchScoutDetail = async (id: number) => fetchScoutById(id)

  const generateScout = async (data: any) => {
    const draftData = {
      company_name: data.companyName,
      position: data.jobType,
      business_description: data.jobDescription,
      required_skills: data.requiredSkills,
      work_location: data.location,
      salary: data.salary,
      job_appeal: data.appeal,
      sender_appeal: data.appeal
    }

    const aiRequest = {
      seeker_name: data.seekerName || '',
      age_range: data.age || '指定なし',
      gender: data.gender || '指定なし',
      position: data.jobType,
      salary: data.salary,
      ng_words: data.ngWords || ''
    }

    const result = await generateScoutFull(draftData, aiRequest)
    const id = Number(result?.data?.scoutId || result?.data?.id)
    return { id }
  }

  const deleteScout = async (id: number) => removeScout(id)

  const requestApproval = async (id: number) => {
    await submitForApproval(id)
  }

  const fetchLeaderList = async () => {
    const [pendingLeaderResult, pendingAdminResult, approvedResult, allScouts] = await Promise.all([
      getPendingScoutsForLeader()
        .then((data) => ({ ok: true, data }))
        .catch(() => ({ ok: false, data: [] as any[] })),
      getPendingScoutsForAdmin()
        .then((data) => ({ ok: true, data }))
        .catch(() => ({ ok: false, data: [] as any[] })),
      getApprovedScouts()
        .then((data) => ({ ok: true, data }))
        .catch(() => ({ ok: false, data: [] as any[] })),
      getScoutDocuments().catch(() => [] as any[])
    ])

    const allItems = Array.isArray(allScouts) ? allScouts : []
    const pendingLeader = pendingLeaderResult.ok
      ? pendingLeaderResult.data
      : allItems.filter((item: any) => item.status === 'pending_leader')
    const pendingAdmin = pendingAdminResult.ok
      ? pendingAdminResult.data
      : allItems.filter((item: any) => item.status === 'pending_admin')
    const approved = approvedResult.ok
      ? approvedResult.data
      : allItems.filter((item: any) => item.status === 'approved')

    const pending = pendingLeader.map((item: any) => ({
      id: item.id,
      companyName: item.company_name || '-',
      senderName: parseSeekerName(item),
      senderAge: item.age_range || '-',
      senderGender: item.gender || '-',
      creatorName: item.creator_name || '',
      appliedAt: formatDate(item.submitted_at || item.updated_at || '')
    }))

    const adminPending = pendingAdmin.map((item: any) => ({
      id: item.id,
      companyName: item.company_name || '-',
      senderName: parseSeekerName(item),
      senderAge: item.age_range || '-',
      senderGender: item.gender || '-',
      creatorName: item.creator_name || '',
      approvedAt: formatDate(item.submitted_at || item.updated_at || '')
    }))

    const approvedList = approved.map((item: any) => ({
      id: item.id,
      companyName: item.company_name || '-',
      senderName: parseSeekerName(item),
      senderAge: item.age_range || '-',
      senderGender: item.gender || '-',
      creatorName: item.creator_name || '',
      approvedAt: formatDate(item.approved_at || item.updated_at || '')
    }))

    return {
      pending,
      adminPending,
      approved: approvedList
    }
  }

  const fetchAdminList = async () => {
    const [pendingAdminResult, approvedResult, allScouts] = await Promise.all([
      getPendingScoutsForAdmin()
        .then((data) => ({ ok: true, data }))
        .catch(() => ({ ok: false, data: [] as any[] })),
      getApprovedScouts()
        .then((data) => ({ ok: true, data }))
        .catch(() => ({ ok: false, data: [] as any[] })),
      getScoutDocuments().catch(() => [] as any[])
    ])

    const allItems = Array.isArray(allScouts) ? allScouts : []
    const pendingAdmin = pendingAdminResult.ok
      ? pendingAdminResult.data
      : allItems.filter((item: any) => item.status === 'pending_admin')
    const approved = approvedResult.ok
      ? approvedResult.data
      : allItems.filter((item: any) => item.status === 'approved')

    const pending = pendingAdmin.map((item: any) => ({
      id: item.id,
      companyName: item.company_name || '-',
      senderName: parseSeekerName(item),
      senderAge: item.age_range || '-',
      senderGender: item.gender || '-',
      creatorName: item.creator_name || '',
      appliedAt: formatDate(item.submitted_at || item.updated_at || '')
    }))

    const approvedList = approved.map((item: any) => ({
      id: item.id,
      companyName: item.company_name || '-',
      senderName: parseSeekerName(item),
      senderAge: item.age_range || '-',
      senderGender: item.gender || '-',
      creatorName: item.creator_name || '',
      approvedAt: formatDate(item.approved_at || item.updated_at || '')
    }))

    return {
      pending,
      approved: approvedList
    }
  }

  const approveScout = async (id: number) => {
    await approveScoutByLeader(id)
  }

  const rejectScout = async (id: number, reason: string) => {
    await rejectScoutApi(id, reason)
  }

  const approveByAdmin = async (id: number) => {
    await approveScoutByAdmin(id)
  }

  const rejectByAdmin = async (id: number, reason: string) => {
    await rejectScoutApi(id, reason)
  }

  const fetchApprovalDetail = async (id: number) => {
    const [detail, comments] = await Promise.all([
      getScoutApprovalDetail(id),
      getRejectionComments(id).catch(() => [])
    ])

    return {
      detail: mapDetail(detail),
      comments: Array.isArray(comments) ? comments : []
    }
  }

  return {
    scouts, currentScout, loading, error,
    fetchScouts, fetchScoutById, updateScout, removeScout, clearError,
    fetchScoutList,
    fetchScoutDetail,
    generateScout,
    deleteScout,
    requestApproval,
    fetchLeaderList,
    fetchAdminList,
    approveScout,
    rejectScout,
    approveByAdmin,
    rejectByAdmin,
    fetchApprovalDetail,
  }
})
