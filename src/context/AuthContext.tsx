"use client";

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react";
import { autenticar, getPerfil } from "@/lib/rbac";
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
    // Simula latência de autenticação (mock).
    await new Promise((resolve) => setTimeout(resolve, 600));
    const perfil = autenticar(email, senha);
    if (!perfil) return { ok: false, erro: "Usuário ou senha inválidos." };
    sessionStore.set({ perfil: perfil.id, nome: perfil.nome, email: perfil.email });
    return { ok: true, perfil: perfil.id };
  }, []);

  const logout = useCallback(() => sessionStore.set(null), []);

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
