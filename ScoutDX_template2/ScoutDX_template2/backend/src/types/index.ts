// ===============================================
// 型定義
// ===============================================

export interface User {
  id: number;
  username: string;
  password_hash: string;
  full_name: string;
  email?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Role {
  id: number;
  user_id: number;
  role_name: 'CREATOR' | 'LEADER' | 'ADMIN';
  created_at: Date;
}

export interface Session {
  id: number;
  user_id: number;
  session_token: string;
  current_role?: string;
  expires_at: Date;
  created_at: Date;
}

export interface ScoutDocument {
  id: number;
  creator_id: number;
  applicant_name: string;
  applicant_age?: number;
  applicant_gender?: string;
  company_name: string;
  job_title: string;
  job_description?: string;
  required_skills?: string;
  location?: string;
  salary?: string;
  job_appeal?: string;
  ng_words?: string;
  scout_text?: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  submitted_at?: Date;
  approved_at?: Date;
  approved_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Comment {
  id: number;
  scout_document_id: number;
  commenter_id: number;
  comment_text: string;
  created_at: Date;
}

// DTO (Data Transfer Objects)
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  session_token?: string;
  user?: {
    id: number;
    username: string;
    full_name: string;
  };
  message?: string;
}

export interface RoleSelectRequest {
  role_name: string;
}

export interface CreateScoutRequest {
  applicant_name: string;
  applicant_age?: number;
  applicant_gender?: string;
  company_name: string;
  job_title: string;
  job_description?: string;
  required_skills?: string;
  location?: string;
  salary?: string;
  job_appeal?: string;
  ng_words?: string;
}

export interface UpdateScoutRequest {
  scout_text?: string;
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ApprovalRequest {
  comment?: string;
}

// Express Request 拡張
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      currentRole?: string;
    }
  }
}