"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/contexts/admin-auth";
import type { AdminStats } from "@/types/models";

export default function AdminDashboardPage() {
  const { apiHeaders } = useAdminAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    if (!apiHeaders) return;
    api.get("/admin/stats", { headers: apiHeaders }).then((r) => setStats(r.data));
  }, [apiHeaders]);

  const maxBar = Math.max(1, ...(stats?.byCourse.map((b) => b.count) ?? [1]));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl text-olive-50">Dashboard</h1>
        <p className="mt-1 text-sm text-olive-200/70">Visão geral das inscrições e cursos.</p>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ["Total", stats?.total ?? "—"],
          ["Pendentes", stats?.pending ?? "—"],
          ["Aprovados", stats?.approved ?? "—"],
          ["Reprovados", stats?.rejected ?? "—"],
        ].map(([k, v], i) => (
          <motion.div
            key={k as string}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg border border-olive-800/60 bg-ink-800/80 p-5"
          >
            <p className="text-[10px] tracking-[0.25em] text-olive-400">{k}</p>
            <p className="mt-2 font-display text-3xl text-olive-100">{v as any}</p>
          </motion.div>
        ))}
      </section>

      <section className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-lg border border-olive-800/60 bg-ink-800/60 p-6">
          <h2 className="font-display text-lg text-olive-100 mb-6">Inscrições por curso</h2>
          <div className="space-y-4">
            {(stats?.byCourse ?? []).map((row, i) => (
              <div key={row.courseId}>
                <div className="flex justify-between text-xs text-olive-200/80 mb-1">
                  <span className="truncate pr-2">{row.title}</span>
                  <span>{row.count}</span>
                </div>
                <div className="h-2 rounded-full bg-ink-900 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-olive-800 to-olive-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(row.count / maxBar) * 100}%` }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
            {(!stats?.byCourse || stats.byCourse.length === 0) && (
              <p className="text-sm text-olive-200/50">Sem dados ainda.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-olive-800/60 bg-ink-800/60 p-6">
          <h2 className="font-display text-lg text-olive-100 mb-4">Últimos inscritos</h2>
          <ul className="space-y-3 text-sm">
            {(stats?.latest ?? []).map((a) => (
              <li key={a.id} className="flex justify-between gap-3 border-b border-olive-900/40 pb-2">
                <span className="text-olive-100 truncate">{a.fullName}</span>
                <span className="text-olive-400 shrink-0 text-xs">{a.course?.name ?? "—"}</span>
              </li>
            ))}
            {(!stats?.latest || stats.latest.length === 0) && (
              <li className="text-olive-200/50">Nenhum registro.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
