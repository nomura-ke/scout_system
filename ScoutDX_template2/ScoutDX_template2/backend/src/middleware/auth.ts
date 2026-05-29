import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import database from '../repositories/database';
import { UserRole } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
        currentRole: UserRole;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token && req.cookies?.session_token) {
      token = req.cookies.session_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '認証が必要です。ログインしてください'
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    try {
      jwt.verify(token, jwtSecret);
    } catch (_error) {
      return res.status(401).json({
        success: false,
        message: 'トークンが無効です'
      });
    }

    const session = await database.findSessionByToken(token);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'セッションが無効です。再ログインしてください'
      });
    }

    const user = await database.findUserById(session.user_id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ユーザーが見つかりません'
      });
    }

    req.user = {
      userId: user.id,
      username: user.username,
      currentRole: session.current_role
    };

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '認証処理中にエラーが発生しました'
    });
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '認証が必要です'
      });
    }

    if (!allowedRoles.includes(req.user.currentRole)) {
      return res.status(403).json({
        success: false,
        message: 'この操作を実行する権限がありません',
        requiredRoles: allowedRoles,
        currentRole: req.user.currentRole
      });
    }

    return next();
  };
};

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const user = req.user ? `User: ${req.user.username} (${req.user.currentRole})` : 'Anonymous';
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${user}`);
  next();
};

export default {
  authenticate,
  authorize,
  requestLogger
};
