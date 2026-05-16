"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/contexts/admin-auth";
import type { ApplicationDto, CourseDto } from "@/types/models";
import { INSTITUTION_OPTIONS } from "@/lib/institutions";
import { toast } from "sonner";

const institutionEnum = z.enum([
  "POLICIA_MILITAR",
  "GUARDA_CIVIL",
  "POLICIA_FEDERAL",
  "POLICIA_CIVIL",
  "EXERCITO",
  "OUTRO",
]);

const schema = z.object({
  fullName: z.string().min(3),
  rg: z.string().regex(/^\d{6}$/, "6 dígitos"),
  phone: z.string().regex(/^\d{6}$/, "6 dígitos"),
  discordTag: z.string().min(2),
  institution: institutionEnum,
  courseId: z.string().min(1),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

type Form = z.infer<typeof schema>;

export default function AdminApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { apiHeaders, jwtRole } = useAdminAuth();
  const readOnly = jwtRole === "INSTRUCTOR";
  const [app, setApp] = useState<ApplicationDto | null>(null);
  const [courses, setCourses] = useState<CourseDto[]>([]);

  const form = useForm<Form>({ defaultValues: {} as Form });

  useEffect(() => {
    if (!apiHeaders || !id) return;
    Promise.all([
      api.get(`/admin/applications/${id}`, { headers: apiHeaders }),
      api.get<CourseDto[]>("/courses"),
    ])
      .then(([a, c]) => {
        setApp(a.data);
        setCourses(c.data ?? []);
        form.reset({
          fullName: a.data.fullName,
          rg: a.data.rg.replace(/\D/g, "").slice(0, 6),
          phone: a.data.phone.replace(/\D/g, "").slice(0, 6),
          discordTag: a.data.discordTag,
          institution: institutionEnum.safeParse(a.data.institution).success
            ? (a.data.institution as Form["institution"])
            : "OUTRO",
          courseId: a.data.courseId,
          status: a.data.status,
        });
      })
      .catch(() => {
        toast.error("Inscrição não encontrada");
        router.push("/admin/applications");
      });
  }, [apiHeaders, id, router, form]);

  const onSave = async (raw: Form) => {
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error("Verifique os campos obrigatórios");
      return;
    }
    const data = parsed.data;
    try {
      await api.patch(`/admin/applications/${id}`, data, { headers: apiHeaders });
      toast.success("Inscrição atualizada");
    } catch {
      toast.error("Falha ao salvar");
    }
  };

  if (!app) return <div className="text-olive-200/70">Carregando...</div>;

  const fieldClass =
    "bg-ink-900 border border-olive-800 rounded px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <button type="button" onClick={() => router.back()} className="text-xs text-olive-400 hover:text-olive-200 mb-2">
          ← Voltar
        </button>
        <h1 className="font-display text-3xl text-olive-50">Detalhe da inscrição</h1>
        <p className="text-xs text-olive-200/50 mt-1">ID: {app.id}</p>
        {readOnly && (
          <p className="mt-3 text-sm text-amber-200/90 bg-amber-950/30 border border-amber-800/50 rounded-lg px-3 py-2">
            Modo leitura (instrutor): visualização completa. Somente administradores podem editar ou excluir.
          </p>
        )}
      </div>

      <form
        onSubmit={readOnly ? (e) => e.preventDefault() : form.handleSubmit(onSave)}
        className="space-y-4 bg-ink-800/50 border border-olive-800/50 rounded-lg p-6 grid md:grid-cols-2 gap-4 text-sm"
      >
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-olive-300/80">Nome completo</span>
          <input {...form.register("fullName")} disabled={readOnly} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-olive-300/80">RG (6 dígitos)</span>
          <input {...form.register("rg")} disabled={readOnly} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-olive-300/80">Telefone (6 dígitos)</span>
          <input {...form.register("phone")} disabled={readOnly} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-olive-300/80">Discord (usuário)</span>
          <input {...form.register("discordTag")} disabled={readOnly} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-olive-300/80">Guarnição / órgão</span>
          <select {...form.register("institution")} disabled={readOnly} className={fieldClass}>
            {INSTITUTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-olive-300/80">Curso</span>
          <select {...form.register("courseId")} disabled={readOnly} className={fieldClass}>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-olive-300/80">Status</span>
          <select {...form.register("status")} disabled={readOnly} className={fieldClass}>
            <option value="PENDING">PENDENTE</option>
            <option value="APPROVED">APROVADO</option>
            <option value="REJECTED">REPROVADO</option>
          </select>
        </label>
        {!readOnly && (
          <div className="md:col-span-2 flex justify-end gap-2 pt-4">
            <button type="submit" className="px-6 py-2 rounded bg-olive-700 text-olive-50 font-semibold">
              Salvar alterações
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
