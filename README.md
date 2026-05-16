# 27º Batalhão de Infantaria Paraquedista — Sistema Web

Monorepo: **Next.js** (`frontend/`) + **NestJS** (`backend/`) + **Prisma** + **PostgreSQL** (ex.: Supabase).

## Acesso ao painel `/admin`

1. Entrar com **Discord** (identifica a conta e exige estar no servidor configurado).
2. Preencher **cadastro** (nome, RG, telefone, graduação) → grava em `instructor_registrations` e cria/atualiza a linha em `users` com `role = USER`.
3. No **PostgreSQL**, você analisa o cadastro (ex.: tabela `instructor_registrations`) e, se aprovar, altera na tabela **`users`** a coluna **`role`** para **`INSTRUCTOR`** (para o `discord_id` correspondente).
4. A pessoa **recarrega a página** (F5) ou clica em **Verificar** → recebe JWT e entra no painel.

**Atalho staff:** quem tem o cargo de **Administrador** no Discord (`DISCORD_ADMIN_ROLE_ID`) continua entrando como **ADMIN** sem esse fluxo de cadastro. Também é possível promover alguém a **ADMIN** só no banco (`users.role = ADMIN`).

## GitHub ≠ variáveis no Render

O **`backend/.env` não sobe no GitHub** (`.gitignore`). No **Render**, configure no **Environment**: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `DISCORD_*`, etc. (veja `backend/.env.example`).

## Checklist rápido no Render

| Variável | Uso |
|----------|-----|
| `DATABASE_URL` | Postgres (Supabase) |
| `JWT_SECRET` | Assinatura JWT |
| `FRONTEND_URL` | CORS (pode listar várias origens separadas por vírgula) |
| `DISCORD_GUILD_ID` | Servidor autorizado |
| `DISCORD_ADMIN_ROLE_ID` | Cargo admin no Discord (acesso direto) |

## Desenvolvimento local

**Backend**

```bash
cd backend
cp .env.example .env
# Preencha DATABASE_URL, JWT_SECRET, FRONTEND_URL, DISCORD_*
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

## API (prefixo `/api`)

Ex.: `POST /api/auth/instructor/register`, `POST /api/auth/instructor/gate`.

## Segurança

- Não commite `.env` com segredos reais.
- Troque tokens se vazaram em repositório público.
