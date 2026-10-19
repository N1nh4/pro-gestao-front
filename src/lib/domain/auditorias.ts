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

/* -------------------------------------------------------------------------- */
/* Modal "Registrar Auditoria" (portado de abrirNovaAuditoria/confirmar)       */
/* -------------------------------------------------------------------------- */

export const TIPOS_AUDITORIA: TipoAuditoria[] = [
  "Auditoria Inicial",
  "Pré-Auditoria",
  "Supervisão Documental",
  "Supervisão Presencial",
  "Renovação",
  "Mudança de Nível",
];

export const MODALIDADES: Modalidade[] = ["Presencial", "Remota", "Híbrida"];

export const CONCLUSOES: Conclusao[] = ["Aprovado", "Aprovado com ressalvas", "Reprovado"];

export const NIVEIS = ["I", "II", "III", "IV"] as const;

export interface NovaAuditoriaInput {
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
  obs: string;
}

export function montarAuditoria(
  input: NovaAuditoriaInput,
  existentes: Auditoria[],
): Auditoria {
  const n = existentes.length + 1;
  return {
    ...input,
    id: `aud${String(n).padStart(3, "0")}`,
    duracao: input.duracao || "—",
    obs: input.obs || "",
  };
}
