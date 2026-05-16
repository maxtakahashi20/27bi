"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { LayoutDashboard, ListChecks, ScrollText, Settings, Shield } from "lucide-react";
import { AdminAuthProvider, AdminSignOut, useAdminAuth } from "@/contexts/admin-auth";
import { toast } from "sonner";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Inscrições", icon: ListChecks },
  { href: "/admin/logs", label: "Logs", icon: ScrollText },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

function DiscordGate() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900 px-4">
      <div className="max-w-md text-center border border-olive-800/60 rounded-lg bg-ink-800 p-8">
        <Shield className="h-10 w-10 mx-auto text-olive-400" />
        <h1 className="mt-4 font-display text-2xl text-olive-100">Painel — acesso instrutor</h1>
        <p className="mt-2 text-sm text-olive-200/80">
          Entre com Discord para se identificar e enviar o cadastro. A liberação do painel é feita manualmente no banco de dados
          (campo <strong className="text-olive-300">role</strong> = Instrutor na tabela de usuários). Depois de aprovado, recarregue
          a página.
        </p>
        <button
          type="button"
          onClick={() => signIn("discord")}
          className="mt-6 px-6 py-2 rounded bg-[#5865F2] text-white font-semibold"
        >
          Entrar com Discord
        </button>
      </div>
    </div>
  );
}

function RegisterForm() {
  const { submitRegistration, error, refreshGate } = useAdminAuth();
  const [fullName, setFullName] = useState("");
  const [rg, setRg] = useState("");
  const [phone, setPhone] = useState("");
  const [graduation, setGraduation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await submitRegistration({ fullName, rg, phone, graduation });
      toast.success("Cadastro enviado! Aguarde a aprovação no banco de dados e recarregue a página.");
    } catch {
      toast.error("Não foi possível enviar o cadastro.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900 px-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-lg border border-olive-800/60 rounded-lg bg-ink-800 p-8 space-y-4 shadow-xl shadow-black/40"
      >
        <div className="text-center">
          <Shield className="h-10 w-10 mx-auto text-olive-400" />
          <h1 className="mt-4 font-display text-2xl text-olive-100">Cadastro de instrutor</h1>
          <p className="mt-2 text-sm text-olive-200/75">
            Preencha os dados. Quando um administrador alterar sua <strong className="text-olive-300">role</strong> para{" "}
            <strong className="text-olive-300">INSTRUCTOR</strong> no banco (tabela <code className="text-olive-400/90">users</code>
            ), atualize esta página (F5) para entrar automaticamente.
          </p>
        </div>
        <label className="block text-sm text-olive-200/80">
          Nome completo
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded bg-ink-900 border border-olive-800 px-3 py-2 text-olive-50"
          />
        </label>
        <label className="block text-sm text-olive-200/80">
          RG
          <input
            required
            value={rg}
            onChange={(e) => setRg(e.target.value)}
            className="mt-1 w-full rounded bg-ink-900 border border-olive-800 px-3 py-2 text-olive-50"
          />
        </label>
        <label className="block text-sm text-olive-200/80">
          Telefone
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded bg-ink-900 border border-olive-800 px-3 py-2 text-olive-50"
          />
        </label>
        <label className="block text-sm text-olive-200/80">
          Graduação
          <input
            required
            value={graduation}
            onChange={(e) => setGraduation(e.target.value)}
            className="mt-1 w-full rounded bg-ink-900 border border-olive-800 px-3 py-2 text-olive-50"
            placeholder="Ex.: Sargento, Cabo, Subtenente..."
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded bg-olive-700 text-olive-50 font-semibold hover:bg-olive-600 disabled:opacity-50"
        >
          {submitting ? "Enviando..." : "Enviar cadastro"}
        </button>
        <p className="text-xs text-olive-200/50 text-center">
          Já enviou?{" "}
          <button type="button" className="text-olive-400 underline" onClick={() => void refreshGate()}>
            Verificar de novo
          </button>
        </p>
      </form>
    </div>
  );
}

function WaitingApproval() {
  const { refreshGate, loading } = useAdminAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900 px-4">
      <div className="max-w-lg text-center border border-olive-700/50 rounded-lg bg-ink-800 p-10">
        <Shield className="h-10 w-10 mx-auto text-amber-400" />
        <h1 className="mt-4 font-display text-xl text-olive-100">Aguardando aprovação</h1>
        <p className="mt-3 text-sm text-olive-200/85 leading-relaxed">
          Seu cadastro já está registrado. Um administrador precisa conferir os dados e, no PostgreSQL, definir na tabela{" "}
          <code className="text-olive-400/90">users</code> a coluna <strong className="text-olive-300">role</strong> como{" "}
          <strong className="text-olive-300">INSTRUCTOR</strong> para a sua conta (mesmo <code className="text-olive-400/90">discord_id</code>
          ). Depois disso, <strong className="text-olive-200">recarregue esta página</strong> (F5) ou clique abaixo.
        </p>
        <button
          type="button"
          disabled={loading}
          onClick={() => void refreshGate()}
          className="mt-6 px-6 py-2 rounded bg-olive-700 text-olive-50 font-semibold disabled:opacity-50"
        >
          {loading ? "Verificando..." : "Já fui aprovado — verificar"}
        </button>
      </div>
    </div>
  );
}

