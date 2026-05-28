// import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   use(req: Request, _: Response, next: NextFunction) {
//     if (req.path.startsWith('/api/auth')) {
//       return next();
//     }

//     const authorization = req.headers.authorization;
//     if (!authorization) {
//       throw new UnauthorizedException('認証ヘッダーが必要です');
//     }

//     next();
//   }
// }





// backend/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import database from '../repositories/database';
import { UserRole } from '../types';

/**
 * リクエストオブジェクトの拡張（TypeScript用）
 */
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

/**
 * JWT認証ミドルウェア
 * すべての保護されたルートで使用
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. トークン取得（ヘッダーまたはCookie）
    let token: string | undefined;

    // Authorization ヘッダーから取得
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Cookieから取得（フォールバック）
    if (!token && req.cookies?.session_token) {
      token = req.cookies.session_token;
    }

    // トークンが存在しない場合
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '認証が必要です。ログインしてください'
      });
    }

    // 2. JWT検証
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    let decoded: any;

    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'トークンが無効です'
      });
    }

    // 3. データベースでセッション確認
    const session = await database.findSessionByToken(token);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'セッションが無効です。再ログインしてください'
      });
    }

    // 4. ユーザー情報取得
    const user = await database.findUserById(session.user_id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ユーザーが見つかりません'
      });
    }

    // 5. リクエストオブジェクトにユーザー情報を追加
    req.user = {
      userId: user.id,
      username: user.username,
      currentRole: session.current_role
    };

    // 次のミドルウェアへ
    next();

  } catch (error) {
    console.error('認証エラー:', error);
    return res.status(500).json({
      success: false,
      message: '認証処理中にエラーが発生しました'
    });
  }
};

/**
 * ロール別権限チェックミドルウェア
 * 特定のロールのみアクセス可能なルートで使用
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // authenticateミドルウェアの後に実行される前提
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '認証が必要です'
      });
    }

    const { currentRole } = req.user;

    // 許可されたロールに含まれているかチェック
    if (!allowedRoles.includes(currentRole)) {
      return res.status(403).json({
        success: false,
        message: 'この操作を実行する権限がありません',
        requiredRoles: allowedRoles,
        currentRole: currentRole
      });
    }

    next();
  };
};

/**
 * オプショナル認証ミドルウェア
 * トークンがあれば認証、なくてもエラーにしない
 */
export const optionalAuthenticate = async (
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

    // トークンがない場合は素通り
    if (!token) {
      return next();
    }

    // トークンがある場合は検証
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded: any = jwt.verify(token, jwtSecret);

    const session = await database.findSessionByToken(token);
    if (session) {
      const user = await database.findUserById(session.user_id);
      if (user) {
        req.user = {
          userId: user.id,
          username: user.username,
          currentRole: session.current_role
        };
      }
    }

    next();

  } catch (error) {
    // エラーでも素通り（オプショナルなので）
    next();
  }
};

/**
 * 作成者本人チェック
 * スカウト文の編集・削除時に使用
 */
export const checkOwnership = (resourceIdParam: string = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '認証が必要です'
        });
      }

      const resourceId = parseInt(req.params[resourceIdParam]);
      const userId = req.user.userId;

      // スカウト文の作成者をチェック
      const scout = await database.findScoutById(resourceId);

      if (!scout) {
        return res.status(404).json({
          success: false,
          message: 'リソースが見つかりません'
        });
      }

      // 作成者本人または管理者のみ許可
      if (scout.creator_id !== userId && req.user.currentRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'この操作を実行する権限がありません'
        });
      }

      next();

    } catch (error) {
      console.error('権限チェックエラー:', error);
      return res.status(500).json({
        success: false,
        message: '権限チェック中にエラーが発生しました'
      });
    }
  };
};

/**
 * API レート制限ミドルウェア（簡易版）
 * 連続リクエストを制限
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.user?.userId.toString() || req.ip || 'anonymous';
    const now = Date.now();

    const record = requestCounts.get(identifier);

    if (!record || now > record.resetTime) {
      // 新規または期限切れ
      requestCounts.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'リクエストが多すぎます。しばらく待ってから再試行してください',
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      });
    }

    record.count++;
    next();
  };
};

/**
 * デバッグ用：リクエスト情報ログ出力
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const user = req.user ? `User: ${req.user.username} (${req.user.currentRole})` : 'Anonymous';
  
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${user}`);
  
  next();
};

// =====================================
// エクスポート
// =====================================

export default {
  authenticate,
  authorize,
  optionalAuthenticate,
  checkOwnership,
  rateLimit,
  requestLogger
};