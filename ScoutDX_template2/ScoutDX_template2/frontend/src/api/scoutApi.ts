import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserRole,
  UserRoleInfo,
  RoleSelectResponse,
  ScoutMessage,
  CreateScoutRequest,
  UpdateScoutRequest,
  DraftData,
  AIGenerationRequest,
  AIGenerationResponse,
  ApproveResponse,
  RejectResponse,
  RejectionComment,
} from '../types'

// 環境変数からAPIのベースURLを取得
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

/**
 * APIエラーハンドリング
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTPエラー: ${response.status}`,
    }))
    throw new Error(error.message || 'APIエラーが発生しました')
  }
  return response.json()
}

// ============================================
// 認証API
// ============================================

/**
 * ログイン
 * POST /api/auth/login
 */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse<LoginResponse>(response)
}

/**
 * ユーザー登録
 * POST /api/auth/register
 */
export async function register(payload: RegisterRequest): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

/**
 * ユーザーのロール一覧取得
 * GET /api/roles/user
 */
export async function getUserRoles(): Promise<UserRoleInfo[]> {
  const response = await fetch(`${API_BASE_URL}/api/roles/user`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return handleResponse<UserRoleInfo[]>(response)
}

/**
 * 役割選択
 * POST /api/roles/select
 */
export async function selectRole(role: UserRole): Promise<RoleSelectResponse> {
  const response = await fetch(`${API_BASE_URL}/api/roles/select`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ role }),
  })
  return handleResponse<RoleSelectResponse>(response)
}

/**
 * ログアウト
 * POST /api/auth/logout
 */
export async function logout(): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return handleResponse(response)
}

// ============================================
// スカウト文API（作成者用）
// ============================================

/**
 * スカウト文一覧取得
 * GET /api/scout-documents
 */
export async function getScoutDocuments(): Promise<ScoutMessage[]> {
  const response = await fetch(`${API_BASE_URL}/api/scout-documents`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return handleResponse<ScoutMessage[]>(response)
}

/**
 * スカウト文詳細取得
 * GET /scout/:id
 */
export async function getScoutDetail(id: number): Promise<ScoutMessage> {
  const response = await fetch(`${API_BASE_URL}/scout/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return handleResponse<ScoutMessage>(response)
}

/**
 * ドラフト詳細取得
 * GET /scout/draft/:id
 */
export async function getDraftDetail(id: number): Promise<ScoutMessage> {
  const response = await fetch(`${API_BASE_URL}/scout/draft/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return handleResponse<ScoutMessage>(response)
}

/**
 * スカウト文作成（下書き保存）
 * PUT /scout/draft/:id
 */
export async function saveDraft(
  id: number,
  data: UpdateScoutRequest
): Promise<ScoutMessage> {
  const response = await fetch(`${API_BASE_URL}/scout/draft/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  })
  return handleResponse<ScoutMessage>(response)
}

/**
 * スカウト文保存（詳細画面）
 * PUT /scout/:id
 */
export async function saveScout(
  id: number,
  data: UpdateScoutRequest
): Promise<ScoutMessage> {
  const response = await fetch(`${API_BASE_URL}/scout/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  })
  return handleResponse<ScoutMessage>(response)
}

/**
 * スカウト文承認申請（ドラフトから）
 * POST /scout/:id/submit-for-approval
 */
export async function submitForApproval(id: number): Promise<ApproveResponse> {
  const response = await fetch(`${API_BASE_URL}/scout/${id}/submit-for-approval`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return handleResponse<ApproveResponse>(response)
}

/**
 * スカウト文申請（詳細画面から）
 * POST /scout/:id/request-approval
 */
export async function requestApproval(id: number): Promise<ApproveResponse> {
  const response = await fetch(`${API_BASE_URL}/scout/${id}/request-approval`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return handleResponse<ApproveResponse>(response)
}

/**
 * スカウト文提出
 * POST /scout/submit
 */
export async function submitScout(data: CreateScoutRequest): Promise<ScoutMessage> {
  const response = await fetch(`${API_BASE_URL}/scout/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  })
  return handleResponse<ScoutMessage>(response)
}

/**
 * スカウト文削除
 * DELETE /scout/:id
 */
export async function deleteScout(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/scout/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
  await handleResponse(response)
}

// ============================================
// AI生成API
// ============================================

/**
 * AI生成（完全版）
 * POST /api/scout-documents/generate-full
 */
export async function generateScoutFull(
  draftData: DraftData,
  aiRequest: AIGenerationRequest
): Promise<AIGenerationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/scout-documents/generate-full`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ draftData, aiRequest }),
  })
  return handleResponse<AIGenerationResponse>(response)
}

// ============================================
// 承認API（リーダー・管理者共通）
// ============================================

/**
 * 承認待ちスカウト文一覧取得
 * GET /scout/pending
 */
export async function getPendingScouts(): Promise<ScoutMessage[]> {
  const response = await fetch(`${API_BASE_URL}/scout/pending`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return handleResponse<ScoutMessage[]>(response)
}

/**
 * 承認済みスカウト文一覧取得
 * GET /scout/approved
 */
export async function getApprovedScouts(): Promise<ScoutMessage[]> {
  const response = await fetch(`${API_BASE_URL}/scout/approved`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return handleResponse<ScoutMessage[]>(response)
}

/**
 * 承認（リーダー・管理者共通）
 * POST /scout/:id/approve
 */
export async function approveScout(id: number): Promise<ApproveResponse> {
  const response = await fetch(`${API_BASE_URL}/scout/${id}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return handleResponse<ApproveResponse>(response)
}

/**
 * 差戻し（リーダー・管理者共通）
 * POST /scout/:id/reject
 */
export async function rejectScout(
  id: number,
  commentText: string
): Promise<RejectResponse> {
  const response = await fetch(`${API_BASE_URL}/scout/${id}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ comment_text: commentText }),
  })
  return handleResponse<RejectResponse>(response)
}

// ============================================
// 差戻しコメントAPI
// ============================================

/**
 * 差戻しコメント履歴取得（全件）
 * GET /scout/:id/comments
 */
export async function getRejectionComments(scoutId: number): Promise<RejectionComment[]> {
  const response = await fetch(`${API_BASE_URL}/scout/${scoutId}/comments`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
  return handleResponse<RejectionComment[]>(response)
}