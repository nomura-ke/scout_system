// import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { databaseConfig } from './config/database';
// import { AuthMiddleware } from './middleware/auth';
// import { RoutesModule } from './routes';

// @Module({
//   imports: [TypeOrmModule.forRoot(databaseConfig), RoutesModule],
// })
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(AuthMiddleware).forRoutes('*');
//   }
// }






// backend/src/app.ts

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';

// ルート
import routes from './routes';

// ミドルウェア
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/auth';

/**
 * Expressアプリケーションの作成と設定
 */
const createApp = (): Application => {
  const app: Application = express();

  // =====================================
  // セキュリティ関連ミドルウェア
  // =====================================

  // Helmet: セキュリティヘッダー設定
  app.use(helmet({
    contentSecurityPolicy: false, // 開発環境では無効化
    crossOriginEmbedderPolicy: false
  }));

  // CORS設定
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Viteのデフォルトポート
    credentials: true, // Cookie送信を許可
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // =====================================
  // リクエストパース関連ミドルウェア
  // =====================================

  // JSON ボディパーサー
  app.use(express.json({ limit: '10mb' }));

  // URL エンコードされたボディパーサー
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie パーサー
  app.use(cookieParser());

  // =====================================
  // ログ関連ミドルウェア
  // =====================================

  // HTTPリクエストログ（開発環境）
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // カスタムリクエストログ
  app.use(requestLogger);

  // =====================================
  // ヘルスチェック
  // =====================================

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // =====================================
  // API ルート
  // =====================================

  // すべてのAPIルートを /api 配下に設定
  app.use('/api', routes);

  // =====================================
  // 静的ファイル配信（本番環境）
  // =====================================

  if (process.env.NODE_ENV === 'production') {
    // フロントエンドのビルドファイルを配信
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));

    // すべての非APIルートはフロントエンドにフォールバック
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
    });
  }

  // =====================================
  // エラーハンドリング
  // =====================================

  // 404エラーハンドラー（存在しないルート）
  app.use(notFoundHandler);

  // グローバルエラーハンドラー
  app.use(errorHandler);

  return app;
};

// =====================================
// エクスポート
// =====================================

export default createApp;