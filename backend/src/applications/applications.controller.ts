import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { z } from "zod";
import { PrismaService } from "../common/prisma.service";
import { sanitizeText } from "../common/sanitize";
import { DiscordService } from "../discord/discord.service";

const sixDigits = z
  .string()
  .transform((s) => s.replace(/\D/g, ""))
  .refine((s) => /^\d{6}$/.test(s), "Informe exatamente 6 dígitos numéricos");

const InstitutionEnum = z.enum([
  "POLICIA_MILITAR",
  "GUARDA_CIVIL",
  "POLICIA_FEDERAL",
  "POLICIA_CIVIL",
  "EXERCITO",
  "OUTRO",
]);

const Schema = z.object({
  fullName: z.string().min(3).max(120),
  rg: sixDigits,
  phone: sixDigits,
  discordTag: z
    .string()
    .min(2)
    .max(64)
    .transform((s) => s.replace(/^@+/, "").trim()),
  institution: InstitutionEnum,
  courseId: z.string().min(1),
});

@Controller("applications")
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 30, ttl: 60_000 } })
export class ApplicationsController {
  constructor(private prisma: PrismaService, private discord: DiscordService) {}

  @Post()
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  async create(@Body() body: unknown) {
    const parsed = Schema.safeParse(body);
    if (!parsed.success) throw new HttpException(parsed.error.format(), HttpStatus.BAD_REQUEST);

    const d = parsed.data;
    const fullName = sanitizeText(d.fullName, 120);
    const rg = sanitizeText(d.rg, 12);
    const phone = sanitizeText(d.phone, 12);
    const discordTag = sanitizeText(d.discordTag, 64);
    const institution = d.institution;

    const course = await this.prisma.course.findUnique({ where: { id: d.courseId } });
    if (!course) throw new HttpException("Curso inválido", HttpStatus.BAD_REQUEST);

    const app = await this.prisma.application.create({
      data: {
        fullName,
        rg,
        phone,
        discordTag,
        institution,
        desiredCourse: course.name,
        courseId: d.courseId,
      },
      include: { course: true },
    });

    await this.discord.sendWebhook(undefined, [
      {
        title: "Nova inscrição — Curso de Paraquedista",
        color: 0x3d4f2f,
        fields: [
          { name: "Nome", value: app.fullName, inline: true },
          { name: "Curso", value: app.course.name, inline: true },
          { name: "RG (6 dígitos)", value: app.rg, inline: true },
          { name: "Telefone (6 dígitos)", value: app.phone, inline: true },
          { name: "Discord", value: app.discordTag, inline: true },
          { name: "Guarnição", value: app.institution, inline: true },
        ],
        footer: { text: `ID ${app.id}` },
        timestamp: new Date().toISOString(),
      },
    ]);

    const admins = await this.prisma.user.findMany({ where: { role: "ADMIN" } });
    await Promise.all(
      admins.map((u) =>
        this.prisma.notification.create({
          data: {
            userId: u.id,
            type: "NEW_APPLICATION",
            message: `Nova inscrição: ${app.fullName} — ${app.course.name}`,
          },
        }),
      ),
    );

    return { ok: true, id: app.id };
  }
}
