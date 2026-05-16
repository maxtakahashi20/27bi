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
import { api } from "@/lib/api";

const STORAGE_KEY = "bip27_admin_jwt";

type AdminAuthState = {
  token: string | null;
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  authorized: boolean;
  apiHeaders: Record<string, string> | undefined;
  login: (password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

const AdminAuthContext = createContext<AdminAuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
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

  const login = useCallback(async (password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/admin/password", { password });
      sessionStorage.setItem(STORAGE_KEY, data.token);
      setToken(data.token);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        (Array.isArray(e?.response?.data?.message) ? e.response.data.message.join(", ") : null) ??
        "Falha ao entrar.";
      setError(typeof msg === "string" ? msg : "Senha incorreta ou servidor indisponível.");
      setToken(null);
      sessionStorage.removeItem(STORAGE_KEY);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setError(null);
  }, []);

  const value = useMemo<AdminAuthState>(
    () => ({
      token,
      hydrated,
      loading,
      error,
      authorized: Boolean(token),
      apiHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
      login,
      logout,
      clearError,
    }),
    [token, hydrated, loading, error, login, logout, clearError],
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
      Sair
    </button>
  );
}
