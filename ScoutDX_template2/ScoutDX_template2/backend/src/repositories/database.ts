// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ScoutEntity } from '../types';

// @Injectable()
// export class DatabaseRepository {
//   constructor(
//     @InjectRepository(ScoutEntity)
//     private readonly repository: Repository<ScoutEntity>,
//   ) {}

//   async findAll(): Promise<ScoutEntity[]> {
//     // 直接SQL文を発行する
//     return this.repository.query(
//       'SELECT * FROM scouts ORDER BY created_at DESC'
//     );
//   }

//   async save(scout: ScoutEntity): Promise<ScoutEntity> {
//     // 直接SQL文でINSERTする
//     await this.repository.query(
//       `INSERT INTO scouts (id, creator, title, body, status) VALUES ($1, $2, $3, $4, $5)`,
//       [scout.id, scout.creator, scout.title, scout.body, scout.status]
//     );
//     // 直後のエンティティを返す
//     const rows = await this.repository.query(
//       `SELECT * FROM scouts WHERE id = $1`,
//       [scout.id]
//     );
//     if (rows.length === 0) throw new Error('Scout not found after insert');
//     return rows[0];
//   }

//   async updateStatus(id: string, status: string): Promise<ScoutEntity | null> {
//     const rows = await this.repository.query(
//       `UPDATE scouts SET status = $2 WHERE id = $1 RETURNING *`,
//       [id, status]
//     );
//     if (rows.length === 0) return null;
//     return rows[0];
//   }
// }





// backend/src/repositories/database.ts

import { PoolClient } from 'pg';
import pool from '../config/database';
import {
  User,
  Session,
  UserRoleInfo,
  ScoutDocument,
  DraftDetails,
  ApprovalHistory,
  RejectionComment,
  ScoutStatus,
  UserRole,
  ApprovalAction,
  ScoutListItem,
  ScoutDetailResponse,
  DatabaseResult
} from '../types';

// =====================================
// ユーザー関連のクエリ
// =====================================

/**
 * ユーザー名でユーザー検索
 */
