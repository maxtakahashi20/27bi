"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, FileText, RotateCcw, Trash2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/contexts/admin-auth";
import type { ApplicationDto } from "@/types/models";
import { toast } from "sonner";

export default function AdminApplicationsPage() {
  const { apiHeaders, jwtRole } = useAdminAuth();
  const canDelete = jwtRole === "ADMIN";
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<ApplicationDto[]>([]);
  const pageSize = 15;

  useEffect(() => {
    if (!apiHeaders) return;
    const handle = setTimeout(() => {
      api
        .get("/admin/applications", {
          headers: apiHeaders,
          params: { q: q || undefined, status: status || undefined, page, pageSize },
        })
        .then((r) => {
          setItems(r.data.items);
          setTotal(r.data.total);
        })
        .catch(() => toast.error("Erro ao carregar inscrições"));
    }, q ? 320 : 0);
    return () => clearTimeout(handle);
  }, [apiHeaders, q, status, page]);

  useEffect(() => {
    setPage(1);
  }, [q, status]);

  const update = async (id: string, st: string) => {
    try {
      await api.patch(`/admin/applications/${id}`, { status: st }, { headers: apiHeaders });
      toast.success("Atualizado");
      setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status: st as ApplicationDto["status"] } : a)));
    } catch {
      toast.error("Falha ao atualizar");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir esta inscrição permanentemente?")) return;
    try {
      await api.delete(`/admin/applications/${id}`, { headers: apiHeaders });
      toast.success("Removido");
      setItems((prev) => prev.filter((a) => a.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch {
      toast.error("Falha ao excluir");
    }
  };

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-olive-50">Inscrições</h1>
          <p className="text-sm text-olive-200/70 mt-1">Filtros, busca e ações em massa por linha.</p>
        </div>
        <p className="text-xs text-olive-400">{total} registro(s)</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          placeholder="Buscar nome, email ou Discord..."
          className="flex-1 bg-ink-900 border border-olive-800 rounded px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="bg-ink-900 border border-olive-800 rounded px-3 py-2 text-sm md:w-48"
        >
          <option value="">Todos os status</option>
          <option value="PENDING">Pendente</option>
          <option value="APPROVED">Aprovado</option>
          <option value="REJECTED">Reprovado</option>
        </select>
      </div>

      <div className="rounded-lg border border-olive-800/60 overflow-hidden bg-ink-800/40">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-olive-400 border-b border-olive-800/60">
              <tr>
                <th className="p-3">Nome</th>
                <th className="p-3">Discord</th>
                <th className="p-3">Curso</th>
                <th className="p-3">Data</th>
                <th className="p-3">Status</th>
                <th className="p-3 w-14 text-center">Ficha</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-t border-olive-900/40 hover:bg-ink-700/30">
                  <td className="p-3">
                    <Link href={`/admin/applications/${a.id}`} className="text-olive-100 hover:underline font-medium">
                      {a.fullName}
                    </Link>
                    <div className="text-xs text-olive-200/50">{a.email}</div>
                  </td>
                  <td className="p-3 text-olive-200/90">{a.discordTag}</td>
                  <td className="p-3 text-olive-200/80">{a.course?.name}</td>
                  <td className="p-3 text-olive-200/60 text-xs whitespace-nowrap">
                    {new Date(a.createdAt).toLocaleString("pt-BR")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded border ${
                        a.status === "APPROVED"
                          ? "border-green-700 text-green-300"
                          : a.status === "REJECTED"
                            ? "border-red-700 text-red-300"
                            : "border-olive-600 text-olive-200"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <Link
                      href={`/admin/applications/${a.id}`}
                      title="Ver formulário completo"
                      aria-label="Ver formulário completo"
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-olive-700 text-olive-200 hover:bg-ink-700/50 hover:text-olive-50"
                    >
                      <FileText className="h-4 w-4" aria-hidden />
                    </Link>
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex flex-wrap items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => update(a.id, "APPROVED")}
                        title="Aprovar"
                        aria-label="Aprovar inscrição"
                        className="inline-flex h-9 w-9 items-center justify-center rounded border border-green-800 text-green-300 hover:bg-green-950/40"
                      >
                        <Check className="h-4 w-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => update(a.id, "REJECTED")}
                        title="Reprovar"
                        aria-label="Reprovar inscrição"
                        className="inline-flex h-9 w-9 items-center justify-center rounded border border-red-800 text-red-300 hover:bg-red-950/30"
                      >
                        <XCircle className="h-4 w-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => update(a.id, "PENDING")}
                        title="Marcar como pendente"
                        aria-label="Marcar como pendente"
                        className="inline-flex h-9 w-9 items-center justify-center rounded border border-olive-700 text-olive-200 hover:bg-ink-700/50"
                      >
                        <RotateCcw className="h-4 w-4" aria-hidden />
                      </button>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => remove(a.id)}
                          title="Excluir permanentemente"
                          aria-label="Excluir inscrição"
                          className="inline-flex h-9 w-9 items-center justify-center rounded border border-red-950 text-red-400 hover:bg-red-950/25"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-olive-200/50">
                    Nenhuma inscrição encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-3 border-t border-olive-800/50 text-xs">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded border border-olive-800 disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-olive-300">
            Página {page} / {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="px-3 py-1 rounded border border-olive-800 disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
