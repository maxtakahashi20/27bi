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

export function EnlistDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();

  useEffect(() => {
    if (open) api.get("/courses").then((r) => setCourses(r.data ?? [])).catch(() => setCourses([]));
  }, [open]);

  if (!open) return null;

  const onSubmit = async (data: FormData) => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error("Verifique os campos");
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded border border-olive-700/60 bg-ink-800 my-8">
        <div className="flex items-center justify-between border-b border-olive-800/60 px-6 py-4">
          <h3 className="font-display text-xl text-olive-100">Ficha de Alistamento</h3>
          <button type="button" onClick={onClose} className="text-olive-300 hover:text-olive-100">
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            ["fullName", "Nome completo", "text", "md:col-span-2"],
            ["age", "Idade", "number"],
            ["cpf", "CPF", "text"],
            ["discordTag", "Discord (ex: usuario ou usuario#0)", "text"],
            ["discordUserId", "ID Discord (opcional, para DM — modo desenvolvedor)", "text"],
            ["email", "Email", "email"],
            ["phone", "Telefone", "tel"],
            ["city", "Cidade", "text"],
            ["state", "Estado (UF)", "text"],
          ].map(([name, label, type, span]) => (
            <label key={name as string} className={`flex flex-col gap-1 ${span ?? ""}`}>
              <span className="text-olive-200/80">{label as string}</span>
              <input
                type={type as string}
                {...register(name as any)}
                className="rounded bg-ink-900 border border-olive-800 px-3 py-2 text-olive-50 focus:outline-none focus:border-olive-400"
              />
              {errors[name as keyof FormData] && (
                <span className="text-red-400 text-xs">{(errors as any)[name]?.message}</span>
              )}
            </label>
          ))}

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-olive-200/80">Curso desejado</span>
            <select {...register("courseId")} className="rounded bg-ink-900 border border-olive-800 px-3 py-2 text-olive-50">
              <option value="">Selecione...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.courseId && <span className="text-red-400 text-xs">{errors.courseId.message}</span>}
          </label>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-olive-200/80">Experiência anterior (opcional)</span>
            <textarea rows={2} {...register("experience")} className="rounded bg-ink-900 border border-olive-800 px-3 py-2 text-olive-50" />
          </label>

          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-olive-200/80">Motivação</span>
            <textarea rows={3} {...register("motivation")} className="rounded bg-ink-900 border border-olive-800 px-3 py-2 text-olive-50" />
            {errors.motivation && <span className="text-red-400 text-xs">{errors.motivation.message}</span>}
          </label>

          <label className="md:col-span-2 flex items-start gap-2 text-olive-200/80">
            <input type="checkbox" {...register("acceptedTerms")} className="mt-1" />
            <span>Declaro que as informações são verdadeiras e aceito os termos de alistamento.</span>
          </label>
          {errors.acceptedTerms && <span className="md:col-span-2 text-red-400 text-xs">{errors.acceptedTerms.message}</span>}

          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-olive-800 text-olive-200 hover:bg-ink-700">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded bg-olive-600 text-olive-50 font-semibold tracking-wider hover:bg-olive-500 disabled:opacity-50"
            >
              {isSubmitting ? "ENVIANDO..." : "ENVIAR ALISTAMENTO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
