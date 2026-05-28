import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { LoginRequest, RoleSelectRequest } from '../types';

export const authController = {
  /**
   * POST /api/auth/login
   * ログイン
   */
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body as LoginRequest;

      // バリデーション
      if (!username || !password) {
        res.status(400).json({ success: false, message: 'ユーザー名とパスワードは必須です' });
        return;
      }

      // ユーザー認証
      const user = await authService.authenticateUser(username, password);
      if (!user) {
        res.status(401).json({ success: false, message: 'ユーザー名またはパスワードが正しくありません' });
        return;
      }

      // ユーザーのロール取得
      const roles = await authService.getUserRoles(user.id);
      if (roles.length === 0) {
        res.status(403).json({ success: false, message: 'ロールが割り当てられていません' });
        return;
      }

      // デフォルトで最初のロールを選択
      const defaultRole = roles[0];

      // セッション作成
      const sessionToken = await authService.createSession(user.id, defaultRole);

      res.status(200).json({
        success: true,
        session_token: sessionToken,
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
        },
        roles,
        current_role: defaultRole,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },

  /**
   * GET /api/auth/roles
   * ユーザーのロール一覧取得
   */
  getRoles: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const roles = await authService.getUserRoles(userId);

      res.status(200).json({
        success: true,
        roles,
      });
    } catch (error) {
      console.error('Get roles error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },

  /**
   * POST /api/auth/role/select
   * ロール選択
   */
  selectRole: async (req: Request, res: Response): Promise<void> => {
    try {
      const { role_name } = req.body as RoleSelectRequest;
      const sessionToken = req.headers.authorization?.replace('Bearer ', '');

      if (!sessionToken) {
        res.status(401).json({ success: false, message: '認証が必要です' });
        return;
      }

      if (!role_name) {
        res.status(400).json({ success: false, message: 'ロール名は必須です' });
        return;
      }

      // ユーザーが指定したロールを持っているか確認
      const userId = req.userId!;
      const roles = await authService.getUserRoles(userId);

      if (!roles.includes(role_name as any)) {
        res.status(403).json({ success: false, message: 'このロールは選択できません' });
        return;
      }

      // セッションのロールを更新
      await authService.selectRole(sessionToken, role_name);

      res.status(200).json({
        success: true,
        current_role: role_name,
      });
    } catch (error) {
      console.error('Select role error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },

  /**
   * POST /api/auth/logout
   * ログアウト
   */
  logout: async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionToken = req.headers.authorization?.replace('Bearer ', '');

      if (!sessionToken) {
        res.status(401).json({ success: false, message: '認証が必要です' });
        return;
      }

      await authService.logout(sessionToken);

      res.status(200).json({
        success: true,
        message: 'ログアウトしました',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ success: false, message: 'サーバーエラーが発生しました' });
    }
  },
};