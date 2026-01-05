# Kanban Backend

Minimal NestJS + TypeORM backend for the Kanban app.

Quick start:

1. Copy `.env.example` to `.env` and set Postgres credentials.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Start dev server:

```bash
npm run start:dev
```

The server listens on `PORT` (default 4000) and exposes CRUD endpoints under `/tasks`.
