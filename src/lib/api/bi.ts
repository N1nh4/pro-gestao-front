/* Client do BI / Painel analítico consolidado. */

import { apiFetch } from "./client";

export interface BiConsolidado {
  total_acoes: number;
  aprovadas: number;
  enviadas: number;
  pendentes: number;
  diligencias: number;
  pct_completude: number;
  nivel_estimado: string;
  por_requisito: { cod: string; total: number; aprovadas: number; pct: number }[];
  por_dimensao: Record<string, { total: number; aprovadas: number }>;
}

export function biConsolidado(): Promise<BiConsolidado> {
  return apiFetch<BiConsolidado>("/api/bi/consolidado");
}
