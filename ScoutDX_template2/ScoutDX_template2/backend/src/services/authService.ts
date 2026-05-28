import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../repositories/database';
import { AuthResponse, UserRole } from '../types';

const SALT_ROUNDS = 10;
const SESSION_EXPIRY_HOURS = 24;

export const authService = {
  authenticate: async (username: string, password: string): Promise<AuthResponse> => {
    const user = await db.findUserByUsername(username);
    if (!user) {
      return { success: false, message: 'ユーザーが見つかりません' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'パスワードが一致しません' };
    }

    const roles = await db.findUserRoles(user.id);
    const currentRole: UserRole = (roles[0]?.role || 'creator') as UserRole;

    const token = jwt.sign(
      { userId: user.id, username: user.username, currentRole },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: `${SESSION_EXPIRY_HOURS}h` }
    );

    await db.createSession(user.id, token, currentRole);
    await db.updateLastLogin(user.id);

    return {
      success: true,
      userId: user.id,
      username: user.username,
      token,
      roles
    };
  },

  registerUser: async (username: string, password: string): Promise<AuthResponse> => {
    const exists = await db.existsUsername(username);
    if (exists) {
      return { success: false, message: 'このユーザー名は既に使用されています' };
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const userId = await db.createUser(username, hashedPassword);
    await db.assignDefaultRole(userId);

    return {
      success: true,
      userId,
      username
    };
  },

  getUserRoles: async (userId: number) => {
    return db.findUserRoles(userId);
  },

  updateCurrentRole: async (userId: number, roleId: number) => {
    const roles = await db.findUserRoles(userId);
    const targetRole = roles.find((role) => role.id === roleId);

    if (!targetRole) {
      return { success: false, message: 'このロールを選択する権限がありません' };
    }

    await db.updateSessionRole(userId, roleId);
    return {
      success: true,
      currentRole: targetRole.role
    };
  },

  logout: async (userId: number): Promise<void> => {
    await db.deleteSession(userId);
  }
};