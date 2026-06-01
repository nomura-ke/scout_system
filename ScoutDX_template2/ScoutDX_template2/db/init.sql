SET client_encoding = 'UTF8';

DROP TABLE IF EXISTS rejection_comments CASCADE;
DROP TABLE IF EXISTS approval_history CASCADE;
DROP TABLE IF EXISTS ai_generation_logs CASCADE;
DROP TABLE IF EXISTS draft_details CASCADE;
DROP TABLE IF EXISTS scout_documents CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('creator', 'leader', 'admin')),
  assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  current_user_role VARCHAR(20) NOT NULL CHECK (current_user_role IN ('creator', 'leader', 'admin')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

CREATE TABLE scout_documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_leader', 'pending_admin', 'rejected', 'approved')),
  is_ai_generated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP
);

CREATE TABLE draft_details (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL UNIQUE REFERENCES scout_documents(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  position VARCHAR(255),
  business_description TEXT,
  required_skills TEXT,
  work_location VARCHAR(255),
  salary VARCHAR(255),
  job_appeal TEXT,
  sender_appeal TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_generation_logs (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL UNIQUE REFERENCES scout_documents(id) ON DELETE CASCADE,
  seeker_name VARCHAR(255),
  age_range VARCHAR(100),
  gender VARCHAR(50),
  salary VARCHAR(255),
  position VARCHAR(255),
  ng_words TEXT,
  prompt TEXT,
  response TEXT,
  generated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE approval_history (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES scout_documents(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(30) NOT NULL CHECK (action IN ('SUBMITTED', 'APPROVED_LEADER', 'APPROVED_ADMIN', 'REJECTED_LEADER', 'REJECTED_ADMIN')),
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE rejection_comments (
  id SERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES scout_documents(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_scout_documents_creator_id ON scout_documents(creator_id);
CREATE INDEX idx_scout_documents_status ON scout_documents(status);
CREATE INDEX idx_approval_history_document_id ON approval_history(document_id);
CREATE INDEX idx_rejection_comments_document_id ON rejection_comments(document_id);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (username, password) VALUES
('creator01', crypt('Passw0rd!', gen_salt('bf'))),
('leader01', crypt('Passw0rd!', gen_salt('bf'))),
('admin01', crypt('Passw0rd!', gen_salt('bf')));

INSERT INTO user_roles (user_id, role) VALUES
(1, 'creator'),
(2, 'leader'),
(3, 'admin');

INSERT INTO scout_documents (title, content, creator_id, status, is_ai_generated)
VALUES
('清水建設 エンジニア スカウト', '候補者様\n\nこの度は、清水建設のエンジニアポジションについてご案内いたします。', 1, 'draft', true),
('ABC商事 営業 スカウト', '候補者様\n\n営業ポジションについてご案内いたします。', 1, 'pending_leader', true),
('XYZ社 デザイナー スカウト', '候補者様\n\nデザイナーポジションについてご案内いたします。', 1, 'pending_admin', true),
('トラスト社 PM スカウト', '候補者様\n\nPMポジションについてご案内いたします。', 1, 'approved', true),
('テスト社 マーケ スカウト', '候補者様\n\nマーケポジションについてご案内いたします。', 1, 'rejected', true);

INSERT INTO draft_details (document_id, company_name, position, business_description, required_skills, work_location, salary, job_appeal, sender_appeal)
VALUES
(1, '清水建設', 'エンジニア', 'Webアプリ開発', 'TypeScript, Vue', '東京都', '600万円', '最新技術に触れられる', '成長環境あり'),
(2, 'ABC商事', '営業', '法人営業', '営業経験', '東京都', '500万円', '裁量が大きい', 'チーム文化が良い'),
(3, 'XYZ社', 'デザイナー', 'UI/UX設計', 'Figma', '大阪府', '550万円', 'リモート可', 'デザイン主導文化'),
(4, 'トラスト社', 'PM', '開発推進', 'PM経験', '東京都', '750万円', '経営直下案件', '意思決定が速い'),
(5, 'テスト社', 'マーケ', 'デジタルマーケ', '広告運用', '福岡県', '520万円', '新規事業', '裁量あり');
