// ============================================
// 認証関連
// ============================================

/**
 * ログインリクエスト
 */
export interface LoginRequest {
  userId: string
  password: string
}

/**
 * ログインレスポンス
 */
export interface LoginResponse {
  token: string
  userId: string
  user: User
}

/**
 * ユーザー登録リクエスト
 */
export interface RegisterRequest {
  employeeId: string
  name: string
  password: string
}

/**
 * ユーザー役割
 */
export type UserRole = 'creator' | 'leader' | 'admin'

/**
 * 役割選択リクエスト
 */
export interface RoleSelectRequest {
  role: UserRole
}

/**
 * 役割選択レスポンス
 */
export interface RoleSelectResponse {
  success: boolean
  role: UserRole
}

// ============================================
// ユーザー
// ============================================

/**
 * ユーザー
 */
export interface User {
  user_id: number
  name: string
  role: string  // "creator,leader,admin" のようなカンマ区切り
  employee_id: string
  last_login?: string
}

/**
 * ユーザーロール情報
 */
export interface UserRoleInfo {
  roleId: string
  roleName: string
  description: string
}

// ============================================
// スカウト文
// ============================================

/**
 * スカウト文のステータス
 */
export type ScoutStatus = 
  | 'draft'      // 下書き（編集中）
  | 'pending'    // 承認待ち（リーダー・管理者共通）
  | 'approved'   // 承認済み
  | 'rejected'   // 差戻し

/**
 * スカウト文
 */
export interface ScoutMessage {
  scout_id: number
  title: string
  content: string
  status: ScoutStatus
  applicant_name?: string  // 求職者名
  company_name?: string    // 会社名
  created_at: string
  created_by: number
  creator_name?: string
  ai_condition?: string | null
  job_info?: string | null
  submitted_at?: string    // 申請日時
  approved_at?: string     // 承認日時
  is_ai_generated?: boolean
}

/**
 * スカウト文作成リクエスト
 */
export interface CreateScoutRequest {
  title: string
  content: string
  ai_condition?: string
  job_info?: string
}

/**
 * スカウト文更新リクエスト
 */
export interface UpdateScoutRequest {
  title?: string
  content?: string
  status?: ScoutStatus
  ai_condition?: string
  job_info?: string
}

// ============================================
// AI生成関連
// ============================================

/**
 * ドラフトデータ（左側フォーム）
 */
export interface DraftData {
  companyName: string
  position: string
  businessDescription: string
  salary: string
  jobAppeal: string
  senderAppeal: string
}

/**
 * AI生成リクエスト（右側フォーム）
 */
export interface AIGenerationRequest {
  ageRange: string
  gender: string
  ngWords: string
}

/**
 * AI生成レスポンス
 */
export interface AIGenerationResponse {
  documentId: string
  content: string
  metadata: {
    draftDetails: DraftData
    aiInfo: AIGenerationRequest
    generatedAt: string
  }
}

/**
 * ドラフト詳細（データベース）
 */
export interface DraftDetails {
  id: string
  document_id: string
  company_name: string
  position: string
  business_description: string
  salary: string
  job_appeal: string
  sender_appeal: string
  created_at: string
}

/**
 * AI生成ログ（データベース）
 */
export interface AIGenerationLog {
  id: string
  document_id: string
  age_range: string
  gender: string
  salary: string
  position: string
  ng_words: string
  prompt: string
  response: string
  generated_at: string
}

// ============================================
// 承認
// ============================================

/**
 * 承認
 */
export interface Approval {
  approval_id: number
  scout_id: number
  user_id: number
  approved_at: string
  approver_name?: string
}

/**
 * 承認リクエスト
 */
export interface ApproveRequest {
  scout_id: number
}

/**
 * 承認レスポンス
 */
export interface ApproveResponse {
  success: boolean
  message: string
  scout: ScoutMessage
}

// ============================================
// 差戻しコメント
// ============================================

/**
 * 差戻しコメント
 */
export interface RejectionComment {
  comment_id: number
  scout_id: number
  user_id: number
  comment_text: string
  created_at: string
  reviewer_name?: string
}

/**
 * 差戻しリクエスト
 */
export interface RejectRequest {
  scout_id: number
  comment_text: string
}

/**
 * 差戻しレスポンス
 */
export interface RejectResponse {
  success: boolean
  message: string
  scout: ScoutMessage
}

// ============================================
// API レスポンス（共通）
// ============================================

/**
 * エラーレスポンス
 */
export interface ErrorResponse {
  message: string
  error?: string
  statusCode?: number
}

/**
 * 成功レスポンス
 */
export interface SuccessResponse {
  success: boolean
  message: string
}