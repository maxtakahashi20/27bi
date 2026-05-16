# 27º Batalhão de Infantaria Paraquedista — Sistema Web

Monorepo: **Next.js** (`frontend/`) + **NestJS** (`backend/`) + **Prisma** + **PostgreSQL** (ex.: Supabase).

## Importante: GitHub ≠ variáveis no Render

O arquivo **`backend/.env` não vai para o GitHub** (está no `.gitignore`).  
Fazer **push** só envia **código**. As variáveis **`ADMIN_PASSWORD`**, `DATABASE_URL`, `JWT_SECRET`, etc. têm de ser criadas **no painel do Render** (Environment), senão o painel `/admin` continua com erro *“Painel admin não configurado (ADMIN_PASSWORD)”*.

### Checklist Render (Web Service da API)

No [Render Dashboard](https://dashboard.render.com) → seu serviço (ex.: `two7bi`) → **Environment**:

| Variável | Obrigatório | Nota |
|----------|-------------|------|
| `ADMIN_PASSWORD` | **Sim** para `/admin` | Mínimo **8** caracteres. Não existe valor padrão no código. |
| `DATABASE_URL` | Sim | Connection string do Postgres (Supabase). |
| `JWT_SECRET` | Sim | Segredo forte para assinar JWT. |
| `FRONTEND_URL` | Sim para CORS | Ex.: `http://localhost:3000` ou várias: `http://localhost:3000,https://seu-site.vercel.app` |
| `NODE_VERSION` | Recomendado | Ex.: `20` (alinhado ao projeto). |

Depois de salvar, aguarde o **redeploy** automático ou use **Manual Deploy**.

### Frontend local apontando para a API no Render

Em `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=https://SEU-SERVICO.onrender.com/api
BACKEND_INTERNAL_URL=https://SEU-SERVICO.onrender.com/api
```

O login do admin chama `POST .../api/auth/admin/password` nesse host — a senha que você digita é **a mesma** que colocou em `ADMIN_PASSWORD` **no Render**, não a do `.env` local do backend (esse arquivo só vale se rodar o Nest na sua máquina).

## Desenvolvimento local

**Backend**

```bash
cd backend
cp .env.example .env
# Edite .env: DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD (≥8), FRONTEND_URL, etc.
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

**Frontend**

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## URLs da API

O Nest usa prefixo global **`/api`**. Exemplo: `https://two7bi.onrender.com/api/health` (se existir rota) ou `.../api/courses`.

## Documentação extra

- `backend/.env.example` — lista de variáveis do servidor.
- `frontend/.env.example` — variáveis do Next.
- `docs/` — guias Discord/deploy, se existirem.

## Segurança

- Nunca commite `.env` com senhas ou tokens reais.
- Troque segredos se vazaram em repositório público.
