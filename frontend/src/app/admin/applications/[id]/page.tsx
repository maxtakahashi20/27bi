"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/contexts/admin-auth";
import type { ApplicationDto, CourseDto } from "@/types/models";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().min(3),
  age: z.coerce.number().int().min(17).max(60),
  cpf: z.string().min(11),
  discordTag: z.string().min(2),
  discordUserId: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(8),
  city: z.string().min(2),
  state: z.string().min(2),
  motivation: z.string().min(10),
  experience: z.string().optional(),
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
          age: a.data.age,
          cpf: a.data.cpf,
          discordTag: a.data.discordTag,
          discordUserId: a.data.discordUserId ?? "",
          email: a.data.email,
          phone: a.data.phone,
          city: a.data.city,
          state: a.data.state,
          motivation: a.data.motivation,
          experience: a.data.experience ?? "",
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
      await api.patch(
        `/admin/applications/${id}`,
        {
          ...data,
          discordUserId: data.discordUserId || null,
          experience: data.experience || null,
        },
        { headers: apiHeaders },
      );
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
            Modo leitura (instrutor): você vê todas as respostas do formulário. Somente administradores podem editar ou
            excluir.
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
          <span className="text-olive-300/80">Idade</span>
          <input type="number" {...form.register("age")} disabled={readOnly} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-olive-300/80">CPF</span>
          <input {...form.register("cpf")} disabled={readOnly} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-olive-300/80">Discord (tag)</span>
          <input {...form.register("discordTag")} disabled={readOnly} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-olive-300/80">Discord user ID (opcional, para DM)</span>
          <input
            {...form.register("discordUserId")}
            disabled={readOnly}
            className={fieldClass}
            placeholder="ex: 123456789012345678"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-olive-300/80">Email</span>
          <input type="email" {...form.register("email")} disabled={readOnly} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-olive-300/80">Telefone</span>
          <input {...form.register("phone")} disabled={readOnly} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-olive-300/80">Cidade</span>
          <input {...form.register("city")} disabled={readOnly} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-olive-300/80">Estado</span>
          <input {...form.register("state")} disabled={readOnly} className={fieldClass} />
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
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-olive-300/80">Experiência anterior</span>
          <textarea rows={2} {...form.register("experience")} disabled={readOnly} className={fieldClass} />
        </label>
        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-olive-300/80">Motivação</span>
          <textarea rows={3} {...form.register("motivation")} disabled={readOnly} className={fieldClass} />
        </label>
        <div className="flex flex-col gap-1">
          <span className="text-olive-300/80">Aceitou os termos</span>
          <div className={`${fieldClass} text-olive-100`}>{app.acceptedTerms ? "Sim" : "Não"}</div>
        </div>
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
