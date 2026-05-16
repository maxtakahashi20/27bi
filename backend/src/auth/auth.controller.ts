import { Body, Controller, ForbiddenException, HttpException, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SkipThrottle, Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { z } from "zod";
import { PrismaService } from "../common/prisma.service";
import { sanitizeText } from "../common/sanitize";
import { DiscordService } from "../discord/discord.service";

const DiscordSessionSchema = z.object({
  accessToken: z.string().min(10),
  discordId: z.string(),
  username: z.string(),
  email: z.string().email().optional().nullable(),
  avatar: z.string().optional().nullable(),
});

const InstructorRegisterSchema = DiscordSessionSchema.extend({
  fullName: z.string().min(3).max(120),
  rg: z.string().min(4).max(20),
  phone: z.string().min(8).max(20),
  graduation: z.string().min(2).max(120),
});

@Controller("auth")
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private discord: DiscordService,
  ) {}

  /**
   * Cadastro inicial do instrutor (nome, RG, telefone, graduação).
   * Exige Discord OAuth + membro da guild. Liberação do painel é manual no banco (`users.role` = INSTRUCTOR).
   */
  @Post("instructor/register")
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 12, ttl: 60_000 } })
  async registerInstructor(@Body() body: unknown) {
    const parsed = InstructorRegisterSchema.safeParse(body);
    if (!parsed.success) throw new HttpException(parsed.error.format(), HttpStatus.BAD_REQUEST);
    const d = parsed.data;

    const tokenOk = await this.discord.accessTokenMatchesUser(d.accessToken, d.discordId);
    if (!tokenOk) throw new ForbiddenException("Token Discord inválido para este usuário.");

    const inGuild = await this.discord.isGuildMember(d.accessToken);
    if (!inGuild) throw new ForbiddenException("Você precisa estar no servidor Discord autorizado.");

    await this.prisma.instructorRegistration.upsert({
      where: { discordId: d.discordId },
      update: {
        fullName: sanitizeText(d.fullName, 120),
        rg: sanitizeText(d.rg.replace(/\D/g, ""), 20),
        phone: sanitizeText(d.phone, 20),
        graduation: sanitizeText(d.graduation, 120),
      },
      create: {
        discordId: d.discordId,
        fullName: sanitizeText(d.fullName, 120),
        rg: sanitizeText(d.rg.replace(/\D/g, ""), 20),
        phone: sanitizeText(d.phone, 20),
        graduation: sanitizeText(d.graduation, 120),
      },
    });

    await this.prisma.user.upsert({
      where: { discordId: d.discordId },
      update: {
        username: d.username,
        email: d.email ?? undefined,
        avatar: d.avatar ?? undefined,
      },
      create: {
        discordId: d.discordId,
        username: d.username,
        email: d.email ?? undefined,
        avatar: d.avatar ?? undefined,
        role: "USER",
      },
    });

    this.discord.sendWebhook(undefined, [
      {
        title: "Novo cadastro de instrutor (painel)",
        color: 0x4a6741,
        fields: [
          { name: "Nome", value: sanitizeText(d.fullName, 120), inline: true },
          { name: "Discord ID", value: d.discordId, inline: true },
          { name: "Graduação", value: sanitizeText(d.graduation, 120), inline: false },
        ],
      },
    ]);

    return { ok: true };
  }

  /**
   * Verifica acesso ao painel:
   * - Cargo Admin no Discord → JWT ADMIN (atalho de staff).
   * - `users.role` = INSTRUCTOR no banco (definido manualmente após análise do cadastro) → JWT INSTRUCTOR.
   * - `users.role` = ADMIN só no banco → JWT ADMIN.
   * - Cadastro em `instructor_registrations` + `users.role` = USER → aguarda você alterar `role` para INSTRUCTOR.
   */
  @Post("instructor/gate")
  @SkipThrottle()
  async instructorGate(@Body() body: unknown) {
    const parsed = DiscordSessionSchema.safeParse(body);
    if (!parsed.success) throw new HttpException(parsed.error.format(), HttpStatus.BAD_REQUEST);
    const { accessToken, discordId, username, email, avatar } = parsed.data;

    const tokenOk = await this.discord.accessTokenMatchesUser(accessToken, discordId);
    if (!tokenOk) throw new ForbiddenException("Token Discord inválido.");

    const inGuild = await this.discord.isGuildMember(accessToken);
    if (!inGuild) {
      throw new ForbiddenException("Entre no servidor Discord autorizado.");
    }

    const isDiscordAdmin = await this.discord.userHasAdminRole(accessToken);
    if (isDiscordAdmin) {
      const user = await this.prisma.user.upsert({
        where: { discordId },
        update: { username, email: email ?? undefined, avatar: avatar ?? undefined, role: "ADMIN" },
        create: { discordId, username, email: email ?? undefined, avatar: avatar ?? undefined, role: "ADMIN" },
      });
      const token = await this.jwt.signAsync({ sub: user.id, discordId, role: user.role });
      return { phase: "OK", access: "ADMIN", token, user: { id: user.id, username: user.username, role: user.role } };
    }

    const existing = await this.prisma.user.findUnique({ where: { discordId } });

    if (existing?.role === "INSTRUCTOR") {
      const user = await this.prisma.user.update({
        where: { discordId },
        data: { username, email: email ?? undefined, avatar: avatar ?? undefined },
      });
      const token = await this.jwt.signAsync({ sub: user.id, discordId, role: user.role });
      return { phase: "OK", access: "INSTRUCTOR", token, user: { id: user.id, username: user.username, role: user.role } };
    }

    if (existing?.role === "ADMIN") {
      const user = await this.prisma.user.update({
        where: { discordId },
        data: { username, email: email ?? undefined, avatar: avatar ?? undefined },
      });
      const token = await this.jwt.signAsync({ sub: user.id, discordId, role: user.role });
      return { phase: "OK", access: "ADMIN", token, user: { id: user.id, username: user.username, role: user.role } };
    }

    const registration = await this.prisma.instructorRegistration.findUnique({ where: { discordId } });
    if (!registration) {
      return { phase: "NEED_REGISTER" };
    }

    await this.prisma.user.upsert({
      where: { discordId },
      update: {
        username,
        email: email ?? undefined,
        avatar: avatar ?? undefined,
      },
      create: {
        discordId,
        username,
        email: email ?? undefined,
        avatar: avatar ?? undefined,
        role: "USER",
      },
    });

    return { phase: "WAITING_APPROVAL" };
  }

  /**
   * Legado: apenas cargo Admin no Discord (sem fluxo de instrutor).
   */
  @Post("discord/exchange")
  @SkipThrottle()
  async exchange(@Body() body: unknown) {
    const parsed = DiscordSessionSchema.safeParse(body);
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
