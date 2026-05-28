// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app';
// import { ErrorHandlerFilter } from './middleware/errorHandler';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     allowedHeaders: 'Content-Type, Accept, Authorization',
//   });

//   app.useGlobalFilters(new ErrorHandlerFilter());

//   const port = parseInt(process.env.PORT || '3000', 10);
//   await app.listen(port);
//   console.log(`Backend listening on ${port}`);
// }

// bootstrap();






// backend/src/server.ts

import createApp from './app';
import pool from './config/database';

/**
 * 環境変数の検証
 */
const validateEnvironment = (): void => {
  const requiredEnvVars = [
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
    'JWT_SECRET'
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    console.error('❌ 必須の環境変数が設定されていません:');
    missingEnvVars.forEach((envVar) => {
      console.error(`   - ${envVar}`);
    });
    process.exit(1);
  }
};

/**
 * データベース接続確認
 */
const checkDatabaseConnection = async (): Promise<void> => {
  try {
    console.log('📊 データベース接続を確認中...');
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    
    console.log('✅ データベース接続成功');
    console.log(`   - PostgreSQL バージョン: ${result.rows[0].pg_version.split(' ')[1]}`);
    console.log(`   - 現在時刻: ${result.rows[0].current_time}`);
    
    client.release();
  } catch (error) {
    console.error('❌ データベース接続失敗:', error);
    console.error('');
    console.error('💡 トラブルシューティング:');
    console.error('   1. PostgreSQLが起動しているか確認してください');
    console.error('   2. .envファイルのデータベース設定を確認してください');
    console.error('   3. docker-compose up -d でコンテナを起動してください');
    console.error('');
    throw error;
  }
};

/**
 * テーブル存在確認
 */
const checkTables = async (): Promise<void> => {
  try {
    console.log('📋 テーブル存在確認中...');
    
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const tables = result.rows.map(row => row.table_name);
    
    if (tables.length === 0) {
      console.warn('⚠️  テーブルが見つかりません。');
      console.warn('');
      console.warn('💡 以下のコマンドでテーブルを作成してください:');
      console.warn('   docker exec -i scoutdx_db psql -U postgres -d scoutdx < db/init.sql');
      console.warn('');
    } else {
      console.log('✅ 以下のテーブルが見つかりました:');
      tables.forEach((table) => {
        console.log(`   - ${table}`);
      });
    }
  } catch (error) {
    console.error('❌ テーブル確認失敗:', error);
  }
};

/**
 * サーバー起動
 */
const startServer = async (): Promise<void> => {
  try {
    console.log('');
    console.log('='.repeat(60));
    console.log('🚀 ScoutDX サーバー起動中...');
    console.log('='.repeat(60));
    console.log('');

    // 環境変数検証
    console.log('🔍 環境変数を検証中...');
    validateEnvironment();
    console.log('✅ 環境変数検証完了');
    console.log('');

    // データベース接続確認
    await checkDatabaseConnection();
    console.log('');
    
    // テーブル確認
    await checkTables();
    console.log('');

    // Expressアプリケーション作成
    console.log('⚙️  Expressアプリケーションを初期化中...');
    const app = createApp();
    console.log('✅ Expressアプリケーション初期化完了');
    console.log('');

    // ポート設定
    const PORT = process.env.PORT || 3000;

    // サーバー起動
    const server = app.listen(PORT, () => {
      console.log('='.repeat(60));
      console.log('✨ サーバー起動完了！');
      console.log('='.repeat(60));
      console.log('');
      console.log(`   環境:           ${process.env.NODE_ENV || 'development'}`);
      console.log(`   ポート:         ${PORT}`);
      console.log(`   ベースURL:      http://localhost:${PORT}`);
      console.log(`   ヘルスチェック: http://localhost:${PORT}/health`);
      console.log(`   API エンドポイント: http://localhost:${PORT}/api`);
      console.log('');
      console.log('='.repeat(60));
      console.log('');
      console.log('📝 ログ出力中... (Ctrl+C で終了)');
      console.log('');
    });

    // =====================================
    // グレースフルシャットダウン
    // =====================================

    const gracefulShutdown = async (signal: string) => {
      console.log('');
      console.log('='.repeat(60));
      console.log(`⚠️  ${signal} シグナルを受信しました`);
      console.log('='.repeat(60));
      console.log('');
      console.log('🔄 サーバーをシャットダウン中...');

      // 新しいリクエストを受け付けない
      server.close(async () => {
        console.log('✅ HTTPサーバーのクローズ完了');

        try {
          // データベース接続プールをクローズ
          await pool.end();
          console.log('✅ データベース接続プールのクローズ完了');
          console.log('');
          console.log('👋 サーバーが正常に終了しました');
          console.log('');
          process.exit(0);
        } catch (error) {
          console.error('❌ シャットダウン中にエラーが発生:', error);
          process.exit(1);
        }
      });

      // 強制終了タイムアウト（30秒）
      setTimeout(() => {
        console.error('');
        console.error('❌ タイムアウト: サーバーを強制終了します');
        console.error('');
        process.exit(1);
      }, 30000);
    };

    // シグナルハンドラー登録
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // 未処理の例外をキャッチ
    process.on('uncaughtException', (error: Error) => {
      console.error('');
      console.error('='.repeat(60));
      console.error('❌ 未処理の例外が発生しました');
      console.error('='.repeat(60));
      console.error('');
      console.error('エラー名:', error.name);
      console.error('エラーメッセージ:', error.message);
      console.error('');
      console.error('スタックトレース:');
      console.error(error.stack);
      console.error('');
      console.error('='.repeat(60));
      console.error('');
      process.exit(1);
    });

    // 未処理のPromise拒否をキャッチ
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      console.error('');
      console.error('='.repeat(60));
      console.error('❌ 未処理のPromise拒否が発生しました');
      console.error('='.repeat(60));
      console.error('');
      console.error('理由:', reason);
      console.error('Promise:', promise);
      console.error('');
      console.error('='.repeat(60));
      console.error('');
      process.exit(1);
    });

  } catch (error) {
    console.error('');
    console.error('='.repeat(60));
    console.error('❌ サーバー起動に失敗しました');
    console.error('='.repeat(60));
    console.error('');
    console.error(error);
    console.error('');
    console.error('='.repeat(60));
    console.error('');
    process.exit(1);
  }
};

// =====================================
// サーバー起動実行
// =====================================

startServer();