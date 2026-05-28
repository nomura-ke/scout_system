import pool from '../config/database';
import { User, Role, Session, ScoutDocument, Comment } from '../types';

export const db = {
  // ==================== Users ====================
  findUserByUsername: async (username: string): Promise<User | null> => {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  },

  findUserById: async (userId: number): Promise<User | null> => {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  createUser: async (
    username: string,
    passwordHash: string,
    fullName: string,
    email?: string
  ): Promise<User> => {
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, full_name, email) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, passwordHash, fullName, email]
    );
    return result.rows[0];
  },

  // ==================== Roles ====================
  findRolesByUserId: async (userId: number): Promise<Role[]> => {
    const result = await pool.query(
      'SELECT * FROM roles WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  },

  createRole: async (userId: number, roleName: string): Promise<Role> => {
    const result = await pool.query(
      'INSERT INTO roles (user_id, role_name) VALUES ($1, $2) RETURNING *',
      [userId, roleName]
    );
    return result.rows[0];
  },

  // ==================== Sessions ====================
  createSession: async (
    userId: number,
    sessionToken: string,
    currentRole: string,
    expiresAt: Date
  ): Promise<Session> => {
    const result = await pool.query(
      'INSERT INTO sessions (user_id, session_token, current_role, expires_at) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, sessionToken, currentRole, expiresAt]
    );
    return result.rows[0];
  },

  findSessionByToken: async (token: string): Promise<Session | null> => {
    const result = await pool.query(
      'SELECT * FROM sessions WHERE session_token = $1 AND expires_at > NOW()',
      [token]
    );
    return result.rows[0] || null;
  },

  updateSessionRole: async (sessionToken: string, role: string): Promise<void> => {
    await pool.query(
      'UPDATE sessions SET current_role = $1 WHERE session_token = $2',
      [role, sessionToken]
    );
  },

  deleteSession: async (sessionToken: string): Promise<void> => {
    await pool.query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);
  },

  deleteExpiredSessions: async (): Promise<void> => {
    await pool.query('DELETE FROM sessions WHERE expires_at < NOW()');
  },

  // ==================== Scout Documents ====================
  findScoutsByCreatorId: async (creatorId: number, status?: string): Promise<ScoutDocument[]> => {
    let query = 'SELECT * FROM scout_documents WHERE creator_id = $1';
    const params: any[] = [creatorId];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    return result.rows;
  },

  findScoutById: async (id: number): Promise<ScoutDocument | null> => {
    const result = await pool.query(
      'SELECT * FROM scout_documents WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  findScoutsByStatus: async (status: string): Promise<ScoutDocument[]> => {
    const result = await pool.query(
      'SELECT sd.*, u.full_name as creator_name FROM scout_documents sd LEFT JOIN users u ON sd.creator_id = u.id WHERE sd.status = $1 ORDER BY sd.created_at DESC',
      [status]
    );
    return result.rows;
  },

  createScout: async (data: Partial<ScoutDocument>): Promise<ScoutDocument> => {
    const result = await pool.query(
      `INSERT INTO scout_documents (
        creator_id, applicant_name, applicant_age, applicant_gender,
        company_name, job_title, job_description, required_skills,
        location, salary, job_appeal, ng_words, scout_text, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        data.creator_id,
        data.applicant_name,
        data.applicant_age,
        data.applicant_gender,
        data.company_name,
        data.job_title,
        data.job_description,
        data.required_skills,
        data.location,
        data.salary,
        data.job_appeal,
        data.ng_words,
        data.scout_text,
        data.status || 'DRAFT',
      ]
    );
    return result.rows[0];
  },

  updateScout: async (id: number, data: Partial<ScoutDocument>): Promise<ScoutDocument> => {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.scout_text !== undefined) {
      fields.push(`scout_text = $${paramIndex++}`);
      values.push(data.scout_text);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }
    if (data.submitted_at !== undefined) {
      fields.push(`submitted_at = $${paramIndex++}`);
      values.push(data.submitted_at);
    }
    if (data.approved_at !== undefined) {
      fields.push(`approved_at = $${paramIndex++}`);
      values.push(data.approved_at);
    }
    if (data.approved_by !== undefined) {
      fields.push(`approved_by = $${paramIndex++}`);
      values.push(data.approved_by);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE scout_documents SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  deleteScout: async (id: number): Promise<void> => {
    await pool.query('DELETE FROM scout_documents WHERE id = $1', [id]);
  },

  // ==================== Comments ====================
  createComment: async (
    scoutDocumentId: number,
    commenterId: number,
    commentText: string
  ): Promise<Comment> => {
    const result = await pool.query(
      'INSERT INTO comments (scout_document_id, commenter_id, comment_text) VALUES ($1, $2, $3) RETURNING *',
      [scoutDocumentId, commenterId, commentText]
    );
    return result.rows[0];
  },

  findCommentsByScoutId: async (scoutDocumentId: number): Promise<Comment[]> => {
    const result = await pool.query(
      'SELECT c.*, u.full_name as commenter_name FROM comments c LEFT JOIN users u ON c.commenter_id = u.id WHERE c.scout_document_id = $1 ORDER BY c.created_at DESC',
      [scoutDocumentId]
    );
    return result.rows;
  },
};