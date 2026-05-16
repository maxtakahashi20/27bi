"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/contexts/admin-auth";
import type { AdminLogRow, Paginated } from "@/types/models";

export default function AdminLogsPage() {
  const { apiHeaders } = useAdminAuth();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paginated<AdminLogRow> | null>(null);

  useEffect(() => {
    if (!apiHeaders) return;
    api
      .get("/admin/logs", { headers: apiHeaders, params: { page, pageSize: 25 } })
      .then((r) => setData(r.data));
  }, [apiHeaders, page]);

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-olive-50">Logs administrativos</h1>
        <p className="text-sm text-olive-200/70 mt-1">Auditoria de ações realizadas no painel.</p>
      </div>

      <div className="rounded-lg border border-olive-800/60 bg-ink-800/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-olive-400 border-b border-olive-800/60">
            <tr>
              <th className="p-3">Data</th>
              <th className="p-3">Admin</th>
              <th className="p-3">Ação</th>
              <th className="p-3">Alvo</th>
            </tr>
          </thead>
          <tbody>
            {(data?.items ?? []).map((row) => (
              <tr key={row.id} className="border-t border-olive-900/40">
                <td className="p-3 text-olive-200/70 whitespace-nowrap text-xs">
                  {new Date(row.createdAt).toLocaleString("pt-BR")}
                </td>
                <td className="p-3">{row.admin?.username ?? "—"}</td>
                <td className="p-3 font-mono text-xs text-olive-200">{row.action}</td>
                <td className="p-3 font-mono text-xs text-olive-300/80">{row.targetId ?? "—"}</td>
              </tr>
            ))}
            {(!data?.items || data.items.length === 0) && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-olive-200/50">
                  Nenhum log registrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
            Página {page} / {pages} — {data?.total ?? 0} eventos
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
