# Configurar Discord Developer Portal

## 1. Criar aplicação

1. Acesse https://discord.com/developers/applications
2. Clique em **New Application** → nome: `27 BIP Sistema`
3. Em **OAuth2 → General**:
   - Copie **CLIENT ID** → `DISCORD_CLIENT_ID`
   - Copie **CLIENT SECRET** → `DISCORD_CLIENT_SECRET`
   - Adicione **Redirect**:
     - Dev: `http://localhost:3000/api/auth/callback/discord`
     - Prod: `https://SEU-DOMINIO.vercel.app/api/auth/callback/discord`

## 2. Pegar Guild ID e Role ID

1. No Discord, ative o **Modo Desenvolvedor** (Configurações → Avançado).
2. Clique com o botão direito no servidor "27º BI Pqdt" → **Copiar ID do servidor** → `DISCORD_GUILD_ID`.
3. Em **Configurações do servidor → Cargos**, clique com o direito no cargo "Administrador" → **Copiar ID do cargo** → `DISCORD_ADMIN_ROLE_ID`.

## 3. Webhook (opcional, notificações de alistamento)

1. Em um canal do servidor → **Editar canal → Integrações → Webhooks → Novo webhook**.
2. Copie a URL → `DISCORD_WEBHOOK_URL`.

## 4. Bot (opcional, DM em aprovação/reprovação)

1. Em **Bot** → **Add Bot** → **Reset Token** → copie → `DISCORD_BOT_TOKEN`.
2. Em **OAuth2 → URL Generator**: escopos `bot`, permissões `Send Messages`.
3. Acesse a URL gerada e adicione o bot ao servidor.

## 5. Escopos OAuth necessários

O NextAuth já solicita os escopos corretos: `identify email guilds guilds.members.read`.
