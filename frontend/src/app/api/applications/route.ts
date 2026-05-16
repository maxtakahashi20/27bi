import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const sixDigits = z
  .string()
  .transform((s) => s.replace(/\D/g, ""))
  .refine((s) => /^\d{6}$/.test(s), "RG e telefone: exatamente 6 dígitos numéricos");

const schema = z.object({
  fullName: z.string().min(3).max(120),
  rg: sixDigits,
  phone: sixDigits,
  discordTag: z
    .string()
    .min(2)
    .max(64)
    .transform((s) => s.replace(/^@+/, "").trim()),
  institution: z.enum([
    "POLICIA_MILITAR",
    "GUARDA_CIVIL",
    "POLICIA_FEDERAL",
    "POLICIA_CIVIL",
    "EXERCITO",
    "OUTRO",
  ]),
  courseId: z.string().min(1),
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
