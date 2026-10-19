"use client";

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react";
import { loginApi } from "@/lib/api/auth";
import { ApiError, clearToken, setToken } from "@/lib/api/client";
import { autenticar, getPerfil, perfilIdFromNomes } from "@/lib/rbac";
import { sessionStore, useMounted } from "@/lib/stores";
import type { Perfil, PerfilId, SessionUser } from "@/lib/types";

interface LoginResult {
  ok: boolean;
  erro?: string;
  perfil?: PerfilId;
}

interface AuthContextValue {
  user: SessionUser | null;
  perfil: Perfil | null;
  /** true após a hidratação no cliente (evita redirecionar antes de ler a sessão). */
  ready: boolean;
  login: (email: string, senha: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const ready = useMounted();
  const user = useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getSnapshot,
    sessionStore.getServerSnapshot,
  );

  const login = useCallback(async (email: string, senha: string): Promise<LoginResult> => {
    // 1) Tenta autenticar na API.
    try {
      const resp = await loginApi(email, senha);
      setToken(resp.access_token);
      const perfilId = perfilIdFromNomes(resp.perfis);
      sessionStore.set({ perfil: perfilId, nome: resp.nome, email: resp.email });
      return { ok: true, perfil: perfilId };
    } catch (err) {
      // 401 = credenciais inválidas na API (sem fallback).
      if (err instanceof ApiError && err.status === 401) {
        return { ok: false, erro: "Usuário ou senha inválidos." };
      }
      // API indisponível (rede/servidor) → fallback para o mock local.
      clearToken();
      const perfil = autenticar(email, senha);
      if (!perfil) return { ok: false, erro: "Usuário ou senha inválidos." };
      sessionStore.set({ perfil: perfil.id, nome: perfil.nome, email: perfil.email });
      return { ok: true, perfil: perfil.id };
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    sessionStore.set(null);
  }, []);

  const perfil = user ? getPerfil(user.perfil) : null;

  return (
    <AuthContext.Provider value={{ user, perfil, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