function AdminChrome({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { hydrated, authorized, gatePhase, loading, error, refreshGate } = useAdminAuth();
  const path = usePathname();

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900 text-olive-200">Carregando...</div>
    );
  }

  if (!session) {
    return <DiscordGate />;
  }

  if (authorized) {
    return (
      <div className="min-h-screen bg-ink-900 text-olive-100 flex">
      <aside className="hidden md:flex w-56 flex-col border-r border-olive-800/50 bg-ink-950/80">
        <div className="p-5 border-b border-olive-800/40 flex items-center gap-2">
          <Shield className="text-olive-400 h-5 w-5" />
          <span className="font-display text-sm tracking-[0.2em] text-olive-200">PAINEL</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = path === href || (href !== "/admin/dashboard" && path.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded px-3 py-2 text-sm transition ${
                  active ? "bg-olive-900/40 text-olive-50 border border-olive-700/50" : "text-olive-200/80 hover:bg-ink-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-olive-800/50 flex items-center justify-between px-4 md:px-8 bg-ink-950/60">
          <div className="md:hidden flex gap-2 overflow-x-auto">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-xs whitespace-nowrap px-2 py-1 rounded border ${
                  path === href ? "border-olive-500 text-olive-100" : "border-olive-800 text-olive-300"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="hidden md:block text-xs text-olive-400 tracking-widest">27º BI Pqdt — comando digital</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-olive-200/80 truncate max-w-[160px]">{(session as any).username}</span>
            <button
              type="button"
              onClick={() => signOut()}
              className="text-xs text-olive-400 hover:text-olive-200 border border-olive-800 rounded px-2 py-1"
            >
              Sair Discord
            </button>
            <AdminSignOut />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
    );
  }

  if (gatePhase === "need_register") {
    return <RegisterForm />;
  }

  if (gatePhase === "waiting_approval") {
    return <WaitingApproval />;
  }

  if (loading || gatePhase === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900 text-olive-200">
        Verificando Discord e permissões...
      </div>
    );
  }

  if (session && !authorized && gatePhase === "idle" && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900 text-olive-200">Preparando acesso...</div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ink-900 px-4 gap-4">
        <p className="text-red-400 text-center max-w-md text-sm">{error}</p>
        <button
          type="button"
          className="px-4 py-2 rounded border border-olive-700 text-olive-200"
          onClick={() => void refreshGate()}
        >
          Tentar novamente
        </button>
        <button type="button" onClick={() => void signOut()} className="text-sm text-olive-400 underline">
          Sair do Discord
        </button>
      </div>
    );
  }

  return <DiscordGate />;
}

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminChrome>{children}</AdminChrome>
    </AdminAuthProvider>
  );
}
