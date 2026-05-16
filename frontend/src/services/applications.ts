const schemaFields = {
  fullName: "",
  age: 18,
  cpf: "",
  discordTag: "",
  discordUserId: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  courseId: "",
  experience: "",
  motivation: "",
  acceptedTerms: false as boolean,
};

export type EnlistmentPayload = typeof schemaFields;

export async function submitEnlistment(payload: Record<string, unknown>) {
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
