-- ユーザーテーブル
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ロールテーブル
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- 'creator', 'leader', 'admin'
    display_name VARCHAR(50) NOT NULL
);

-- ユーザーロール関連テーブル
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE(user_id, role_id)
);

-- セッションテーブル
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    current_role_id INTEGER REFERENCES roles(id),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- スカウト文書テーブル
CREATE TABLE scout_documents (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL, -- 'draft', 'pending', 'approved', 'rejected'
    scout_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by INTEGER REFERENCES users(id)
);

-- ドラフト詳細テーブル
CREATE TABLE draft_details (
    id SERIAL PRIMARY KEY,
    scout_document_id INTEGER REFERENCES scout_documents(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    job_description TEXT,
    required_skills TEXT,
    location VARCHAR(255),
    salary VARCHAR(255),
    job_appeal TEXT,
    sender_name VARCHAR(100),
    sender_age INTEGER,
    sender_gender VARCHAR(20),
    ng_words TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 承認ログテーブル
CREATE TABLE approval_logs (
    id SERIAL PRIMARY KEY,
    scout_document_id INTEGER REFERENCES scout_documents(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'SUBMITTED', 'APPROVED', 'REJECTED'
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 通知テーブル
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    scout_document_id INTEGER REFERENCES scout_documents(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'APPROVAL_REQUEST', 'APPROVED', 'REJECTED'
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI生成ログテーブル
CREATE TABLE ai_generation_logs (
    id SERIAL PRIMARY KEY,
    scout_document_id INTEGER REFERENCES scout_documents(id) ON DELETE CASCADE,
    prompt TEXT,
    generated_text TEXT,
    model_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX idx_scout_documents_creator ON scout_documents(creator_id);
CREATE INDEX idx_scout_documents_status ON scout_documents(status);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);