export const findUserByUsername = async (username: string): Promise<User | null> => {
  const query = `
    SELECT id, username, password, created_at, updated_at
    FROM users
    WHERE username = $1
  `;
  
  const result = await pool.query(query, [username]);
  
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * ユーザーIDでユーザー検索
 */
export const findUserById = async (userId: number): Promise<User | null> => {
  const query = `
    SELECT id, username, password, created_at, updated_at
    FROM users
    WHERE id = $1
  `;
  
  const result = await pool.query(query, [userId]);
  
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * ユーザー名の存在確認
 */
export const existsUsername = async (username: string): Promise<boolean> => {
  const query = `
    SELECT EXISTS(SELECT 1 FROM users WHERE username = $1) as exists
  `;
  
  const result = await pool.query(query, [username]);
  
  return result.rows[0].exists;
};

/**
 * ユーザー作成
 */
export const createUser = async (username: string, hashedPassword: string): Promise<number> => {
  const query = `
    INSERT INTO users (username, password, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW())
    RETURNING id
  `;
  
  const result = await pool.query(query, [username, hashedPassword]);
  
  return result.rows[0].id;
};

/**
 * 最終ログイン日時更新
 */
export const updateLastLogin = async (userId: number): Promise<void> => {
  const query = `
    UPDATE users
    SET updated_at = NOW()
    WHERE id = $1
  `;
  
  await pool.query(query, [userId]);
};

// =====================================
// セッション関連のクエリ
// =====================================

/**
 * セッション作成
 */
export const createSession = async (
  userId: number,
  token: string,
  currentRole: UserRole
): Promise<number> => {
  const query = `
    INSERT INTO sessions (user_id, token, current_user_role, created_at, expires_at)
    VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '24 hours')
    RETURNING id
  `;
  
  const result = await pool.query(query, [userId, token, currentRole]);
  
  return result.rows[0].id;
};

/**
 * トークンでセッション検索
 */
export const findSessionByToken = async (token: string): Promise<Session | null> => {
  const query = `
    SELECT id, user_id, token, current_user_role AS current_role, created_at, expires_at
    FROM sessions
    WHERE token = $1 AND expires_at > NOW()
  `;
  
  const result = await pool.query(query, [token]);
  
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * セッション削除（ログアウト）
 */
export const deleteSession = async (userId: number): Promise<void> => {
  const query = `
    DELETE FROM sessions
    WHERE user_id = $1
  `;
  
  await pool.query(query, [userId]);
};

/**
 * セッションのロール更新
 */
export const updateSessionRole = async (userId: number, roleId: number): Promise<void> => {
  const query = `
    UPDATE sessions
    SET current_user_role = (SELECT role FROM user_roles WHERE id = $2)
    WHERE user_id = $1
  `;
  
  await pool.query(query, [userId, roleId]);
};

// =====================================
// ロール関連のクエリ
// =====================================

/**
 * ユーザーのロール一覧取得
 */
export const findUserRoles = async (userId: number): Promise<UserRoleInfo[]> => {
  const query = `
    SELECT id, user_id, role, 
           CASE 
             WHEN role = 'creator' THEN '作成者'
             WHEN role = 'leader' THEN '営業リーダー'
             WHEN role = 'admin' THEN '管理者'
           END as role_name,
           assigned_at
    FROM user_roles
    WHERE user_id = $1
    ORDER BY assigned_at
  `;
  
  const result = await pool.query(query, [userId]);
  
  return result.rows;
};

/**
 * デフォルトロール割当（ユーザー登録時）
 */
export const assignDefaultRole = async (userId: number): Promise<void> => {
  const query = `
    INSERT INTO user_roles (user_id, role, assigned_at)
    VALUES ($1, 'creator', NOW())
  `;
  
  await pool.query(query, [userId]);
};

/**
 * ユーザーにロールを付与
 */
export const assignRole = async (userId: number, role: UserRole): Promise<void> => {
  const query = `
    INSERT INTO user_roles (user_id, role, assigned_at)
    SELECT $1, $2, NOW()
    WHERE NOT EXISTS (
      SELECT 1
      FROM user_roles
      WHERE user_id = $1 AND role = $2
    )
  `;

  await pool.query(query, [userId, role]);
};

/**
 * ロール権限チェック
 */
export const hasRole = async (userId: number, role: UserRole): Promise<boolean> => {
  const query = `
    SELECT EXISTS(
      SELECT 1 FROM user_roles 
      WHERE user_id = $1 AND role = $2
    ) as has_role
  `;
  
  const result = await pool.query(query, [userId, role]);
  
  return result.rows[0].has_role;
};

// =====================================
// スカウト文関連のクエリ
// =====================================

/**
 * スカウト文一覧取得（作成者用）
 */
export const findScoutsByCreator = async (
  creatorId: number,
  filters?: {
    status?: ScoutStatus;
    company?: string;
    position?: string;
  }
): Promise<ScoutListItem[]> => {
  let query = `
    SELECT 
      sd.id,
      sd.title,
      dd.company_name,
      COALESCE(NULLIF(dd.position, ''), NULLIF(ag.position, '')) as position,
      ag.age_range,
      ag.gender,
      ag.prompt as ai_prompt,
      COALESCE(
        ag.seeker_name,
        CASE
          WHEN ag.prompt IS NOT NULL AND btrim(ag.prompt) LIKE '{%'
          THEN COALESCE(
            ag.prompt::jsonb -> 'aiRequest' ->> 'seeker_name',
            ag.prompt::jsonb -> 'aiRequest' ->> 'seekerName',
            ag.prompt::jsonb ->> 'seeker_name',
            ag.prompt::jsonb ->> 'seekerName'
          )
          ELSE NULL
        END
      ) as seeker_name,
      sd.status,
      CASE 
        WHEN sd.status = 'draft' THEN '編集中'
        WHEN sd.status = 'pending_leader' THEN '営業承認待ち'
        WHEN sd.status = 'pending_admin' THEN '管理者承認待ち'
        WHEN sd.status = 'rejected' THEN '差戻し'
        WHEN sd.status = 'approved' THEN '承認済み'
      END as status_label,
      sd.is_ai_generated,
      sd.created_at,
      sd.updated_at,
      u.username as creator_name
    FROM scout_documents sd
    LEFT JOIN draft_details dd ON sd.id = dd.document_id
    LEFT JOIN ai_generation_logs ag ON sd.id = ag.document_id
    LEFT JOIN users u ON sd.creator_id = u.id
    WHERE sd.creator_id = $1
  `;
  
  const params: any[] = [creatorId];
  let paramIndex = 2;
  
  // フィルタ条件追加
  if (filters?.status) {
    query += ` AND sd.status = $${paramIndex}`;
    params.push(filters.status);
    paramIndex++;
  }
  
  if (filters?.company) {
    query += ` AND dd.company_name ILIKE $${paramIndex}`;
    params.push(`%${filters.company}%`);
    paramIndex++;
  }
  
  if (filters?.position) {
    query += ` AND dd.position ILIKE $${paramIndex}`;
    params.push(`%${filters.position}%`);
    paramIndex++;
  }
  
  query += ` ORDER BY sd.updated_at DESC`;
  
  const result = await pool.query(query, params);
  
  return result.rows;
};

/**
 * IDでスカウト文検索
 */
export const findScoutById = async (id: number): Promise<ScoutDocument | null> => {
  const query = `
    SELECT id, title, content, creator_id, status, is_ai_generated,
           created_at, updated_at, submitted_at, approved_at
    FROM scout_documents
    WHERE id = $1
  `;
  
  const result = await pool.query(query, [id]);
  
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * スカウト文詳細取得（ドラフト情報含む）
 */
export const findScoutDetailById = async (id: number): Promise<ScoutDetailResponse | null> => {
  const scoutQuery = `
    SELECT sd.*, u.username as creator_name
    FROM scout_documents sd
    LEFT JOIN users u ON sd.creator_id = u.id
    WHERE sd.id = $1
  `;
  
  const draftQuery = `
    SELECT * FROM draft_details WHERE document_id = $1
  `;
  
  const aiQuery = `
    SELECT
      *,
      COALESCE(
        seeker_name,
        CASE
          WHEN prompt IS NOT NULL AND btrim(prompt) LIKE '{%'
          THEN COALESCE(
            prompt::jsonb -> 'aiRequest' ->> 'seeker_name',
            prompt::jsonb -> 'aiRequest' ->> 'seekerName',
            prompt::jsonb ->> 'seeker_name',
            prompt::jsonb ->> 'seekerName'
          )
          ELSE NULL
        END
      ) as seeker_name
    FROM ai_generation_logs
    WHERE document_id = $1
  `;
  
  const scoutResult = await pool.query(scoutQuery, [id]);
  
  if (scoutResult.rows.length === 0) {
    return null;
  }
  
  const scout = scoutResult.rows[0];
  const draftResult = await pool.query(draftQuery, [id]);
  const aiResult = await pool.query(aiQuery, [id]);
  
  return {
    scout: scout,
    draft: draftResult.rows.length > 0 ? draftResult.rows[0] : null,
    aiInfo: aiResult.rows.length > 0 ? aiResult.rows[0] : null,
    creator: {
      id: scout.creator_id,
      username: scout.creator_name
    }
  };
};

/**
 * スカウト文作成（AI生成）
 */
export const createScoutWithTransaction = async (
  creatorId: number,
  title: string,
  content: string,
  draftData: Partial<DraftDetails>,
  aiRequest: any
): Promise<number> => {
  const client: PoolClient = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 1. スカウト文書保存
    const scoutQuery = `
      INSERT INTO scout_documents 
      (title, content, creator_id, status, is_ai_generated, created_at, updated_at)
      VALUES ($1, $2, $3, 'draft', true, NOW(), NOW())
      RETURNING id
    `;
    
    const scoutResult = await client.query(scoutQuery, [title, content, creatorId]);
    const documentId = scoutResult.rows[0].id;
    
    // 2. ドラフト詳細保存
    const draftQuery = `
      INSERT INTO draft_details 
      (document_id, company_name, position, business_description, 
       required_skills, work_location, salary, job_appeal, sender_appeal, 
       created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
    `;
    
    await client.query(draftQuery, [
      documentId,
      draftData.company_name,
      draftData.position,
      draftData.business_description,
      draftData.required_skills,
      draftData.work_location,
      draftData.salary,
      draftData.job_appeal,
      draftData.sender_appeal
    ]);
    
    // 3. AI生成ログ保存
    const aiQuery = `
      INSERT INTO ai_generation_logs 
      (document_id, seeker_name, age_range, gender, salary, position, ng_words, 
       prompt, response, generated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
    `;
    
    await client.query(aiQuery, [
      documentId,
      aiRequest.seeker_name || aiRequest.seekerName || null,
      aiRequest.age_range,
      aiRequest.gender,
      aiRequest.salary,
      aiRequest.position,
      aiRequest.ng_words,
      aiRequest.prompt,
      content
    ]);
    
    await client.query('COMMIT');
    
    return documentId;
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * スカウト文更新
 */
export const updateScout = async (
  id: number,
  content: string,
  draftData?: Partial<DraftDetails>
): Promise<DatabaseResult> => {
  const client: PoolClient = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // スカウト文更新
    const scoutQuery = `
      UPDATE scout_documents
      SET content = $1, updated_at = NOW()
      WHERE id = $2
    `;
    
    await client.query(scoutQuery, [content, id]);
    
    // ドラフト情報更新（存在する場合）
    if (draftData) {
      const draftQuery = `
        UPDATE draft_details
        SET company_name = COALESCE($1, company_name),
            position = COALESCE($2, position),
            business_description = COALESCE($3, business_description),
            salary = COALESCE($4, salary),
            job_appeal = COALESCE($5, job_appeal),
            sender_appeal = COALESCE($6, sender_appeal),
            updated_at = NOW()
        WHERE document_id = $7
      `;
      
      await client.query(draftQuery, [
        draftData.company_name,
        draftData.position,
        draftData.business_description,
        draftData.salary,
        draftData.job_appeal,
        draftData.sender_appeal,
        id
      ]);
    }
    
    await client.query('COMMIT');
    
    return { success: true };
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * スカウト文削除
 */
export const deleteScout = async (id: number): Promise<DatabaseResult> => {
  const query = `
    DELETE FROM scout_documents
    WHERE id = $1
  `;
  
  const result = await pool.query(query, [id]);
  
  return {
    success: result.rowCount! > 0,
    affectedRows: result.rowCount!
  };
};

/**
 * ステータス更新
 */
export const updateScoutStatus = async (
  id: number,
  status: ScoutStatus
): Promise<DatabaseResult> => {
  const shouldSetSubmittedAt = status === 'pending_leader';
  const shouldSetApprovedAt = status === 'approved';

  const query = `
    UPDATE scout_documents
    SET status = $1,
        updated_at = NOW(),
        submitted_at = CASE WHEN $3 THEN NOW() ELSE submitted_at END,
        approved_at = CASE WHEN $4 THEN NOW() ELSE approved_at END
    WHERE id = $2
  `;

  let result;
  try {
    result = await pool.query(query, [status, id, shouldSetSubmittedAt, shouldSetApprovedAt]);
  } catch (error: any) {
    // 旧スキーマ互換: submitted_at / approved_at 列がない場合
    if (error?.code === '42703') {
      const fallbackQuery = `
        UPDATE scout_documents
        SET status = $1,
            updated_at = NOW()
        WHERE id = $2
      `;
      try {
        result = await pool.query(fallbackQuery, [status, id]);
      } catch (fallbackError: any) {
        // さらに旧スキーマ互換: updated_at 列もない場合
        if (fallbackError?.code === '42703') {
          const minimalQuery = `
            UPDATE scout_documents
            SET status = $1
            WHERE id = $2
          `;
          result = await pool.query(minimalQuery, [status, id]);
        } else {
          throw fallbackError;
        }
      }
    } else {
      throw error;
    }
  }
  
  return {
    success: result.rowCount! > 0,
    affectedRows: result.rowCount!
  };
};

// =====================================
// 承認関連のクエリ
// =====================================

/**
 * ステータス別スカウト文取得
 */
export const findScoutsByStatus = async (status: ScoutStatus): Promise<ScoutListItem[]> => {
  const query = `
    SELECT 
      sd.id,
      sd.title,
      dd.company_name,
      COALESCE(NULLIF(dd.position, ''), NULLIF(ag.position, '')) as position,
      ag.age_range,
      ag.gender,
      ag.prompt as ai_prompt,
      COALESCE(
        ag.seeker_name,
        CASE
          WHEN ag.prompt IS NOT NULL AND btrim(ag.prompt) LIKE '{%'
          THEN COALESCE(
            ag.prompt::jsonb -> 'aiRequest' ->> 'seeker_name',
            ag.prompt::jsonb -> 'aiRequest' ->> 'seekerName',
            ag.prompt::jsonb ->> 'seeker_name',
            ag.prompt::jsonb ->> 'seekerName'
          )
          ELSE NULL
        END
      ) as seeker_name,
      sd.status,
      CASE 
        WHEN sd.status = 'draft' THEN '編集中'
        WHEN sd.status = 'pending_leader' THEN '営業承認待ち'
        WHEN sd.status = 'pending_admin' THEN '管理者承認待ち'
        WHEN sd.status = 'rejected' THEN '差戻し'
        WHEN sd.status = 'approved' THEN '承認済み'
      END as status_label,
      sd.is_ai_generated,
      sd.created_at,
      sd.updated_at,
      sd.submitted_at,
      u.username as creator_name
    FROM scout_documents sd
    LEFT JOIN draft_details dd ON sd.id = dd.document_id
    LEFT JOIN ai_generation_logs ag ON sd.id = ag.document_id
    LEFT JOIN users u ON sd.creator_id = u.id
    WHERE sd.status = $1
    ORDER BY sd.submitted_at DESC
  `;
  
  const result = await pool.query(query, [status]);
  
  return result.rows;
};

/**
 * 承認履歴作成
 */
export const createApprovalHistory = async (
  documentId: number,
  userId: number,
  action: ApprovalAction,
  comment?: string
): Promise<void> => {
  const actionCandidates: string[] = [action];
  if (action === 'SUBMITTED') {
    actionCandidates.push('SUBMIT');
  }

  const queryPatterns = [
    {
      query: `
        INSERT INTO approval_history 
        (document_id, user_id, action, comment, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `,
      paramsBuilder: (candidateAction: string) => [documentId, userId, candidateAction, comment]
    },
    {
      query: `
        INSERT INTO approval_history 
        (document_id, user_id, action, created_at)
        VALUES ($1, $2, $3, NOW())
      `,
      paramsBuilder: (candidateAction: string) => [documentId, userId, candidateAction]
    },
    {
      query: `
        INSERT INTO approval_history 
        (scout_id, user_id, action, comment, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `,
      paramsBuilder: (candidateAction: string) => [documentId, userId, candidateAction, comment]
    },
    {
      query: `
        INSERT INTO approval_history 
        (scout_id, user_id, action, created_at)
        VALUES ($1, $2, $3, NOW())
      `,
      paramsBuilder: (candidateAction: string) => [documentId, userId, candidateAction]
    }
  ];

  let lastError: any;
  for (const candidateAction of actionCandidates) {
    for (const pattern of queryPatterns) {
      try {
        await pool.query(pattern.query, pattern.paramsBuilder(candidateAction));
        return;
      } catch (error: any) {
        lastError = error;
      }
    }
  }

  throw lastError;
};

/**
 * 承認履歴取得
 */
export const findApprovalHistory = async (documentId: number): Promise<ApprovalHistory[]> => {
  const query = `
    SELECT 
      ah.id,
      ah.document_id,
      ah.user_id,
      u.username as user_name,
      s.current_user_role as user_role,
      ah.action,
      ah.comment,
      ah.created_at
    FROM approval_history ah
    LEFT JOIN users u ON ah.user_id = u.id
    LEFT JOIN sessions s ON ah.user_id = s.user_id
    WHERE ah.document_id = $1
    ORDER BY ah.created_at ASC
  `;
  
  const result = await pool.query(query, [documentId]);
  
  return result.rows;
};

/**
 * 差戻しコメント作成
 */
export const createRejectionComment = async (
  documentId: number,
  userId: number,
  commentText: string
): Promise<void> => {
  const query = `
    INSERT INTO rejection_comments 
    (document_id, user_id, comment_text, created_at)
    VALUES ($1, $2, $3, NOW())
  `;
  
  await pool.query(query, [documentId, userId, commentText]);
};

/**
 * 差戻しコメント取得
 */
export const findRejectionComments = async (documentId: number): Promise<RejectionComment[]> => {
  const query = `
    SELECT 
      rc.id,
      rc.document_id,
      rc.user_id,
      u.username as user_name,
      s.current_user_role as user_role,
      rc.comment_text,
      rc.created_at
    FROM rejection_comments rc
    LEFT JOIN users u ON rc.user_id = u.id
    LEFT JOIN sessions s ON rc.user_id = s.user_id
    WHERE rc.document_id = $1
    ORDER BY rc.created_at DESC
  `;
  
  const result = await pool.query(query, [documentId]);
  
  return result.rows;
};

/**
 * 承認統計情報取得
 */
export const getApprovalStatistics = async (_userId: number, role: UserRole) => {
  const statusCondition = role === 'leader' ? 'pending_leader' : 'pending_admin';
  
  const query = `
    SELECT 
      COUNT(CASE WHEN status = $1 THEN 1 END) as pending_count,
      COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
      COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count,
      COUNT(*) as total_count
    FROM scout_documents
    WHERE status IN ($1, 'approved', 'rejected')
  `;
  
  const result = await pool.query(query, [statusCondition]);
  const stats = result.rows[0];
  
  return {
    pending_count: parseInt(stats.pending_count),
    approved_count: parseInt(stats.approved_count),
    rejected_count: parseInt(stats.rejected_count),
    total_count: parseInt(stats.total_count),
    approval_rate: stats.total_count > 0 
      ? (stats.approved_count / stats.total_count) * 100 
      : 0
  };
};

// =====================================
// トランザクション用ヘルパー
// =====================================

/**
 * トランザクション実行ヘルパー
 */
export const executeTransaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// =====================================
// エクスポート
// =====================================

export default {
  // ユーザー
  findUserByUsername,
  findUserById,
  existsUsername,
  createUser,
  updateLastLogin,
  
  // セッション
  createSession,
  findSessionByToken,
  deleteSession,
  updateSessionRole,
  
  // ロール
  findUserRoles,
  assignDefaultRole,
  assignRole,
  hasRole,
  
  // スカウト文
  findScoutsByCreator,
  findScoutById,
  findScoutDetailById,
  createScoutWithTransaction,
  updateScout,
  deleteScout,
  updateScoutStatus,
  
  // 承認
  findScoutsByStatus,
  createApprovalHistory,
  findApprovalHistory,
  createRejectionComment,
  findRejectionComments,
  getApprovalStatistics,
  
  // トランザクション
  executeTransaction
};