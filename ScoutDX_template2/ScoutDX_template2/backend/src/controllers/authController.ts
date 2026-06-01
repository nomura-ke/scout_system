import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { UserRole } from '../types';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '社員番号とパスワードは必須です'
      });
    }

    const result = await authService.authenticate(username, password);
    if (!result.success || !result.token) {
      return res.status(401).json({
        success: false,
        message: result.message || '認証に失敗しました'
      });
    }

    res.cookie('session_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: 'ログインに成功しました',
      data: {
        userId: result.userId,
        username: result.username,
        roles: result.roles,
        token: result.token
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, role } = req.body;
    const roleMap: Record<string, UserRole> = {
      creator: 'creator',
      leader: 'leader',
      admin: 'admin',
      作成者: 'creator',
      営業リーダー: 'leader',
      管理者: 'admin'
    };
    const normalizedRole = roleMap[String(role).trim()] ?? null;

    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: '社員番号・パスワード・ロールは必須です'
      });
    }

    if (!normalizedRole) {
      return res.status(400).json({
        success: false,
        message: 'ロールは作成者・営業リーダー・管理者から選択してください'
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        success: false,
        message: 'パスワードは8文字以上で入力してください'
      });
    }

    const result = await authService.registerUser(username, password, normalizedRole);
    if (!result.success) {
      return res.status(409).json({
        success: false,
        message: result.message || 'この社員番号は既に使用されています'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'ユーザー登録が完了しました',
      data: {
        userId: result.userId,
        username: result.username
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const getUserRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: '認証が必要です' });
    }

    const roles = await authService.getUserRoles(userId);
    return res.status(200).json({
      success: true,
      data: {
        roles
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const updateCurrentRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    const { roleId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: '認証が必要です' });
    }

    if (!roleId) {
      return res.status(400).json({
        success: false,
        message: 'ロールIDは必須です'
      });
    }

    const result = await authService.updateCurrentRole(userId, Number(roleId));
    if (!result.success) {
      return res.status(403).json({
        success: false,
        message: result.message || 'このロールを選択する権限がありません'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'ロールを切り替えました',
      data: {
        currentRole: result.currentRole
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: '認証が必要です' });
    }

    await authService.logout(userId);
    res.clearCookie('session_token');

    return res.status(200).json({
      success: true,
      message: 'ログアウトしました'
    });
  } catch (error) {
    return next(error);
  }
};

export const verifySession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: '認証が必要です' });
    }

    return res.status(200).json({
      success: true,
      data: {
        userId: req.user.userId,
        username: req.user.username,
        currentRole: req.user.currentRole
      }
    });
  } catch (error) {
    return next(error);
  }
};
