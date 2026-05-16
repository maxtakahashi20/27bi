"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/contexts/admin-auth";

type Settings = {
  adminPasswordConfigured: boolean;
  emailEnabled: boolean;
  discordWebhook: boolean;
  discordDm: boolean;
  guildConfigured: boolean;
};

export default function AdminSettingsPage() {
  const { apiHeaders } = useAdminAuth();
  const [s, setS] = useState<Settings | null>(null);

  useEffect(() => {
    if (!apiHeaders) return;
    api.get("/admin/settings", { headers: apiHeaders }).then((r) => setS(r.data));
  }, [apiHeaders]);

  const Flag = ({ ok, label }: { ok: boolean; label: string }) => (
    <div className="flex items-center justify-between py-2 border-b border-olive-900/40 text-sm">
      <span className="text-olive-200/90">{label}</span>
      <span className={ok ? "text-green-400 text-xs" : "text-amber-400 text-xs"}>{ok ? "Ativo" : "Inativo"}</span>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-olive-50">Configurações</h1>
        <p className="text-sm text-olive-200/70 mt-1">Estado das integrações configuradas via variáveis de ambiente no backend.</p>
      </div>

      <div className="rounded-lg border border-olive-800/60 bg-ink-800/50 p-6 space-y-1">
        <h2 className="font-display text-lg text-olive-100 mb-4">Integrações</h2>
        {s ? (
          <>
            <Flag ok={s.adminPasswordConfigured} label="Painel — senha ADMIN_PASSWORD (backend)" />
            <Flag ok={s.guildConfigured} label="Discord — Guild + cargo (login OAuth legado)" />
            <Flag ok={s.discordWebhook} label="Discord — Webhook de notificações" />
            <Flag ok={s.discordDm} label="Discord — Bot token (DM)" />
            <Flag ok={s.emailEnabled} label="Email transacional (Resend)" />
          </>
        ) : (
          <p className="text-olive-200/50 text-sm">Carregando...</p>
        )}
      </div>

      <div className="rounded-lg border border-olive-800/40 bg-ink-950/40 p-6 text-xs text-olive-200/70 space-y-3 leading-relaxed">
        <p>
          O acesso ao painel <code className="text-olive-300">/admin</code> usa a senha definida em{" "}
          <code className="text-olive-300">ADMIN_PASSWORD</code> no backend (mínimo 8 caracteres). O JWT fica no{" "}
          <code className="text-olive-300">sessionStorage</code> do navegador até você sair ou limpar o site.
        </p>
        <p>
          Configure <code className="text-olive-300">RESEND_API_KEY</code> e <code className="text-olive-300">EMAIL_FROM</code> no
          backend para envio de emails em aprovações/reprovações.
        </p>
        <p>
          O webhook do Discord recebe embeds de novos alistamentos e mudanças de status. O bot precisa de permissão para enviar DM ao
          usuário (ID numérico salvo na inscrição).
        </p>
      </div>
    </div>
  );
}
