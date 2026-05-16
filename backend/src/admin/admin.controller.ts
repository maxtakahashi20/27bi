import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import type { Request } from "express";
import { z } from "zod";
import { AdminGuard } from "../common/admin.guard";
import { PrismaService } from "../common/prisma.service";
import { sanitizeText } from "../common/sanitize";
import { DiscordService } from "../discord/discord.service";
import { EmailService } from "../email/email.service";

const StatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);

const PatchStatusSchema = z.object({
  status: StatusEnum.optional(),
  fullName: z.string().min(3).max(120).optional(),
  age: z.coerce.number().int().min(17).max(60).optional(),
  cpf: z.string().min(11).max(14).optional(),
  discordTag: z.string().min(2).max(64).optional(),
  discordUserId: z.string().max(32).nullable().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(8).max(20).optional(),
  city: z.string().min(2).max(80).optional(),
  state: z.string().min(2).max(40).optional(),
  motivation: z.string().min(10).max(2000).optional(),
  experience: z.string().max(2000).nullable().optional(),
  courseId: z.string().min(1).optional(),
});

@UseGuards(AdminGuard)
@Controller("admin")
export class AdminController {
  constructor(
    private prisma: PrismaService,
    private discord: DiscordService,
    private email: EmailService,
  ) {}

  @Get("settings")
  settings() {
    const p = process.env.ADMIN_PASSWORD;
    return {
      adminPasswordConfigured: Boolean(p && p.length >= 8),
      emailEnabled: this.email.isConfigured(),
      discordWebhook: Boolean(process.env.DISCORD_WEBHOOK_URL),
      discordDm: Boolean(process.env.DISCORD_BOT_TOKEN),
      guildConfigured: Boolean(process.env.DISCORD_GUILD_ID && process.env.DISCORD_ADMIN_ROLE_ID),
    };
  }

