import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { z } from "zod";
import { PrismaService } from "../common/prisma.service";
import { sanitizeText } from "../common/sanitize";
import { DiscordService } from "../discord/discord.service";

const Schema = z.object({
  fullName: z.string().min(3).max(120),
  age: z.coerce.number().int().min(17).max(60),
  cpf: z
    .string()
    .transform((s) => s.replace(/\D/g, ""))
    .refine((s) => s.length >= 11 && s.length <= 14, "CPF inválido"),
  discordTag: z.string().min(2).max(64),
  discordUserId: z.preprocess(
    (v) => (typeof v === "string" && !v.trim() ? undefined : v),
    z.string().max(32).optional(),
  ),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(40),
  courseId: z.string().min(1),
  experience: z.string().max(2000).optional(),
  motivation: z.string().min(10).max(2000),
  acceptedTerms: z.literal(true),
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
    const cpf = sanitizeText(d.cpf, 14);
    const discordTag = sanitizeText(d.discordTag, 64);
    const email = sanitizeText(d.email.toLowerCase(), 120);
    const phone = sanitizeText(d.phone, 20);
    const city = sanitizeText(d.city, 80);
    const state = sanitizeText(d.state, 40).toUpperCase();
    const motivation = sanitizeText(d.motivation, 2000);
    const experience = d.experience ? sanitizeText(d.experience, 2000) : null;
    const fromField = this.discord.parseDiscordUserId(d.discordUserId);
    const fromTag = this.discord.parseDiscordUserId(discordTag);
    const discordUserId = fromField ?? fromTag;

    const course = await this.prisma.course.findUnique({ where: { id: d.courseId } });
    if (!course) throw new HttpException("Curso inválido", HttpStatus.BAD_REQUEST);

    const app = await this.prisma.application.create({
      data: {
        fullName,
        age: d.age,
        cpf,
        discordTag,
        discordUserId,
        email,
        phone,
        city,
        state,
        desiredCourse: course.name,
        experience,
        motivation,
        acceptedTerms: true,
        courseId: d.courseId,
      },
      include: { course: true },
    });

    await this.discord.sendWebhook(undefined, [
      {
        title: "Novo alistamento — 27º BI Pqdt",
        color: 0x3d4f2f,
        fields: [
          { name: "Nome", value: app.fullName, inline: true },
          { name: "Curso", value: app.course.name, inline: true },
          { name: "Idade", value: String(app.age), inline: true },
          { name: "Discord", value: app.discordTag, inline: true },
          { name: "Email", value: app.email, inline: true },
          { name: "Local", value: `${app.city} / ${app.state}`, inline: true },
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
