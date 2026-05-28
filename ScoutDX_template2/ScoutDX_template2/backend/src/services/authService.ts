import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from '../repositories/database';
import { User, Session } from '../types';

const SALT_ROUNDS = 10;
const SESSION_EXPIRY_HOURS = 24;

export const authService = {
  /**
   * ユーザー認証
   */
  authenticateUser: async (username: string, password: string): Promise<User | null> => {
    const user = await db.findUserByUsername(username);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  },

  /**
   * セッション作成
   */
  createSession: async (userId: number, roleName: string): Promise<string> => {
    // ランダムなセッショントークン生成
    const sessionToken = crypto.randomBytes(32).toString('hex');

    // 有効期限設定
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);

    await db.createSession(userId, sessionToken, roleName, expiresAt);

    return sessionToken;
  },

  /**
   * セッション検証
   */
  validateSession: async (sessionToken: string): Promise<Session | null> => {
    return await db.findSessionByToken(sessionToken);
  },

  /**
   * ロール取得
   */
  getUserRoles: async (userId: number): Promise<string[]> => {
    const roles = await db.findRolesByUserId(userId);
    return roles.map((role) => role.role_name);
  },

  /**
   * ロール選択
   */
  selectRole: async (sessionToken: string, roleName: string): Promise<void> => {
    await db.updateSessionRole(sessionToken, roleName);
  },

  /**
   * ログアウト
   */
  logout: async (sessionToken: string): Promise<void> => {
    await db.deleteSession(sessionToken);
  },

  /**
   * パスワードハッシュ化（ユーザー登録用）
   */
  hashPassword: async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
  },
};