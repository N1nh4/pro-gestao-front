/* ==========================================================================
   DILIGÊNCIAS (mock) — portado de DILIGENCIAS em sac-progestao-demo.html.
   Será substituído por dados da API na Fase 10.
   ========================================================================== */

export type DiligenciaStatus =
  | "aberta"
  | "retorno"
  | "aprovada"
  | "vencida"
  | "prorrogada"
  | "remitida";

export type Criticidade = "critica" | "alta" | "media" | "baixa";

export interface Diligencia {
  num: string;
  acaoCod: string;
  cod: string;
  acaoItem: string;
  setor: string;
  situacao: string;
  prazo: string;
  criticidade: Criticidade;
  status: DiligenciaStatus;
}

export const DILIGENCIAS: Diligencia[] = [
  {
    num: "001",
    acaoCod: "AC-033",
    cod: "3.2.8",
    acaoItem: "Demonstrações Mensais",
    setor: "GEINP",
    situacao:
      "Demonstrações financeiras mensais ausentes no portal. Publicar jan-jun/2026.",
    prazo: "2026-07-17",
    criticidade: "alta",
    status: "retorno",
  },
  {
    num: "002",
    acaoCod: "AC-022",
    cod: "3.2.2",
    acaoItem: "Plano de Ação Anual",
    setor: "GEFIN",
    situacao:
      "Plano de Ação Anual 2026 enviado sem ata de aprovação do Conselho Deliberativo.",
    prazo: "2026-03-15",
    criticidade: "critica",
    status: "vencida",
  },
  {
    num: "003",
    acaoCod: "AC-013",
    cod: "3.1.3",
    acaoItem: "Isabela Loureiro — Gestora",
    setor: "GAB DPR",
    situacao:
      "Certificação da Gestora vencida em março/2026. Renovação obrigatória para manutenção do Nível IV.",
    prazo: "2026-06-23",
    criticidade: "critica",
    status: "aberta",
  },
  {
    num: "004",
    acaoCod: "AC-004",
    cod: "3.1.1",
    acaoItem: "Compensação Previdenciária",
    setor: "GEPRE",
    situacao:
      "Mapeamento da compensação previdenciária incompleto — falta fluxograma assinado.",
    prazo: "2026-07-31",
    criticidade: "media",
    status: "retorno",
  },
];

export const DIL_ST_LABEL: Record<DiligenciaStatus, string> = {
  aberta: "Aberta",
  retorno: "Retorno rec.",
  aprovada: "Aprovada",
  vencida: "Vencida",
  prorrogada: "Prorrogada",
  remitida: "Remitida",
};

export function contarDiligenciasVencidas(): number {
  return DILIGENCIAS.filter((d) => d.status === "vencida").length;
}
