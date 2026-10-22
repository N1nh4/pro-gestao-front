"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { NAV_DEF, pathForNav, PRIMARY_ACTIONS, TITLES } from "@/lib/rbac";
import type { NavId } from "@/lib/types";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, perfil, ready } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const segment = pathname.split("/")[1] as NavId;

  /**
   * Rotas de detalhe fora do sidebar (ex.: /manual/[id]): não existem como item
   * de navegação, então herdam a permissão da aba de Configuração que as hospeda.
   */
  const ABA_DA_ROTA: Record<string, string> = { manual: "manuais" };
  const abaDaRota = ABA_DA_ROTA[segment];

  /** Rotas de detalhe que herdam a navegação de outra aba (ex.: /auditorias/[id]). */
  const HERDA_NAV: Record<string, NavId> = { auditorias: "certificacoes" };
  const navHerdada = HERDA_NAV[segment];

  const allowed = perfil
    ? perfil.nav.includes(segment) ||
      (navHerdada !== undefined && perfil.nav.includes(navHerdada)) ||
      (abaDaRota !== undefined &&
        perfil.nav.includes("config") &&
        perfil.cfgTabs.includes(abaDaRota))
    : false;

  useEffect(() => {
    if (!ready) return;
    if (!user || !perfil) {
      router.replace("/login");
      return;
    }
    if (!allowed) {
      router.replace(pathForNav(perfil.nav[0]));
    }
  }, [ready, user, perfil, allowed, router]);

  if (!ready || !user || !perfil || !allowed) {
    return (
      <div className="flex h-screen items-center justify-center text-xs text-t3">Carregando…</div>
    );
  }

  const title = TITLES[segment] ?? NAV_DEF[segment]?.label ?? segment;
  const isAdmin = perfil.id === "ag" || perfil.id === "sa";
  const primaryLabel =
    isAdmin && segment === "certificacoes" && pathname !== "/certificacoes"
      ? "Nova auditoria"
      : isAdmin && pathname.startsWith("/auditorias")
        ? "Nova ação"
        : isAdmin
          ? PRIMARY_ACTIONS[segment]
          : undefined;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={title} primaryLabel={primaryLabel} />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
