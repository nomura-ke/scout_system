# ScoutDX template2

フロントエンド・バックエンド・PostgreSQL を Docker Compose で起動するテンプレートです。

## ディレクトリ構成

```text
ScoutDX_template2/
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   ├── components/
│   │   ├── stores/
│   │   ├── api/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── router/
│   │   ├── App.vue
│   │   ├── main.ts
│   │   └── style.css
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── db/
│   ├── init.sql
│   └── README.md
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 起動

```bash
docker compose up --build
```

- frontend: http://localhost:5173
- backend: http://localhost:3000
- postgres: localhost:5433
