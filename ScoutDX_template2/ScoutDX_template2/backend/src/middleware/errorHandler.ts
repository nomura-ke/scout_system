import { Request, Response, NextFunction } from 'express';

/**
 * グローバルエラーハンドラー
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // エラーの種類に応じてステータスコードを設定
  const statusCode = err.statusCode || 500;
  const message = err.message || 'サーバーエラーが発生しました';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 Not Found ハンドラー
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `ルート ${req.originalUrl} が見つかりません`,
  });
};