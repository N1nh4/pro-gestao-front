import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

/**
 * A área autenticada é renderizada no cliente (guarda de sessão em AppShell),
 * então a navegação nunca é "instantânea" a partir do servidor. Desabilita a
 * validação de instant-navigation (cacheComponents) para estas rotas.
 */
export const instant = false;

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
