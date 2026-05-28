-- ============================================
-- スカウト文作成・承認管理システム
-- データベース初期化スクリプト
-- PostgreSQL 用
-- ============================================

-- 文字コード設定
SET client_encoding = 'UTF8';

-- ==========================================
-- セクション1：既存テーブルの削除
-- ==========================================
DROP TABLE IF EXISTS approvals CASCADE;
DROP TABLE IF EXISTS rejection_comments CASCADE;
DROP TABLE IF EXISTS scout_messages CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ==========================================
-- セクション2：テーブル作成
-- ==========================================

-- 1. ユーザーテーブル
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    employee_id VARCHAR(20) UNIQUE NOT NULL
);

-- 2. スカウト文テーブル
CREATE TABLE scout_messages (
    scout_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'pending_leader', 'pending_admin', 'approved', 'rejected')),
    ai_condition TEXT,
    job_info TEXT
);

-- 3. 差戻しコメントテーブル
CREATE TABLE rejection_comments (
    comment_id SERIAL PRIMARY KEY,
    scout_id INTEGER NOT NULL REFERENCES scout_messages(scout_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 承認履歴テーブル
CREATE TABLE approvals (
    approval_id SERIAL PRIMARY KEY,
    scout_id INTEGER NOT NULL REFERENCES scout_messages(scout_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- セクション3：インデックス作成
-- ==========================================

-- users テーブルのインデックス
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_role ON users(role);

-- scout_messages テーブルのインデックス
CREATE INDEX idx_scout_messages_status ON scout_messages(status);
CREATE INDEX idx_scout_messages_created_by ON scout_messages(created_by);
CREATE INDEX idx_scout_messages_created_at ON scout_messages(created_at DESC);

-- rejection_comments テーブルのインデックス
CREATE INDEX idx_rejection_comments_scout_id ON rejection_comments(scout_id);

-- approvals テーブルのインデックス
CREATE INDEX idx_approvals_scout_id ON approvals(scout_id);
CREATE INDEX idx_approvals_user_id ON approvals(user_id);

-- ==========================================
-- セクション4：コメント
-- ==========================================

-- users テーブル
COMMENT ON TABLE users IS 'ユーザーテーブル';
COMMENT ON COLUMN users.user_id IS 'ユーザーID';
COMMENT ON COLUMN users.name IS '氏名';
COMMENT ON COLUMN users.password IS 'パスワード';
COMMENT ON COLUMN users.role IS '役割（author: 作成者, sales_leader: 営業リーダー, admin: 管理者）';
COMMENT ON COLUMN users.last_login IS '最終ログイン日時';
COMMENT ON COLUMN users.employee_id IS '社員番号';

-- scout_messages テーブル
COMMENT ON TABLE scout_messages IS 'スカウト文テーブル';
COMMENT ON COLUMN scout_messages.scout_id IS 'スカウト文ID';
COMMENT ON COLUMN scout_messages.created_at IS '作成日';
COMMENT ON COLUMN scout_messages.created_by IS '作成者';
COMMENT ON COLUMN scout_messages.title IS 'タイトル';
COMMENT ON COLUMN scout_messages.content IS '本文';
COMMENT ON COLUMN scout_messages.status IS 'ステータス（draft: 下書き, pending_leader: 営業リーダー承認待ち, pending_admin: 管理者承認待ち, approved: 承認済み, rejected: 差戻し）';
COMMENT ON COLUMN scout_messages.ai_condition IS 'AI生成条件';
COMMENT ON COLUMN scout_messages.job_info IS '求人情報';

-- rejection_comments テーブル
COMMENT ON TABLE rejection_comments IS '差戻しコメントテーブル';
COMMENT ON COLUMN rejection_comments.comment_id IS 'コメントID';
COMMENT ON COLUMN rejection_comments.scout_id IS 'スカウト文ID';
COMMENT ON COLUMN rejection_comments.user_id IS '確認者ID';
COMMENT ON COLUMN rejection_comments.comment_text IS '差戻し理由コメント';
COMMENT ON COLUMN rejection_comments.created_at IS '差戻し日時';

-- approvals テーブル
COMMENT ON TABLE approvals IS '承認履歴テーブル';
COMMENT ON COLUMN approvals.approval_id IS '承認履歴ID';
COMMENT ON COLUMN approvals.scout_id IS 'スカウト文ID';
COMMENT ON COLUMN approvals.user_id IS '承認者ID';
COMMENT ON COLUMN approvals.approved_at IS '承認日時';

-- ==========================================
-- セクション5：初期データ投入
-- ==========================================

-- 1. ユーザー（users）
INSERT INTO users (user_id, name, password, role, last_login, employee_id) VALUES
(1, 'testuser01', 'Test@1234', 'creator,leader,admin', '2024-01-15 09:00:00', 'EMP001'),
(2, 'leader01', 'Test@1234', 'leader', '2024-01-15 10:00:00', 'EMP002'),
(3, 'admin01', 'Test@1234', 'admin', '2024-01-15 11:00:00', 'EMP003'),
(4, 'creator_a', 'Test@1234', 'creator', '2024-01-14 09:00:00', 'EMP004'),
(5, 'creator_b', 'Test@1234', 'creator', '2024-01-14 10:00:00', 'EMP005');

-- user_id のシーケンスをリセット（次は6から）
SELECT setval('users_user_id_seq', 5, true);

-- 2. スカウト文（scout_messages）
INSERT INTO scout_messages (scout_id, created_at, created_by, title, content, status, ai_condition, job_info) VALUES
(1, '2024-01-13 10:00:00', 1, '(株)トラスト エンジニア募集', 
'田中太郎様初めまして。(株)トラストの採用担当です。この度、エンジニアのポジションで20代・男性の方を募集しており、田中太郎様のご経歴に大変興味を持ちご連絡させていただきました。
【募集ポジション】エンジニア
【業務内容】Webアプリ開発
【必須スキル】Node.js, React
【勤務地】東京都渋谷区
【想定年収】600万円〜
ご興味がございましたら、ぜひ一度お話しさせていただけますと幸いです。', 
'draft', 
'{"age_range":"20代","gender":"男性","job_category":"エンジニア"}',
'{"company_name":"(株)トラスト","job_title":"エンジニア","description":"Webアプリ開発","required_skills":"Node.js, React","location":"東京都渋谷区","salary":"600万円〜"}'),

(2, '2024-01-13 11:00:00', 1, 'ABC株式会社 デザイナー募集',
'山田花子様

この度、デザイナー募集でご連絡させていただきました。

【募集ポジション】デザイナー
【業務内容】UI/UXデザイン
【必須スキル】Figma, Photoshop
【勤務地】東京都港区
【想定年収】500万円〜',
'pending_leader',
'{"age_range":"30代","gender":"女性","job_category":"デザイナー"}',
'{"company_name":"ABC株式会社","job_title":"デザイナー","description":"UI/UXデザイン","required_skills":"Figma, Photoshop","location":"東京都港区","salary":"500万円〜"}'),

(3, '2024-01-13 12:00:00', 1, 'XYZ商事 営業職募集',
'佐藤一郎様

営業職で活躍いただける方を募集しております。

【募集ポジション】営業職
【業務内容】法人営業
【必須スキル】営業経験3年以上
【勤務地】大阪府大阪市
【想定年収】550万円〜',
'pending_admin',
'{"age_range":"30代","gender":"男性","job_category":"営業"}',
'{"company_name":"XYZ商事","job_title":"営業職","description":"法人営業","required_skills":"営業経験3年以上","location":"大阪府大阪市","salary":"550万円〜"}'),

(4, '2024-01-12 13:00:00', 1, 'テスト株式会社 エンジニア募集',
'鈴木次郎様

アプリ開発エンジニア募集でご連絡いたしました。

【募集ポジション】エンジニア
【業務内容】アプリ開発
【必須スキル】Swift, Kotlin
【勤務地】東京都新宿区
【想定年収】700万円〜',
'approved',
'{"age_range":"20代","gender":"男性","job_category":"エンジニア"}',
'{"company_name":"テスト株式会社","job_title":"エンジニア","description":"アプリ開発","required_skills":"Swift, Kotlin","location":"東京都新宿区","salary":"700万円〜"}'),

(5, '2024-01-14 09:00:00', 1, '差戻しテスト会社 マーケター募集',
'加藤三郎様

マーケティング担当募集でご連絡いたしました。

貴殿のご経歴に興味を持ちました。

【募集ポジション】マーケター
【業務内容】デジタルマーケ
【必須スキル】Google Analytics
【勤務地】東京都品川区
【想定年収】600万円〜',
'rejected',
'{"age_range":"30代","gender":"男性","job_category":"マーケター"}',
'{"company_name":"差戻しテスト会社","job_title":"マーケター","description":"デジタルマーケ","required_skills":"Google Analytics","location":"東京都品川区","salary":"600万円〜"}'),

(6, '2024-01-14 10:00:00', 4, 'creator_a会社 プログラマー募集',
'テスト太郎様

creator_aが作成したスカウト文です。

【募集ポジション】プログラマー
【業務内容】Web開発
【必須スキル】PHP, Laravel
【勤務地】東京都目黒区
【想定年収】500万円〜',
'draft',
'{"age_range":"20代","gender":"男性","job_category":"プログラマー"}',
'{"company_name":"creator_a会社","job_title":"プログラマー","description":"Web開発","required_skills":"PHP, Laravel","location":"東京都目黒区","salary":"500万円〜"}'),

(7, '2024-01-15 10:00:00', 1, 'NGワードテスト 営業募集',
'山田様

この仕事は絶対に稼げます！必ず成功します！100%保証いたします！',
'draft',
'{"age_range":"20代","gender":"男性","job_category":"営業"}',
'{"company_name":"NGワードテスト","job_title":"営業","description":"営業職","required_skills":"営業経験","location":"東京都","salary":"400万円〜"}');

-- scout_id のシーケンスをリセット（次は8から）
SELECT setval('scout_messages_scout_id_seq', 7, true);

-- 3. 差戻しコメント（rejection_comments）
INSERT INTO rejection_comments (comment_id, scout_id, user_id, comment_text, created_at) VALUES
(1, 5, 3, 'スカウト文に誤字があります。「貴殿」を「貴殿様」に修正してください。【評価項目】スカウト文の内容が不適切', '2024-01-14 11:00:00');

-- comment_id のシーケンスをリセット（次は2から）
SELECT setval('rejection_comments_comment_id_seq', 1, true);

-- 4. 承認履歴（approvals）
INSERT INTO approvals (approval_id, scout_id, user_id, approved_at) VALUES
(1, 3, 2, '2024-01-13 15:00:00'),
(2, 4, 2, '2024-01-12 15:30:00'),
(3, 4, 3, '2024-01-13 16:00:00');

-- approval_id のシーケンスをリセット（次は4から）
SELECT setval('approvals_approval_id_seq', 3, true);

-- ==========================================
-- セクション6：確認用クエリ
-- ==========================================
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Scout Messages', COUNT(*) FROM scout_messages
UNION ALL
SELECT 'Approvals', COUNT(*) FROM approvals
UNION ALL
SELECT 'Rejection Comments', COUNT(*) FROM rejection_comments;

-- データ確認用クエリ
SELECT '=== ユーザー一覧 ===' as info;
SELECT user_id, name, role, employee_id FROM users ORDER BY user_id;

SELECT '=== スカウト文一覧（ステータス別） ===' as info;
SELECT scout_id, title, status, created_by FROM scout_messages ORDER BY scout_id;

SELECT '=== 承認履歴 ===' as info;
SELECT a.approval_id, a.scout_id, s.title, u.name as approver, a.approved_at 
FROM approvals a
JOIN scout_messages s ON a.scout_id = s.scout_id
JOIN users u ON a.user_id = u.user_id
ORDER BY a.approval_id;

SELECT '=== 差戻しコメント ===' as info;
SELECT r.comment_id, r.scout_id, s.title, u.name as reviewer, r.comment_text 
FROM rejection_comments r
JOIN scout_messages s ON r.scout_id = s.scout_id
JOIN users u ON r.user_id = u.user_id
ORDER BY r.comment_id;