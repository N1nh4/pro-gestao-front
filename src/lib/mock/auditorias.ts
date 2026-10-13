/* ==========================================================================
   AUDITORIAS (mock) — portado de sac-progestao-demo.html
   Fase 6 — Central de Certificações (/certificacao)
   ========================================================================== */

export type TipoAuditoria =
  | "Auditoria Inicial"
  | "Pré-Auditoria"
  | "Supervisão Documental"
  | "Supervisão Presencial"
  | "Renovação"
  | "Mudança de Nível";

export type Conclusao = "Aprovado" | "Aprovado com ressalvas" | "Reprovado";

export type Modalidade = "Presencial" | "Remota" | "Híbrida";

export interface Auditoria {
  id: string;
  tipo: TipoAuditoria;
  data: string;
  empresa: string;
  auditor: string;
  modalidade: Modalidade;
  duracao: string;
  nivelAuditado: "I" | "II" | "III" | "IV";
  nivelRecomendado: "I" | "II" | "III" | "IV";
  conclusao: Conclusao;
  criticidades: number;
  parecer: string;
  obs?: string;
}

export const AUDITORIAS: Auditoria[] = [
  {
    id: "aud001",
    tipo: "Pré-Auditoria",
    data: "2024-04-10",
    empresa: "FUMPRES",
    auditor: "Dr. Carlos Henrique Mota",
    modalidade: "Presencial",
    duracao: "3 dias",
    nivelAuditado: "III",
    nivelRecomendado: "III",
    conclusao: "Aprovado com ressalvas",
    criticidades: 2,
    parecer:
      "O RPPS apresenta boa estrutura de controles internos. Pendências identificadas no requisito 3.1.3 e 3.2.2. Prazo de 90 dias para regularização.",
    obs: "Próxima auditoria prevista para novembro/2024",
  },
  {
    id: "aud002",
    tipo: "Supervisão Documental",
    data: "2024-11-22",
    empresa: "FUMPRES",
    auditor: "Dra. Ana Beatriz Santos",
    modalidade: "Remota",
    duracao: "5 dias",
    nivelAuditado: "III",
    nivelRecomendado: "III",
    conclusao: "Aprovado",
    criticidades: 0,
    parecer:
      "Verificação documental dos requisitos CI, GC e EP. Ações do Plano de Ação apresentam evolução positiva. Requisito 3.2.8 com todas as demonstrações mensais publicadas.",
    obs: "Certificação Nível III renovada por mais 24 meses",
  },
];

export const TIPO_COR: Record<TipoAuditoria, string> = {
  "Auditoria Inicial": "var(--org2)",
  "Pré-Auditoria": "var(--acc2)",
  "Supervisão Documental": "var(--prp2)",
  "Supervisão Presencial": "var(--grn2)",
  Renovação: "var(--amb2)",
  "Mudança de Nível": "var(--red2)",
};

export const CONC_TONE_BG: Record<Conclusao, string> = {
  Aprovado: "bg-grn3",
  "Aprovado com ressalvas": "bg-amb3",
  Reprovado: "bg-red3",
};

export const CONC_TONE_TX: Record<Conclusao, string> = {
  Aprovado: "text-grn2",
  "Aprovado com ressalvas": "text-amb2",
  Reprovado: "text-red2",
};

export function ultimaAuditoria() {
  return [...AUDITORIAS].sort((a, b) => (a.data < b.data ? 1 : -1))[0];
}
