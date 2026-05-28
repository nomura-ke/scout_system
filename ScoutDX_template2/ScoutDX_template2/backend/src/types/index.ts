// import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

// export type UserRole = 'SCOUT_USER' | 'SALES_LEADER';

// export interface LoginRequest {
//   userId: string;
//   password: string;
// }

// export interface LoginResponse {
//   token: string;
//   userId: string;
// }

// export interface RoleSelectRequest {
//   role: UserRole;
// }

// @Entity('scouts')
// export class ScoutEntity {
//   @PrimaryColumn({ name: 'id' })
//   id?: string;

//   @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
//   createdAt?: Date;

//   @Column({ name: 'creator', type: 'varchar', length: 100 })
//   creator: string;

//   @Column({ name: 'title', type: 'varchar', length: 255 })
//   title: string;

//   @Column({ name: 'body', type: 'text' })
//   body: string;

//   @Column({ name: 'status', type: 'varchar', length: 20, default: 'DRAFT' })
//   status: string;
// }





// backend/src/types/index.ts

// =====================================
// ユーザー関連の型定義
// =====================================

/**
 * ユーザーロール型
 */
export type UserRole = 'creator' | 'leader' | 'admin';

/**
 * ユーザーエンティティ
 */
export interface User {
  id: number;
  username: string;
  password: string; // ハッシュ化済み
  created_at: Date;
  updated_at: Date;
}

/**
 * セッション情報
 */
export interface Session {
  id: number;
  user_id: number;
  token: string;
  current_role: UserRole;
  created_at: Date;
  expires_at: Date;
}

/**
 * ユーザーロール情報
 */
export interface UserRoleInfo {
  id: number;
  user_id: number;
  role: UserRole;
  role_name: string; // '作成者', '営業リーダー', '管理者'
  assigned_at: Date;
}

/**
 * 認証レスポンス
 */
export interface AuthResponse {
  success: boolean;
  userId?: number;
  username?: string;
  token?: string;
  roles?: UserRoleInfo[];
  message?: string;
}

// =====================================
// スカウト文関連の型定義
// =====================================

/**
 * スカウト文ステータス型
 */
export type ScoutStatus = 
  | 'draft'           // 編集中
  | 'pending_leader'  // 営業リーダー承認待ち
  | 'pending_admin'   // 管理者承認待ち
  | 'rejected'        // 差戻し
  | 'approved';       // 承認済み

/**
 * スカウト文エンティティ
 */
export interface ScoutDocument {
  id: number;
  title: string;
  content: string;
  creator_id: number;
  status: ScoutStatus;
  is_ai_generated: boolean;
  created_at: Date;
  updated_at: Date;
  submitted_at?: Date;
  approved_at?: Date;
}

/**
 * 求人ドラフト詳細
 */
export interface DraftDetails {
  id: number;
  document_id: number;
  company_name: string;
  position: string;
  business_description: string;
  required_skills?: string;
  work_location?: string;
  salary: string;
  job_appeal: string;
  sender_appeal: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * AI生成条件
 */
export interface AIGenerationRequest {
  age_range: string;        // '20代', '30代', '40代', '50代'
  gender: string;           // '男性', '女性', '指定なし'
  position: string;         // 職種（ドラフトから自動コピー）
  salary: string;           // 給与（ドラフトから自動コピー）
  ng_words?: string;        // NGワード（カンマ区切り）
}

/**
 * AI生成ログ
 */
export interface AIGenerationLog {
  id: number;
  document_id: number;
  age_range: string;
  gender: string;
  salary: string;
  position: string;
  ng_words?: string;
  prompt: string;           // AIに送信したプロンプト
  response: string;         // AIからのレスポンス
  generated_at: Date;
}

/**
 * スカウト文詳細（結合データ）
 */
export interface ScoutDetailResponse {
  scout: ScoutDocument;
  draft: DraftDetails | null;
  aiInfo: AIGenerationLog | null;
  creator: {
    id: number;
    username: string;
  };
}

/**
 * スカウト文一覧レスポンス（日本語ステータス付き）
 */
export interface ScoutListItem {
  id: number;
  title: string;
  company_name: string;
  position: string;
  status: ScoutStatus;
  status_label: string;     // '編集中', '営業承認待ち', etc.
  is_ai_generated: boolean;
  created_at: Date;
  updated_at: Date;
  creator_name: string;
}

/**
 * スカウト文作成リクエスト
 */
export interface CreateScoutRequest {
  draftData: {
    company_name: string;
    position: string;
    business_description: string;
    required_skills?: string;
    work_location?: string;
    salary: string;
    job_appeal: string;
    sender_appeal: string;
  };
  aiRequest: AIGenerationRequest;
}

/**
 * スカウト文更新リクエスト
 */
export interface UpdateScoutRequest {
  content: string;
  draftData?: Partial<DraftDetails>;
}

// =====================================
// 承認・差戻し関連の型定義
// =====================================

/**
 * 承認アクション型
 */
export type ApprovalAction = 
  | 'SUBMITTED'       // 承認申請
  | 'APPROVED_LEADER' // 営業リーダー承認
  | 'APPROVED_ADMIN'  // 管理者承認
  | 'REJECTED_LEADER' // 営業リーダー差戻し
  | 'REJECTED_ADMIN'; // 管理者差戻し

/**
 * 承認履歴エンティティ
 */
export interface ApprovalHistory {
  id: number;
  document_id: number;
  user_id: number;
  user_name: string;
  user_role: UserRole;
  action: ApprovalAction;
  comment?: string;
  created_at: Date;
}

/**
 * 差戻しコメントエンティティ
 */
export interface RejectionComment {
  id: number;
  document_id: number;
  user_id: number;
  user_name: string;
  user_role: UserRole;
  comment_text: string;
  created_at: Date;
}

/**
 * 承認リクエスト
 */
export interface ApprovalRequest {
  comment?: string;
}

/**
 * 差戻しリクエスト
 */
export interface RejectionRequest {
  comment: string; // 必須
}

/**
 * 承認統計情報
 */
export interface ApprovalStatistics {
  pending_count: number;      // 承認待ち件数
  approved_count: number;     // 承認済み件数
  rejected_count: number;     // 差戻し件数
  total_count: number;        // 合計件数
  approval_rate: number;      // 承認率（%）
  avg_approval_time?: number; // 平均承認時間（時間）
}

/**
 * 一括承認リクエスト
 */
export interface BulkApprovalRequest {
  scoutIds: number[];
  comment?: string;
}

/**
 * 一括承認レスポンス
 */
export interface BulkApprovalResponse {
  success: boolean;
  successCount: number;
  failedCount: number;
  failedIds: number[];
  message: string;
}

// =====================================
// データベースクエリ結果の型定義
// =====================================

/**
 * データベース操作結果
 */
export interface DatabaseResult {
  success: boolean;
  affectedRows?: number;
  insertId?: number;
  message?: string;
}

/**
 * トランザクション結果
 */
export interface TransactionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// =====================================
// API共通レスポンス型
// =====================================

/**
 * 成功レスポンス
 */
export interface SuccessResponse<T = any> {
  success: true;
  message?: string;
  data?: T;
}

/**
 * エラーレスポンス
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * APIレスポンス（共通型）
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// =====================================
// リクエストの拡張型（Express）
// =====================================

/**
 * 認証済みリクエスト（ミドルウェアで追加されるプロパティ）
 */
export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    username: string;
    currentRole: UserRole;
  };
}

