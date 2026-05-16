import * as crypto from "crypto";
import { Body, Controller, ForbiddenException, HttpException, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SkipThrottle, Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { z } from "zod";
import { PrismaService } from "../common/prisma.service";
import { DiscordService } from "../discord/discord.service";

const ExchangeSchema = z.object({
  accessToken: z.string().min(10),
  discordId: z.string(),
  username: z.string(),
  email: z.string().email().optional().nullable(),
  avatar: z.string().optional().nullable(),
});

const AdminPasswordSchema = z.object({
  password: z.string().min(1).max(200),
});

/** Usuário técnico para JWT do painel por senha (FK em logs). */
const PANEL_DISCORD_ID = "internal-admin-password";

function sha256Hex(value: string): Buffer {
  return crypto.createHash("sha256").update(value, "utf8").digest();
}

function timingSafeEqualString(a: string, b: string): boolean {
  const ba = sha256Hex(a);
  const bb = sha256Hex(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

@Controller("auth")
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private discord: DiscordService,
  ) {}

  /**
   * Login do painel administrativo: compara com `ADMIN_PASSWORD` no servidor
   * e emite o mesmo JWT usado pelas rotas `/admin/*`.
   */
  @Post("admin/password")
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  async adminPassword(@Body() body: unknown) {
    const parsed = AdminPasswordSchema.safeParse(body);
    if (!parsed.success) throw new HttpException(parsed.error.format(), HttpStatus.BAD_REQUEST);

    const expected = process.env.ADMIN_PASSWORD?.trim();
    if (!expected || expected.length < 8) {
      throw new HttpException("Painel admin não configurado (ADMIN_PASSWORD).", HttpStatus.SERVICE_UNAVAILABLE);
    }

    if (!timingSafeEqualString(parsed.data.password, expected)) {
      throw new ForbiddenException("Senha incorreta.");
    }

    const user = await this.prisma.user.upsert({
      where: { discordId: PANEL_DISCORD_ID },
      update: { username: "Operador Painel", role: "ADMIN" },
      create: { discordId: PANEL_DISCORD_ID, username: "Operador Painel", role: "ADMIN" },
    });

    const token = await this.jwt.signAsync({ sub: user.id, discordId: user.discordId, role: user.role });
    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }

  /**
   * OAuth Discord (opcional): guild + cargo admin — mantido para integrações legadas.
   */
  @Post("discord/exchange")
  @SkipThrottle()
  async exchange(@Body() body: unknown) {
    const parsed = ExchangeSchema.safeParse(body);
    if (!parsed.success) throw new HttpException(parsed.error.format(), HttpStatus.BAD_REQUEST);
    const { accessToken, discordId, username, email, avatar } = parsed.data;

    const inGuild = await this.discord.isGuildMember(accessToken);
    if (!inGuild) {
      throw new ForbiddenException("Você não está no servidor Discord autorizado.");
    }

    const isAdmin = await this.discord.userHasAdminRole(accessToken);
    if (!isAdmin) {
      throw new ForbiddenException("Você não possui o cargo de Administrador no servidor autorizado.");
    }

    const user = await this.prisma.user.upsert({
      where: { discordId },
      update: { username, email: email ?? undefined, avatar: avatar ?? undefined, role: "ADMIN" },
      create: { discordId, username, email: email ?? undefined, avatar: avatar ?? undefined, role: "ADMIN" },
    });

    const token = await this.jwt.signAsync({ sub: user.id, discordId, role: user.role });
    return { token, user };
  }
}