  @Get("notifications")
  async notifications(@Req() req: Request) {
    const sub = req.user?.sub;
    if (!sub) return [];
    return this.prisma.notification.findMany({
      where: { userId: sub },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  @Post("notifications/:id/read")
  async markNotificationRead(@Req() req: Request, @Param("id") id: string) {
    const sub = req.user?.sub;
    if (!sub) throw new HttpException("Sem usuário", HttpStatus.UNAUTHORIZED);
    await this.prisma.notification.updateMany({
      where: { id, userId: sub },
      data: { read: true },
    });
    return { ok: true };
  }

  @Get("logs")
  async logs(@Query("page") page = "1", @Query("pageSize") pageSize = "30") {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const ps = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 30));
    const [items, total] = await Promise.all([
      this.prisma.log.findMany({
        skip: (p - 1) * ps,
        take: ps,
        orderBy: { createdAt: "desc" },
        include: { admin: { select: { username: true, id: true } } },
      }),
      this.prisma.log.count(),
    ]);
    return { items, total, page: p, pageSize: ps };
  }

  @Get("stats")
  async stats() {
    const [total, pending, approved, rejected, byCourse, latest, courses] = await Promise.all([
      this.prisma.application.count(),
      this.prisma.application.count({ where: { status: "PENDING" } }),
      this.prisma.application.count({ where: { status: "APPROVED" } }),
      this.prisma.application.count({ where: { status: "REJECTED" } }),
      this.prisma.application.groupBy({
        by: ["courseId"],
        _count: { _all: true },
      }),
      this.prisma.application.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { course: true } }),
      this.prisma.course.findMany({ select: { id: true, name: true } }),
    ]);
    const courseTitles = Object.fromEntries(courses.map((c) => [c.id, c.name]));
    const byCourseSorted = [...byCourse].sort((a, b) => b._count._all - a._count._all);
    const byCourseEnriched = byCourseSorted.map((row) => ({
      courseId: row.courseId,
      title: courseTitles[row.courseId] ?? row.courseId,
      count: row._count._all,
    }));
    return { total, pending, approved, rejected, byCourse: byCourseEnriched, latest };
  }

  @Get("applications")
  async list(
    @Query("q") q?: string,
    @Query("courseId") courseId?: string,
    @Query("status") status?: string,
    @Query("page") page = "1",
    @Query("pageSize") pageSize = "20",
  ) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const ps = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 20));
    const statusParsed = StatusEnum.safeParse(status);
    const where: Prisma.ApplicationWhereInput = {
      ...(q
        ? {
            OR: [
              { fullName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { discordTag: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(courseId ? { courseId } : {}),
      ...(statusParsed.success ? { status: statusParsed.data } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        include: { course: true },
        orderBy: { createdAt: "desc" },
        skip: (p - 1) * ps,
        take: ps,
      }),
      this.prisma.application.count({ where }),
    ]);
    return { items, total, page: p, pageSize: ps };
  }

  @Get("applications/:id")
  async one(@Param("id") id: string) {
    const app = await this.prisma.application.findUnique({ where: { id }, include: { course: true } });
    if (!app) throw new HttpException("Não encontrado", HttpStatus.NOT_FOUND);
    return app;
  }

  @Patch("applications/:id")
  async update(@Req() req: Request, @Param("id") id: string, @Body() body: unknown) {
    const parsed = PatchStatusSchema.safeParse(body);
    if (!parsed.success) throw new HttpException(parsed.error.format(), HttpStatus.BAD_REQUEST);
    const prev = await this.prisma.application.findUnique({ where: { id }, include: { course: true } });
    if (!prev) throw new HttpException("Não encontrado", HttpStatus.NOT_FOUND);

    const b = parsed.data;
    const data: Prisma.ApplicationUpdateInput = {};

    if (b.status !== undefined) data.status = b.status;
    if (b.fullName !== undefined) data.fullName = sanitizeText(b.fullName, 120);
    if (b.age !== undefined) data.age = b.age;
    if (b.cpf !== undefined) data.cpf = sanitizeText(b.cpf.replace(/\D/g, ""), 14);
    if (b.discordTag !== undefined) data.discordTag = sanitizeText(b.discordTag, 64);
    if (b.discordUserId !== undefined) {
      data.discordUserId = b.discordUserId ? this.discord.parseDiscordUserId(b.discordUserId) : null;
    }
    if (b.email !== undefined) data.email = sanitizeText(b.email.toLowerCase(), 120);
    if (b.phone !== undefined) data.phone = sanitizeText(b.phone, 20);
    if (b.city !== undefined) data.city = sanitizeText(b.city, 80);
    if (b.state !== undefined) data.state = sanitizeText(b.state, 40).toUpperCase();
    if (b.motivation !== undefined) data.motivation = sanitizeText(b.motivation, 2000);
    if (b.experience !== undefined) data.experience = b.experience === null ? null : sanitizeText(b.experience, 2000);

    if (b.courseId !== undefined) {
      const course = await this.prisma.course.findUnique({ where: { id: b.courseId } });
      if (!course) throw new HttpException("Curso inválido", HttpStatus.BAD_REQUEST);
      data.course = { connect: { id: b.courseId } };
      data.desiredCourse = course.name;
    }

    const app = await this.prisma.application.update({
      where: { id },
      data,
      include: { course: true },
    });

    const adminId = req.user?.sub;
    const statusChanged = b.status !== undefined && b.status !== prev.status;

    await this.prisma.log.create({
      data: {
        adminId,
        action: statusChanged ? `APPLICATION_${b.status}` : "APPLICATION_UPDATE",
        targetId: id,
      },
    });

    if (statusChanged && (b.status === "APPROVED" || b.status === "REJECTED")) {
      await this.discord.sendWebhook(undefined, [
        {
          title: `Inscrição ${b.status === "APPROVED" ? "aprovada" : "reprovada"}`,
          color: b.status === "APPROVED" ? 0x2d6a4f : 0x9b2226,
          description: `**${app.fullName}** — ${app.course.name}`,
          footer: { text: `ID ${app.id}` },
        },
      ]);

      const dmId = app.discordUserId ?? this.discord.parseDiscordUserId(app.discordTag);
      const msg =
        b.status === "APPROVED"
          ? `Sua inscrição no **27º BI Pqdt** (${app.course.name}) foi **aprovada**. Aguarde contato da coordenação.`
          : `Sua inscrição no **27º BI Pqdt** (${app.course.name}) foi **reprovada**. Em caso de dúvidas, procure o setor de recrutamento no Discord oficial.`;
      if (dmId) await this.discord.sendDM(dmId, msg);

      const subject =
        b.status === "APPROVED" ? "Inscrição aprovada — 27º BI Pqdt" : "Atualização da inscrição — 27º BI Pqdt";
      await this.email.sendTransactional(
        app.email,
        subject,
        `<p>Olá, <strong>${app.fullName}</strong>.</p><p>${msg}</p><p><small>27º Batalhão de Infantaria Paraquedista</small></p>`,
      );
    }

    return app;
  }

  @Delete("applications/:id")
  async remove(@Req() req: Request, @Param("id") id: string) {
    await this.prisma.application.delete({ where: { id } });
    await this.prisma.log.create({
      data: { adminId: req.user?.sub, action: "APPLICATION_DELETE", targetId: id },
    });
    return { ok: true };
  }
}