// =====================================
// バリデーション関連
// =====================================

/**
 * バリデーションエラー
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * バリデーション結果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// =====================================
// ページネーション関連
// =====================================

/**
 * ページネーションパラメータ
 */
export interface PaginationParams {
  page: number;      // 現在のページ番号
  limit: number;     // 1ページあたりの件数
  offset: number;    // オフセット
}

/**
 * ページネーションレスポンス
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// =====================================
// フィルタリング・ソート関連
// =====================================

/**
 * スカウト文一覧フィルタ
 */
export interface ScoutListFilter {
  status?: ScoutStatus;
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  isAiGenerated?: boolean;
  creatorId?: number;
}

/**
 * ソート条件
 */
export interface SortParams {
  field: string;     // ソート対象フィールド
  order: 'ASC' | 'DESC';
}

// =====================================
// 通知関連（Phase 2用）
// =====================================

/**
 * 通知タイプ
 */
export type NotificationType = 
  | 'APPROVAL_REQUEST'   // 承認申請通知
  | 'APPROVED'           // 承認完了通知
  | 'REJECTED';          // 差戻し通知

/**
 * 通知エンティティ
 */
export interface Notification {
  id: number;
  user_id: number;
  document_id: number;
  type: NotificationType;
  message: string;
  is_read: boolean;
  created_at: Date;
}

// =====================================
// 環境変数の型定義
// =====================================

/**
 * 環境変数
 */
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  JWT_SECRET: string;
  SESSION_EXPIRY_HOURS: number;
}

// =====================================
// ユーティリティ型
// =====================================

/**
 * 日本語ステータスマッピング
 */
export const STATUS_LABELS: Record<ScoutStatus, string> = {
  draft: '編集中',
  pending_leader: '営業承認待ち',
  pending_admin: '管理者承認待ち',
  rejected: '差戻し',
  approved: '承認済み'
};

/**
 * ロール名マッピング
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  creator: '作成者',
  leader: '営業リーダー',
  admin: '管理者'
};

/**
 * 承認アクション名マッピング
 */
export const ACTION_LABELS: Record<ApprovalAction, string> = {
  SUBMITTED: '承認申請',
  APPROVED_LEADER: '営業承認',
  APPROVED_ADMIN: '管理者承認',
  REJECTED_LEADER: '営業差戻し',
  REJECTED_ADMIN: '管理者差戻し'
};

// =====================================
// 型ガード関数
// =====================================

/**
 * ScoutStatusの型ガード
 */
export function isScoutStatus(value: any): value is ScoutStatus {
  return ['draft', 'pending_leader', 'pending_admin', 'rejected', 'approved'].includes(value);
}

/**
 * UserRoleの型ガード
 */
export function isUserRole(value: any): value is UserRole {
  return ['creator', 'leader', 'admin'].includes(value);
}

/**
 * エラーレスポンスの型ガード
 */
export function isErrorResponse(response: any): response is ErrorResponse {
  return response && response.success === false;
}

// =====================================
// デフォルトエクスポート（まとめて使いやすくする）
// =====================================

export default {
  STATUS_LABELS,
  ROLE_LABELS,
  ACTION_LABELS,
  isScoutStatus,
  isUserRole,
  isErrorResponse
};