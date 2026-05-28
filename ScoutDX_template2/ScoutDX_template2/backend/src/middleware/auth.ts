import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

/**
 * 認証ミドルウェア
 * リクエストヘッダーからセッショントークンを取得し、有効性を確認
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: '認証が必要です',
      });
      return;
    }

    const sessionToken = authHeader.replace('Bearer ', '');

    // セッション検証
    const session = await authService.validateSession(sessionToken);

    if (!session) {
      res.status(401).json({
        success: false,
        message: 'セッションが無効または期限切れです',
      });
      return;
    }

    // リクエストオブジェクトにユーザー情報を追加
    req.userId = session.user_id;
    req.currentRole = session.current_role || '';

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
    });
  }
};

/**
 * ロール権限チェックミドルウェア
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const currentRole = req.currentRole;

    if (!currentRole || !allowedRoles.includes(currentRole)) {
      res.status(403).json({
        success: false,
        message: 'アクセス権限がありません',
      });
      return;
    }

    next();
  };
};