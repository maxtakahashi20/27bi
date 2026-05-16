export type EnlistmentPayload = {
  fullName: string;
  rg: string;
  phone: string;
  discordTag: string;
  institution: string;
  courseId: string;
};

export async function submitEnlistment(payload: EnlistmentPayload) {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = typeof data.message === "string" ? data.message : "Falha ao enviar inscrição";
    throw new Error(msg);
  }
  return data as { ok: boolean; id: string };
}
