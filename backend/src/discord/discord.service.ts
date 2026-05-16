import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private readonly GUILD_ID = process.env.DISCORD_GUILD_ID!;
  private readonly ADMIN_ROLE_ID = process.env.DISCORD_ADMIN_ROLE_ID!;
  private readonly WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
  private readonly BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

  /** Extrai snowflake numérico de `<@123>`, `<@!123>` ou string só com dígitos. */
  parseDiscordUserId(raw: string | undefined | null): string | null {
    if (!raw) return null;
    const t = raw.trim();
    const m = t.match(/^<@!?(\d{17,20})>$/);
    if (m) return m[1];
    if (/^\d{17,20}$/.test(t)) return t;
    return null;
  }

  /** True se o token OAuth conseguir ler o próprio membro na guild (está no servidor). */
  async isGuildMember(accessToken: string): Promise<boolean> {
    if (!this.GUILD_ID) {
      this.logger.warn("DISCORD_GUILD_ID não configurado");
      return false;
    }
    try {
      await axios.get(`https://discord.com/api/v10/users/@me/guilds/${this.GUILD_ID}/member`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return true;
    } catch (e: any) {
      this.logger.warn(`Membro fora da guild ou token sem escopo: ${e?.response?.status ?? e?.message}`);
      return false;
    }
  }

  async userHasAdminRole(accessToken: string): Promise<boolean> {
    if (!this.GUILD_ID || !this.ADMIN_ROLE_ID) {
      this.logger.warn("DISCORD_GUILD_ID / DISCORD_ADMIN_ROLE_ID não configurados");
      return false;
    }
    try {
      const res = await axios.get(`https://discord.com/api/v10/users/@me/guilds/${this.GUILD_ID}/member`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const roles: string[] = res.data?.roles ?? [];
      return roles.includes(this.ADMIN_ROLE_ID);
    } catch (e: any) {
      this.logger.warn(`Falha ao verificar cargo Discord: ${e?.response?.status ?? e?.message}`);
      return false;
    }
  }

  async sendWebhook(content?: string, embeds?: Record<string, unknown>[]) {
    if (!this.WEBHOOK_URL) return;
    try {
      await axios.post(this.WEBHOOK_URL, { content: content ?? null, embeds: embeds ?? undefined });
    } catch (e: any) {
      this.logger.warn(`Webhook falhou: ${e?.message}`);
    }
  }

  async sendDM(discordUserId: string, content: string) {
    if (!this.BOT_TOKEN) return;
    try {
      const dm = await axios.post(
        "https://discord.com/api/v10/users/@me/channels",
        { recipient_id: discordUserId },
        { headers: { Authorization: `Bot ${this.BOT_TOKEN}` } },
      );
      await axios.post(
        `https://discord.com/api/v10/channels/${dm.data.id}/messages`,
        { content },
        { headers: { Authorization: `Bot ${this.BOT_TOKEN}` } },
      );
    } catch (e: any) {
      this.logger.warn(`DM falhou: ${e?.message}`);
    }
  }
}
