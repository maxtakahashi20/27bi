"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import { submitEnlistment } from "@/services/applications";
import { api } from "@/lib/api";

const schema = z.object({
  fullName: z.string().min(3, "Nome obrigatório"),
  age: z.coerce.number().int().min(17).max(60),
  cpf: z
    .string()
    .transform((s) => s.replace(/\D/g, ""))
    .refine((s) => s.length >= 11 && s.length <= 14, "CPF inválido"),
  discordTag: z.string().min(2),
  discordUserId: z.preprocess(
    (v) => (typeof v === "string" && !v.trim() ? undefined : v),
    z.string().max(32).optional(),
  ),
  email: z.string().email(),
  phone: z.string().min(8),
  city: z.string().min(2),
  state: z.string().min(2),
  courseId: z.string().min(1, "Selecione um curso"),
  experience: z.string().optional(),
  motivation: z.string().min(10, "Conte um pouco mais"),
  acceptedTerms: z.literal(true, { errorMap: () => ({ message: "Aceite os termos" }) }),
});
type FormData = z.infer<typeof schema>;

const inputClass =
  "rounded-none border border-gold/40 bg-tactical px-3 py-2.5 font-body text-sm text-ice placeholder:text-ice/35 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

export function EnlistDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    if (open) {
      clearErrors();
      api.get("/courses").then((r) => setCourses(r.data ?? [])).catch(() => setCourses([]));
    }
  }, [open, clearErrors]);

  if (!open) return null;

  const onSubmit = async (data: FormData) => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      for (const [key, msgs] of Object.entries(fieldErrors)) {
        const msg = msgs?.[0];
        if (msg) setError(key as keyof FormData, { type: "manual", message: msg });
      }
      const first = Object.values(fieldErrors).flat().find(Boolean);
      const formMsgs = parsed.error.flatten().formErrors;
      toast.error(first ?? formMsgs[0] ?? "Verifique os campos");
      return;
    }
    try {
      await submitEnlistment(parsed.data);
      toast.success("Alistamento enviado! Aguarde contato.");
      reset();
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao enviar");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm md:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enlist-title"
        className="my-8 w-full max-w-2xl border-2 border-gold/50 bg-ink-800 shadow-tactical"
      >
        <div className="flex items-center justify-between border-b border-gold/30 px-6 py-4">
          <h3 id="enlist-title" className="font-display text-2xl uppercase tracking-[0.12em] text-ice">
            Ficha de alistamento
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="border border-gold/30 p-2 text-gold transition hover:border-gold hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 px-6 py-6 text-sm md:grid-cols-2">
          {[
            ["fullName", "Nome completo", "text", "md:col-span-2"],
            ["age", "Idade", "number"],
            ["cpf", "CPF (11 dígitos)", "text"],
            ["discordTag", "Discord (ex: usuario ou usuario#0)", "text"],
            ["discordUserId", "ID Discord (opcional, para DM — modo desenvolvedor)", "text"],
            ["email", "Email", "email"],
            ["phone", "Telefone", "tel"],
            ["city", "Cidade", "text"],
            ["state", "Estado (UF)", "text"],
          ].map(([name, label, type, span]) => (
            <label key={name as string} className={`flex flex-col gap-1.5 ${span ?? ""}`}>
              <span className="font-subtitle text-[10px] uppercase tracking-[0.2em] text-gold/90">{label as string}</span>
              <input type={type as string} {...register(name as any)} className={inputClass} />
              {errors[name as keyof FormData] && (
                <span className="text-xs text-bravery">{(errors as any)[name]?.message}</span>
              )}
            </label>
          ))}

          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className="font-subtitle text-[10px] uppercase tracking-[0.2em] text-gold/90">Curso desejado</span>
            <select {...register("courseId")} className={inputClass}>
              <option value="">Selecione...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.courseId && <span className="text-xs text-bravery">{errors.courseId.message}</span>}
          </label>

          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className="font-subtitle text-[10px] uppercase tracking-[0.2em] text-gold/90">
              Experiência anterior (opcional)
            </span>
            <textarea rows={2} {...register("experience")} className={inputClass} />
          </label>

          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className="font-subtitle text-[10px] uppercase tracking-[0.2em] text-gold/90">Motivação</span>
            <textarea rows={3} {...register("motivation")} className={inputClass} placeholder="Mínimo 10 caracteres" />
            {errors.motivation && <span className="text-xs text-bravery">{errors.motivation.message}</span>}
          </label>

          <label className="flex items-start gap-3 md:col-span-2">
            <input type="checkbox" {...register("acceptedTerms")} className="mt-1 h-4 w-4 rounded-none border-gold text-gold focus:ring-gold" />
            <span className="font-body text-sm text-ice/75">
              Declaro que as informações são verdadeiras e aceito os termos de alistamento.
            </span>
          </label>
          {errors.acceptedTerms && (
            <span className="md:col-span-2 text-xs text-bravery">{errors.acceptedTerms.message}</span>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-gold/20 pt-6 md:col-span-2 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="border border-gold/40 px-6 py-2.5 font-subtitle text-[10px] uppercase tracking-[0.25em] text-ice transition hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="border-2 border-gold bg-gold px-8 py-2.5 font-subtitle text-[10px] uppercase tracking-[0.28em] text-tactical transition hover:bg-transparent hover:text-gold disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {isSubmitting ? "Enviando…" : "Enviar alistamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
