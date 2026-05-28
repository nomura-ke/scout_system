import app from './app';
import { testConnection } from './config/database';

const PORT = process.env.PORT || 3000;

/**
 * サーバー起動
 */
const startServer = async (): Promise<void> => {
  try {
    // データベース接続テスト
    const isDbConnected = await testConnection();
    
    if (!isDbConnected) {
      console.error('❌ データベース接続に失敗しました');
      process.exit(1);
    }

    // サーバー起動
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ========================================');
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🚀 Health check: http://localhost:${PORT}/health`);
      console.log('🚀 ========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ サーバー起動エラー:', error);
    process.exit(1);
  }
};

// 未処理の例外をキャッチ
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// サーバー起動
startServer();