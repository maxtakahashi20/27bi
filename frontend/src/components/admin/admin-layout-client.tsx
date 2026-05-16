"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, ListChecks, ScrollText, Settings, Shield } from "lucide-react";
import { AdminAuthProvider, AdminSignOut, useAdminAuth } from "@/contexts/admin-auth";
import { toast } from "sonner";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Inscrições", icon: ListChecks },
  { href: "/admin/logs", label: "Logs", icon: ScrollText },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

function PasswordGate() {
  const { login, loading, error, clearError } = useAdminAuth();
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Informe a senha.");
      return;
    }
    try {
      await login(password);
      toast.success("Acesso liberado.");
      setPassword("");
    } catch {
      /* erro já em error / toast genérico */
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md border border-olive-800/60 rounded-lg bg-ink-800 p-8 space-y-5 shadow-xl shadow-black/40"
      >
        <div className="text-center">
          <Shield className="h-10 w-10 mx-auto text-olive-400" />
          <h1 className="mt-4 font-display text-2xl text-olive-100">Painel administrativo</h1>
          <p className="mt-2 text-sm text-olive-200/75">Digite a senha configurada no servidor (variável ADMIN_PASSWORD).</p>
        </div>
        <label className="block text-sm text-olive-200/80">
          Senha
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              clearError();
              setPassword(e.target.value);
            }}
            className="mt-1 w-full rounded bg-ink-900 border border-olive-800 px-3 py-2 text-olive-50 focus:outline-none focus:border-olive-500"
          />
        </label>
        {error && <p className="text-sm text-red-400/90">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded bg-olive-700 text-olive-50 font-semibold tracking-wide hover:bg-olive-600 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

function AdminChrome({ children }: { children: React.ReactNode }) {
  const { hydrated, authorized } = useAdminAuth();
  const path = usePathname();

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900 text-olive-200">
        Carregando...
      </div>
    );
  }

  if (!authorized) {
    return <PasswordGate />;
  }

  return (
    <div className="min-h-screen bg-ink-900 text-olive-100 flex">
      <aside className="hidden md:flex w-56 flex-col border-r border-olive-800/50 bg-ink-950/80">
        <div className="p-5 border-b border-olive-800/40 flex items-center gap-2">
          <Shield className="text-olive-400 h-5 w-5" />
          <span className="font-display text-sm tracking-[0.2em] text-olive-200">ADMIN</span>
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
          <div className="flex items-center gap-3 text-sm">
            <span className="text-olive-200/80 truncate max-w-[180px]">Acesso por senha</span>
            <AdminSignOut />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminChrome>{children}</AdminChrome>
    </AdminAuthProvider>
  );
}
