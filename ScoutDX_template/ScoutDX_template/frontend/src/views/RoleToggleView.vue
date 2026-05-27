<template>
  <div class="role-selection-container">
    <!-- ヘッダー -->
    <header class="header">
      <h1 class="app-title">スカウト文作成・承認管理アプリ</h1>
      <button class="logout-btn" @click="handleLogout">ログアウト</button>
    </header>

    <!-- メインコンテンツ -->
    <main class="main-content">
      <h2 class="page-title">ロール選択</h2>

      <!-- ロール選択ボタン群 -->
      <div class="role-buttons">
        <button class="role-btn role-btn-author" @click="selectRole('author')">
          作成者
        </button>

        <button class="role-btn role-btn-leader" @click="selectRole('leader')">
          営業リーダー
        </button>

        <button class="role-btn role-btn-admin" @click="selectRole('admin')">
          管理者
        </button>
      </div>
    </main>

    <!-- フッター -->
    <footer class="footer">
      <p>© スカウト文作成・承認管理アプリ</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'RoleToggleView',
  
  methods: {
    /**
     * ロール選択時の処理
     * @param {string} role - 選択されたロール ('author', 'leader', 'admin')
     */
    selectRole(role) {
      console.log(`選択されたロール: ${role}`);
      
      // ロールをlocalStorageに保存（後で使う場合）
      localStorage.setItem('userRole', role);
      
      // ロールに応じた画面遷移処理
      switch(role) {
        case 'author':
          // 作成者 → ScoutMessageList（スカウト文一覧）
          this.$router.push('/scout-messages');
          break;
        case 'leader':
          // 営業リーダー → ScoutApprovalList（承認管理）
          this.$router.push({ 
            path: '/approval',
            query: { role: 'sales_leader' }
          });
          break;
        case 'admin':
          // 管理者 → ScoutApprovalList（承認管理）
          this.$router.push({ 
            path: '/approval',
            query: { role: 'admin' }
          });
          break;
        default:
          console.error('不正なロールが選択されました');
      }
    },

    handleLogout() {
      // ① 確認ダイアログ表示
      const confirmLogout = confirm('ログアウトしますか？');
      
      if (!confirmLogout) {
        return; // キャンセルされたら何もしない
      }

      // ② ログイン情報を削除
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('userRole');
      
      // ③ ログイン画面に戻る（ログイン画面がない場合はトップページ）
      this.$router.push('/');
      
      // ④ メッセージ表示
      alert('ログアウトしました');
    }
  }
}
</script>

<style scoped>
/* 全体のコンテナ */
.role-selection-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #e0e0e0;
}

/* ヘッダー */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #d0d0d0;
  border-bottom: 2px solid #999;
}

.app-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.logout-btn {
  padding: 8px 20px;
  background-color: white;
  border: 1px solid #999;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #f0f0f0;
}

/* メインコンテンツ */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  background-color: white;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 60px;
  color: #333;
}

/* ロールボタン群 */
.role-buttons {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 共通ロールボタンスタイル */
.role-btn {
  width: 180px;
  height: 100px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  border: 2px solid #333;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.role-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.role-btn:active {
  transform: translateY(-2px);
}

/* 作成者ボタン（青） */
.role-btn-author {
  background-color: #4a9fd8;
}

.role-btn-author:hover {
  background-color: #3a8fc8;
}

/* 営業リーダーボタン（黄） */
.role-btn-leader {
  background-color: #ffc107;
}

.role-btn-leader:hover {
  background-color: #e0a800;
}

/* 管理者ボタン（緑） */
.role-btn-admin {
  background-color: #28a745;
}

.role-btn-admin:hover {
  background-color: #218838;
}

/* フッター */
.footer {
  padding: 20px;
  background-color: #d0d0d0;
  text-align: center;
  border-top: 2px solid #999;
}

.footer p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .role-buttons {
    flex-direction: column;
    gap: 20px;
  }

  .role-btn {
    width: 250px;
  }

  .header {
    flex-direction: column;
    gap: 10px;
  }
}
</style>