// import { Body, Controller, Post } from '@nestjs/common';
// import { AuthService } from '../services/authService';
// import { LoginRequest, RoleSelectRequest } from '../types';

// @Controller('api/auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('login')
//   login(@Body() body: LoginRequest) {
//     return this.authService.login(body);
//   }

//   @Post('role')
//   selectRole(@Body() body: RoleSelectRequest) {
//     return this.authService.selectRole(body);
//   }
// }

// backend/src/controllers/authController.ts





import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

/**
 * ログイン処理
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    // バリデーション
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'ユーザー名とパスワードは必須です'
      });
    }

    // 認証処理
    const result = await authService.authenticate(username, password);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: '認証に失敗しました'
      });
    }

    // セッショントークンをCookieに設定
    res.cookie('session_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24時間
    });

    res.status(200).json({
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
    next(error);
  }
};

/**
 * ユーザー登録処理
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    // バリデーション
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'ユーザー名とパスワードは必須です'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'パスワードは6文字以上で入力してください'
      });
    }

    // ユーザー登録処理
    const result = await authService.registerUser(username, password);

    if (!result.success) {
      return res.status(409).json({
        success: false,
        message: 'このユーザー名は既に使用されています'
      });
    }

    res.status(201).json({
      success: true,
      message: 'ユーザー登録が完了しました',
      data: {
        userId: result.userId,
        username: result.username
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ユーザーロール一覧取得
 * GET /api/auth/roles
 */
export const getUserRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId; // 認証ミドルウェアから取得

    const roles = await authService.getUserRoles(userId);

    res.status(200).json({
      success: true,
      data: {
        roles: roles
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 現在のロール更新（ロール切替）
 * PUT /api/auth/role
 */
export const updateCurrentRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({
        success: false,
        message: 'ロールIDは必須です'
      });
    }

    const result = await authService.updateCurrentRole(userId, roleId);

    if (!result.success) {
      return res.status(403).json({
        success: false,
        message: 'このロールを選択する権限がありません'
      });
    }

    res.status(200).json({
      success: true,
      message: 'ロールを切り替えました',
      data: {
        currentRole: result.currentRole
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ログアウト処理
 * POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    await authService.logout(userId);

    // Cookieクリア
    res.clearCookie('session_token');

    res.status(200).json({
      success: true,
      message: 'ログアウトしました'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * セッション検証（トークン有効性チェック）
 * GET /api/auth/verify
 */
export const verifySession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const username = (req as any).user.username;
    const currentRole = (req as any).user.currentRole;

    res.status(200).json({
      success: true,
      data: {
        userId,
        username,
        currentRole
      }
    });
  } catch (error) {
    next(error);
  }
};
