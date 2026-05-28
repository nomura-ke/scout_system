# FROM node:20-alpine

# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm ci

# COPY . .

# EXPOSE 3000

# CMD ["npm", "run", "start:dev"]






# backend/Dockerfile

# =====================================
# ステージ1: ビルド環境
# =====================================
FROM node:18-alpine AS builder

# 作業ディレクトリ設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係インストール
RUN npm ci --only=production && npm cache clean --force

# ソースコードをコピー
COPY . .

# TypeScriptコンパイル
RUN npm run build

# =====================================
# ステージ2: 本番環境
# =====================================
FROM node:18-alpine

# 作業ディレクトリ設定
WORKDIR /app

# 本番環境用の依存関係のみコピー
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# 非rootユーザー作成
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 所有権変更
RUN chown -R nodejs:nodejs /app

# ユーザー切り替え
USER nodejs

# ポート公開
EXPOSE 3000

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# サーバー起動
CMD ["node", "dist/server.js"]