import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  fullName: z.string().min(3).max(120),
  age: z.coerce.number().int().min(17).max(60),
  cpf: z
    .string()
    .transform((s) => s.replace(/\D/g, ""))
    .refine((s) => s.length >= 11 && s.length <= 14, "CPF inválido"),
  discordTag: z.string().min(2).max(64),
  discordUserId: z.string().max(32).optional(),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(40),
  courseId: z.string().min(1),
  experience: z.string().max(2000).optional(),
  motivation: z.string().min(10).max(2000),
  acceptedTerms: z.literal(true),
});

function assertAllowedOrigin(req: NextRequest): boolean {
  const allowed = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  if (origin && !origin.startsWith(allowed.replace(/\/$/, ""))) return false;
  if (referer && !referer.startsWith(allowed.replace(/\/$/, ""))) return false;
  return true;
}

export async function POST(req: NextRequest) {
  if (!assertAllowedOrigin(req)) {
    return NextResponse.json({ message: "Origem da requisição não permitida." }, { status: 403 });
  }

  const ip = req.ip ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!checkRateLimit(`enlist:${ip}`, 8, 60_000)) {
    return NextResponse.json({ message: "Muitas inscrições neste minuto. Tente novamente em instantes." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "JSON inválido" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const base =
    process.env.BACKEND_INTERNAL_URL?.replace(/\/$/, "") ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:3333/api";

  const res = await fetch(`${base}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
