import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app: Application = express();

// ===============================================
// ミドルウェア設定
// ===============================================

// セキュリティヘッダー
app.use(helmet());

// CORS設定
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// リクエストログ
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// JSONパース
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================================
// ルート設定
// ===============================================

// ヘルスチェック
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API ルート
app.use(routes);

// ===============================================
// エラーハンドリング
// ===============================================

// 404 Not Found
app.use(notFoundHandler);

// グローバルエラーハンドラー
app.use(errorHandler);

export default app;