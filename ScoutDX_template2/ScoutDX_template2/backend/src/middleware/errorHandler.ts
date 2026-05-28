// import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Catch()
// export class ErrorHandlerFilter implements ExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost): void {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     const status = exception instanceof HttpException
//       ? exception.getStatus()
//       : HttpStatus.INTERNAL_SERVER_ERROR;

//     const message = exception instanceof HttpException
//       ? exception.message
//       : 'Internal server error';

//     response.status(status).json({
//       statusCode: status,
//       path: request.url,
//       message,
//     });
//   }
// }






// backend/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

/**
 * カスタムエラークラス
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * バリデーションエラークラス
 */
export class ValidationError extends AppError {
  errors: Array<{ field: string; message: string }>;

  constructor(errors: Array<{ field: string; message: string }>) {
    super('バリデーションエラー', 400);
    this.errors = errors;
  }
}

/**
 * 認証エラークラス
 */
export class AuthenticationError extends AppError {
  constructor(message: string = '認証に失敗しました') {
    super(message, 401);
  }
}

/**
 * 権限エラークラス
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'この操作を実行する権限がありません') {
    super(message, 403);
  }
}

/**
 * リソース未検出エラークラス
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'リソース') {
    super(`${resource}が見つかりません`, 404);
  }
}

/**
 * データベースエラークラス
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'データベースエラーが発生しました') {
    super(message, 500);
  }
}

/**
 * グローバルエラーハンドラー
 * すべてのルートの最後に配置
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // デフォルト値
  let statusCode = 500;
  let message = 'サーバー内部エラーが発生しました';
  let errors: Array<{ field: string; message: string }> | undefined;

  // AppErrorインスタンスの場合
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;

    // ValidationErrorの場合
    if (error instanceof ValidationError) {
      errors = error.errors;
    }
  }

  // PostgreSQLエラーの処理
  if ((error as any).code) {
    const pgError = error as any;

    switch (pgError.code) {
      case '23505': // unique_violation
        statusCode = 409;
        message = 'この値は既に登録されています';
        break;
      case '23503': // foreign_key_violation
        statusCode = 400;
        message = '関連するデータが存在しません';
        break;
      case '23502': // not_null_violation
        statusCode = 400;
        message = '必須項目が入力されていません';
        break;
      case '22P02': // invalid_text_representation
        statusCode = 400;
        message = '不正なデータ形式です';
        break;
      case '42P01': // undefined_table
        statusCode = 500;
        message = 'データベーステーブルが見つかりません';
        break;
      default:
        statusCode = 500;
        message = 'データベースエラーが発生しました';
    }
  }

  // JWTエラーの処理
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'トークンが無効です';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'トークンの有効期限が切れています';
  }

  // エラーログ出力
  const timestamp = new Date().toISOString();
  const user = (req as any).user 
    ? `User: ${(req as any).user.username} (ID: ${(req as any).user.userId})` 
    : 'Anonymous';

  console.error('='.repeat(80));
  console.error(`[ERROR] ${timestamp}`);
  console.error(`Path: ${req.method} ${req.path}`);
  console.error(`${user}`);
  console.error(`Status: ${statusCode}`);
  console.error(`Message: ${message}`);
  console.error(`Error Name: ${error.name}`);
  
  // 本番環境以外ではスタックトレースも出力
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Stack: ${error.stack}`);
  }
  
  console.error('='.repeat(80));

  // レスポンス作成
  const response: ErrorResponse = {
    success: false,
    message: message
  };

  // バリデーションエラーの場合
  if (errors) {
    response.errors = errors;
  }

  // 開発環境ではスタックトレースも返す
  if (process.env.NODE_ENV !== 'production') {
    (response as any).stack = error.stack;
    (response as any).errorName = error.name;
  }

  res.status(statusCode).json(response);
};


/**
 * 404エラーハンドラー
 * 存在しないルートへのアクセス
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = `ルートが見つかりません: ${req.method} ${req.path}`;
  
  console.warn(`⚠️  [404] ${message}`);
  
  res.status(404).json({
    success: false,
    message: message,
    requestedUrl: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET  /health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET  /api/scouts',
      'POST /api/scouts/generate',
      'GET  /api/approvals/pending-leader',
      'GET  /api/approvals/pending-admin'
    ]
  });
};