const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

async function handleResponse<T = any>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: `HTTPエラー: ${response.status}` }))
    throw new Error(error.message || 'APIエラーが発生しました')
  }
  return response.json()
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function login(payload: { username: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<{ success: boolean; data: any }>(response)
}

export async function register(payload: { username: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export async function getUserRoles() {
  const response = await fetch(`${API_BASE_URL}/api/auth/roles`, {
    headers: getAuthHeaders(),
  })
  const result = await handleResponse<{ success: boolean; data: { roles: any[] } }>(response)
  return result.data.roles
}

export async function selectRole(roleId: number) {
  const response = await fetch(`${API_BASE_URL}/api/auth/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ roleId }),
  })
  return handleResponse(response)
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  return handleResponse(response)
}

export async function getScoutDocuments() {
  const response = await fetch(`${API_BASE_URL}/api/scouts`, {
    headers: getAuthHeaders(),
  })
  const result = await handleResponse<{ success: boolean; data: { scouts: any[] } }>(response)
  return result.data.scouts
}

export async function getScoutDetail(id: number) {
  const response = await fetch(`${API_BASE_URL}/api/scouts/${id}`, {
    headers: getAuthHeaders(),
  })
  const result = await handleResponse<{ success: boolean; data: any }>(response)
  return result.data
}

export async function saveDraft(data: { content: string; draftData: any }) {
  const response = await fetch(`${API_BASE_URL}/api/scouts/draft`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })
  return handleResponse(response)
}

export async function saveScout(id: number, data: { content: string; draftData?: any }) {
  const response = await fetch(`${API_BASE_URL}/api/scouts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })
  return handleResponse(response)
}

export async function submitForApproval(id: number) {
  const response = await fetch(`${API_BASE_URL}/api/scouts/${id}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  })
  return handleResponse(response)
}

export async function deleteScout(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/scouts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  await handleResponse<void>(response)
}

export async function generateScoutFull(draftData: any, aiRequest: any) {
  const response = await fetch(`${API_BASE_URL}/api/scouts/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ draftData, aiRequest }),
  })
  return handleResponse(response)
}

export async function getPendingScoutsForLeader() {
  const response = await fetch(`${API_BASE_URL}/api/approvals/pending-leader`, {
    headers: getAuthHeaders(),
  })
  const result = await handleResponse<{ success: boolean; data: { scouts: any[] } }>(response)
  return result.data.scouts
}

export async function getPendingScoutsForAdmin() {
  const response = await fetch(`${API_BASE_URL}/api/approvals/pending-admin`, {
    headers: getAuthHeaders(),
  })
  const result = await handleResponse<{ success: boolean; data: { scouts: any[] } }>(response)
  return result.data.scouts
}

export async function getApprovedScouts() {
  const response = await fetch(`${API_BASE_URL}/api/approvals/approved`, {
    headers: getAuthHeaders(),
  })
  const result = await handleResponse<{ success: boolean; data: { scouts: any[] } }>(response)
  return result.data.scouts
}

export async function approveScoutByLeader(id: number, comment?: string) {
  const response = await fetch(`${API_BASE_URL}/api/approvals/${id}/approve-leader`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ comment }),
  })
  return handleResponse(response)
}

export async function approveScoutByAdmin(id: number, comment?: string) {
  const response = await fetch(`${API_BASE_URL}/api/approvals/${id}/approve-admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ comment }),
  })
  return handleResponse(response)
}

export async function rejectScout(id: number, comment: string) {
  const response = await fetch(`${API_BASE_URL}/api/approvals/${id}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ comment }),
  })
  return handleResponse(response)
}

export async function getScoutApprovalDetail(id: number) {
  const response = await fetch(`${API_BASE_URL}/api/approvals/${id}/detail`, {
    headers: getAuthHeaders(),
  })
  const result = await handleResponse<{ success: boolean; data: any }>(response)
  return result.data
}

export async function getRejectionComments(id: number) {
  const response = await fetch(`${API_BASE_URL}/api/approvals/${id}/comments`, {
    headers: getAuthHeaders(),
  })
  const result = await handleResponse<{ success: boolean; data: { comments: any[] } }>(response)
  return result.data.comments
}