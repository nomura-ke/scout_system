<template>
  <div class="page-wrapper">
    <!-- ヘッダー -->
    <header class="app-header">
      <h1 class="app-title">スカウト文作成・承認管理アプリ</h1>
      <div class="header-buttons">
        <button class="header-btn">スカウト文作成</button>
        <button class="header-btn active">スカウト文一覧</button>
        <button class="header-btn">ログアウト</button>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="main-content">
      <h2 class="page-title">スカウト文一覧</h2>

      <!-- 絞込ボタン -->
      <div class="filter-section">
        <button class="filter-btn">絞込 ▼</button>
      </div>

      <!-- テーブル -->
      <div class="table-container">
        <table class="scout-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>求職者</th>
              <th>求人をだしている会社名</th>
              <th>作成日</th>
              <th>ステータス</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="message in messages" :key="message.id">
              <td>{{ message.id }}</td>
              <td>
                <a v-if="message.recruiter" href="#" class="recruiter-link">
                  {{ message.recruiter }}
                </a>
              </td>
              <td>{{ message.company }}</td>
              <td>{{ message.created_at }}</td>
              <td>
                <span :class="['status-badge', getStatusClass(message.status)]">
                  {{ message.status }}
                </span>
              </td>
              <td class="action-cell">
                <button class="action-btn edit-btn" @click="handleEdit(message.id)">
                  編集
                </button>
                <button class="action-btn delete-btn" @click="handleDelete(message.id)">
                  削除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- フッター -->
    <footer class="app-footer">© スカウト文作成・承認管理アプリ</footer>
  </div>
</template>

<script>
export default {
  name: 'ScoutMessageList',
  data() {
    return {
      messages: [
        {
          id: 1,
          recruiter: '佐藤太郎',
          company: '清水建設',
          created_at: '2021-08-20',
          status: '編集中'
        },
        {
          id: 2,
          recruiter: '鈴木花子',
          company: '株式会社サンプル',
          created_at: '2020-11-10',
          status: '営業リーダー承認待ち'
        },
        {
          id: 3,
          recruiter: '田中一郎',
          company: '株式会社テスト',
          created_at: '2024-01-18',
          status: '承認済'
        },
        {
          id: 4,
          recruiter: '山田太郎',
          company: '株式会社サンプル2',
          created_at: '2026-02-11',
          status: '差戻し'
        }
      ]
    };
  },
  methods: {
    // ステータスに応じたクラス名を返す
    getStatusClass(status) {
      if (status.includes('編集中')) return 'status-editing';
      if (status.includes('承認待ち')) return 'status-pending';
      if (status.includes('承認済')) return 'status-approved';
      if (status.includes('差戻し')) return 'status-rejected';
      return '';
    },
    // 編集ボタン
    handleEdit(id) {
      console.log('編集:', id);
      // 後で実装
    },
    // 削除ボタン
    handleDelete(id) {
      console.log('削除:', id);
      // 後で実装
    }
  }
};
</script>

<style scoped>
/* 全体 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', 'Yu Gothic', 'Meiryo', sans-serif;
}

/* ヘッダー */
.app-header {
  background-color: #e0e0e0;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}

.app-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.header-buttons {
  display: flex;
  gap: 15px;
}

.header-btn {
  padding: 10px 25px;
  border: 2px solid #999;
  background-color: white;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.header-btn:hover {
  background-color: #f0f0f0;
}

.header-btn.active {
  background-color: #666;
  color: white;
  border-color: #666;
}

/* メインコンテンツ */
.main-content {
  flex: 1;
  padding: 40px;
  background-color: white;
}

.page-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  color: #333;
}

/* 絞込セクション */
.filter-section {
  margin-bottom: 20px;
}

.filter-btn {
  padding: 8px 20px;
  border: 2px solid #333;
  background-color: white;
  border-radius: 3px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.filter-btn:hover {
  background-color: #f0f0f0;
}

/* テーブル */
.table-container {
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.scout-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.scout-table thead {
  background-color: #f8f8f8;
  border-bottom: 2px solid #ddd;
}

.scout-table th {
  padding: 15px;
  text-align: left;
  font-weight: bold;
  color: #333;
  font-size: 14px;
  white-space: nowrap;
}

.scout-table tbody tr {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.scout-table tbody tr:hover {
  background-color: #f9f9f9;
}

.scout-table td {
  padding: 15px;
  color: #555;
  font-size: 14px;
}

/* 求職者リンク */
.recruiter-link {
  color: #0066cc;
  text-decoration: none;
  font-weight: 500;
}

.recruiter-link:hover {
  text-decoration: underline;
}

/* ステータスバッジ */
.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
}

.status-editing {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffc107;
}

.status-pending {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #17a2b8;
}

.status-approved {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #28a745;
}

.status-rejected {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #dc3545;
}

/* アクションボタン */
.action-cell {
  text-align: right;
  white-space: nowrap;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-left: 8px;
}

.edit-btn {
  background-color: #ffc107;
  color: #333;
}

.edit-btn:hover {
  background-color: #e0a800;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(255, 193, 7, 0.4);
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(220, 53, 69, 0.4);
}

/* フッター */
.app-footer {
  background-color: #e0e0e0;
  text-align: center;
  padding: 15px;
  font-size: 12px;
  color: #666;
  border-top: 1px solid #ccc;
}

/* レスポンシブ */
@media (max-width: 1024px) {
  .app-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .header-buttons {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px;
  }

  .header-btn {
    padding: 8px 15px;
    font-size: 12px;
  }

  .scout-table th,
  .scout-table td {
    padding: 10px;
    font-size: 12px;
  }

  .action-btn {
    padding: 6px 12px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }

  .header-buttons {
    flex-direction: column;
    width: 100%;
  }

  .header-btn {
    width: 100%;
  }

  .scout-table {
    font-size: 11px;
  }

  .action-cell {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .action-btn {
    margin-left: 0;
    width: 100%;
  }
}
</style>