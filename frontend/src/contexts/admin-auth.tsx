"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";

const STORAGE_KEY = "bip27_admin_jwt";

export type GatePhase = "idle" | "checking" | "need_register" | "waiting_approval" | "ready";

type AdminAuthState = {
  token: string | null;
  /** Role extraída do JWT (painel). */
  jwtRole: "ADMIN" | "INSTRUCTOR" | null;
  hydrated: boolean;
  gatePhase: GatePhase;
  loading: boolean;
  error: string | null;
  authorized: boolean;
  apiHeaders: Record<string, string> | undefined;
  /** Revalida Discord + banco (após aprovação no banco ou cadastrar). */
  refreshGate: () => Promise<void>;
  /** Envia cadastro de instrutor. */
  submitRegistration: (data: { fullName: string; rg: string; phone: string; graduation: string }) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthState | null>(null);

function parseJwtRole(token: string | null): "ADMIN" | "INSTRUCTOR" | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(atob(pad)) as { role?: string };
    if (payload.role === "ADMIN" || payload.role === "INSTRUCTOR") return payload.role;
    return null;
  } catch {
    return null;
  }
}

function buildDiscordPayload(session: ReturnType<typeof useSession>["data"]) {
  if (!session) return null;
  const accessToken = (session as any).discordAccessToken as string | undefined;
  const discordId = (session as any).discordId as string | undefined;
  const username = (session as any).username as string | undefined;
  if (!accessToken || !discordId || !username) return null;
  return {
    accessToken,
    discordId,
    username,
    email: session.user?.email ?? null,
    avatar: (session as any).avatar ?? null,
  };
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [gatePhase, setGatePhase] = useState<GatePhase>("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const t = sessionStorage.getItem(STORAGE_KEY);
      if (t) setToken(t);
    } finally {
      setHydrated(true);
    }
  }, []);

  const refreshGate = useCallback(async () => {
    setError(null);
    const body = buildDiscordPayload(session);
    if (!body) {
      setGatePhase("idle");
      return;
    }
    setLoading(true);
    setGatePhase("checking");
    try {
      const { data } = await api.post("/auth/instructor/gate", body);
      if (data.phase === "OK" && data.token) {
        sessionStorage.setItem(STORAGE_KEY, data.token);
        setToken(data.token);
        setGatePhase("ready");
      } else if (data.phase === "NEED_REGISTER") {
        sessionStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setGatePhase("need_register");
      } else if (data.phase === "WAITING_APPROVAL") {
        sessionStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setGatePhase("waiting_approval");
      } else {
        setGatePhase("idle");
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "Falha ao verificar acesso.";
      setError(typeof msg === "string" ? msg : "Erro ao verificar acesso.");
      sessionStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setGatePhase("idle");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!hydrated) return;
    if (status === "loading") return;
    if (status !== "authenticated") {
      setGatePhase("idle");
      return;
    }
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) {
      setToken(existing);
      setGatePhase("ready");
      return;
    }
    void refreshGate();
  }, [hydrated, status, session, refreshGate, token]);

  const submitRegistration = useCallback(
    async (data: { fullName: string; rg: string; phone: string; graduation: string }) => {
      const body = buildDiscordPayload(session);
      if (!body) throw new Error("Sessão Discord ausente.");
      setError(null);
      try {
        await api.post("/auth/instructor/register", { ...body, ...data });
        await refreshGate();
      } catch (e: any) {
        const msg = e?.response?.data?.message ?? "Falha ao enviar cadastro.";
        setError(typeof msg === "string" ? msg : "Erro ao cadastrar.");
        throw e;
      }
    },
    [session, refreshGate],
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setError(null);
    setGatePhase("idle");
  }, []);

  const value = useMemo<AdminAuthState>(
    () => ({
      token,
      jwtRole: parseJwtRole(token),
      hydrated,
      gatePhase,
      loading,
      error,
      authorized: Boolean(token),
      apiHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
      refreshGate,
      submitRegistration,
      logout,
    }),
    [token, hydrated, gatePhase, loading, error, refreshGate, submitRegistration, logout],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth deve ser usado dentro de AdminAuthProvider");
  return ctx;
}

export function AdminSignOut() {
  const { logout } = useAdminAuth();
  return (
    <button
      type="button"
      onClick={() => logout()}
      className="text-sm text-olive-300 hover:text-olive-100 border border-olive-800 rounded px-3 py-1"
    >
      Sair do painel
    </button>
  );
}
