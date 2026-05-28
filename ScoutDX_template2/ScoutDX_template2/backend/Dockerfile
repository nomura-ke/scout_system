FROM node:20-alpine

WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# ソースコードをコピー
COPY . .

# TypeScript のビルド（本番環境用）
# RUN npm run build

# ポート公開
EXPOSE 3000

# 開発モードで起動（ts-node-dev使用）
CMD ["npm", "run", "dev"]