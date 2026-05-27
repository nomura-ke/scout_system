<template>
  <div class="page-wrapper">
    <!-- ヘッダー -->
    <header class="app-header">
      <h1 class="app-title">スカウト文作成・承認管理アプリ</h1>
      <div class="header-buttons">
        <button class="header-btn">スカウト文一覧</button>
        <button class="header-btn">ログアウト</button>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="main-content">
      <!-- 役割切り替えボタン（デモ用） -->
      <div class="role-switch">
        <button 
          :class="['role-btn', { active: userRole === 'sales_leader' }]"
          @click="userRole = 'sales_leader'"
        >
          営業リーダー
        </button>
        <button 
          :class="['role-btn', { active: userRole === 'admin' }]"
          @click="userRole = 'admin'"
        >
          管理者
        </button>
      </div>

      <div class="dual-table-container">
        <!-- 営業リーダーの場合 -->
        <template v-if="userRole === 'sales_leader'">
          <!-- 左側：営業リーダー承認待ち -->
          <div class="table-section">
            <h2 class="section-title pending">営業リーダー承認待ち<br>スカウト文一覧</h2>
            
            <div class="table-wrapper">
              <table class="approval-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>求職者</th>
                    <th>送信先名<br>(中途採用 運営責任者名)</th>
                    <th>作成者</th>
                    <th>申請日</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in salesLeaderPendingList" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>
                      <a href="#" class="link-text">{{ item.jobSeeker }}</a>
                    </td>
                    <td>
                      <a href="#" class="link-text">{{ item.recipient }}</a>
                    </td>
                    <td>{{ item.creator }}</td>
                    <td>{{ item.applicationDate }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 右側：管理者承認待ち -->
          <div class="table-section">
            <h2 class="section-title waiting">管理者承認待ち<br>スカウト文一覧</h2>
            
            <div class="table-wrapper">
              <table class="approval-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>求職者</th>
                    <th>送信先名<br>(中途採用 運営責任者名)</th>
                    <th>作成者</th>
                    <th>申請日</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in adminPendingList" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>
                      <a href="#" class="link-text">{{ item.jobSeeker }}</a>
                    </td>
                    <td>
                      <a href="#" class="link-text">{{ item.recipient }}</a>
                    </td>
                    <td>{{ item.creator }}</td>
                    <td>{{ item.applicationDate }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <!-- 管理者の場合 -->
        <template v-else-if="userRole === 'admin'">
          <!-- 左側：管理者承認待ち -->
          <div class="table-section">
            <h2 class="section-title pending">管理者承認待ち<br>スカウト文一覧</h2>
            
            <div class="table-wrapper">
              <table class="approval-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>求職者</th>
                    <th>送信先名<br>(中途採用 運営責任者名)</th>
                    <th>作成者</th>
                    <th>申請日</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in adminPendingList" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>
                      <a href="#" class="link-text">{{ item.jobSeeker }}</a>
                    </td>
                    <td>
                      <a href="#" class="link-text">{{ item.recipient }}</a>
                    </td>
                    <td>{{ item.creator }}</td>
                    <td>{{ item.applicationDate }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 右側：承認済み -->
          <div class="table-section">
            <h2 class="section-title approved">承認済み<br>スカウト文一覧</h2>
            
            <div class="table-wrapper">
              <table class="approval-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>求職者</th>
                    <th>送信先名<br>(中途採用 運営責任者名)</th>
                    <th>作成者</th>
                    <th>申請日</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in approvedList" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>
                      <a href="#" class="link-text">{{ item.jobSeeker }}</a>
                    </td>
                    <td>
                      <a href="#" class="link-text">{{ item.recipient }}</a>
                    </td>
                    <td>{{ item.creator }}</td>
                    <td>{{ item.applicationDate }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </div>
    </main>

    <!-- フッター -->
    <footer class="app-footer">© スカウト文作成・承認管理アプリ</footer>
  </div>
</template>

<script>
export default {
  name: 'ScoutApprovalList',
  data() {
    return {
      userRole: 'sales_leader',
      
      // 営業リーダー承認待ち
      salesLeaderPendingList: [
        {
          id: 1,
          jobSeeker: '佐川テスト',
          recipient: '山口太郎',
          creator: '鈴木',
          applicationDate: '2021-08-20'
        },
        {
          id: 2,
          jobSeeker: 'Strings of Serenity',
          recipient: 'Harmony Collective',
          creator: '田中',
          applicationDate: '2020-11-10'
        },
        {
          id: 3,
          jobSeeker: 'Cosmic Vibes',
          recipient: 'Galaxy Harmonics',
          creator: '佐藤',
          applicationDate: '2024-01-18'
        }
      ],
      
      // 管理者承認待ち
      adminPendingList: [
        {
          id: 4,
          jobSeeker: '山田花子',
          recipient: '佐藤商事',
          creator: '高橋',
          applicationDate: '2024-05-15'
        },
        {
          id: 5,
          jobSeeker: '鈴木一郎',
          recipient: '田中産業',
          creator: '伊藤',
          applicationDate: '2024-05-20'
        }
      ],
      
      // 承認済み
      approvedList: [
        {
          id: 6,
          jobSeeker: '中村太郎',
          recipient: '鈴木建設',
          creator: '小林',
          applicationDate: '2024-04-10'
        },
        {
          id: 7,
          jobSeeker: '田中次郎',
          recipient: '山田商会',
          creator: '渡辺',
          applicationDate: '2024-03-25'
        }
      ]
    };
  },
  mounted() {
    // URLのクエリパラメータから役割を取得
    const roleFromQuery = this.$route.query.role;
    if (roleFromQuery) {
      this.userRole = roleFromQuery;
    } else {
      // クエリパラメータがない場合はlocalStorageから取得
      const roleFromStorage = localStorage.getItem('userRole');
      if (roleFromStorage === 'leader') {
        this.userRole = 'sales_leader';
      } else if (roleFromStorage === 'admin') {
        this.userRole = 'admin';
      }
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', 'Yu Gothic', 'Meiryo', sans-serif;
  background-color: #f5f5f5;
}

.app-header {
  background-color: #e0e0e0;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}

.app-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.header-buttons {
  display: flex;
  gap: 15px;
}

.header-btn {
  padding: 8px 20px;
  border: 2px solid #999;
  background-color: white;
  border-radius: 5px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.header-btn:hover {
  background-color: #f0f0f0;
}

.role-switch {
  text-align: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff3cd;
  border-radius: 8px;
}

.role-btn {
  padding: 10px 30px;
  margin: 0 10px;
  border: 2px solid #666;
  background-color: white;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.role-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.main-content {
  flex: 1;
  padding: 30px;
  background-color: white;
}

.dual-table-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.table-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  text-align: center;
  padding: 12px;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.5;
}

.section-title.pending {
  background-color: #ffebee;
  color: #c62828;
}

.section-title.waiting {
  background-color: #fff3e0;
  color: #e65100;
}

.section-title.approved {
  background-color: #e3f2fd;
  color: #1565c0;
}

.table-wrapper {
  overflow-x: auto;
  background-color: white;
  border: 1px solid #ddd;
}

.approval-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.approval-table thead {
  background-color: #f8f8f8;
}

.approval-table th {
  padding: 10px 8px;
  text-align: center;
  font-weight: bold;
  color: #333;
  font-size: 11px;
  border: 1px solid #ddd;
  line-height: 1.3;
}

.approval-table tbody tr {
  border-bottom: 1px solid #ddd;
}

.approval-table td {
  padding: 10px 8px;
  text-align: center;
  color: #555;
  font-size: 12px;
  border: 1px solid #ddd;
}

.link-text {
  color: #0066cc;
  text-decoration: none;
}

.link-text:hover {
  text-decoration: underline;
}

.app-footer {
  background-color: #e0e0e0;
  text-align: center;
  padding: 15px;
  font-size: 12px;
  color: #666;
  border-top: 1px solid #ccc;
}

@media (max-width: 1200px) {
  .dual-table-container {
    grid-template-columns: 1fr;
  }
}
</style>