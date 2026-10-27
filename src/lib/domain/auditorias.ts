/* ==========================================================================
   AUDITORIAS — rótulos e tons (sem dados).
   Os valores da API são slugs; aqui ficam os labels exibidos e as cores.
   ========================================================================== */

export const TIPO_OPCOES = [
  // { valor: "auditoria_inicial", rotulo: "Auditoria Inicial" },
  { valor: "pre_auditoria", rotulo: "Pré-Auditoria" },
  { valor: "auditoria_certificacao", rotulo: "Auditoria de Certificação" },
  { valor: "supervisao_documental", rotulo: "Primeira Supervisão" },
  { valor: "supervisao_presencial", rotulo: "Segunda Supervisão" },
  // { valor: "renovacao", rotulo: "Renovação" },
  // { valor: "mudanca_nivel", rotulo: "Mudança de Nível" },
] as const;

export const MODALIDADE_OPCOES = [
  { valor: "presencial", rotulo: "Presencial" },
  { valor: "remota", rotulo: "Remota" },
  { valor: "hibrida", rotulo: "Híbrida" },
] as const;

export const CONCLUSAO_OPCOES = [
  { valor: "pendente", rotulo: "Pendente" },
  { valor: "aprovado", rotulo: "Aprovado" },
  { valor: "aprovado_ressalvas", rotulo: "Aprovado com ressalvas" },
  { valor: "reprovado", rotulo: "Reprovado" },
  { valor: "diligencia", rotulo: "Diligência" },
] as const;

const ROTULOS = new Map<string, string>(
  [...TIPO_OPCOES, ...MODALIDADE_OPCOES, ...CONCLUSAO_OPCOES].map((o) => [
    o.valor,
    o.rotulo,
  ]),
);

export function rotulo(
  valor: string | null | undefined,
  fallback = "—",
): string {
  if (!valor) return fallback;
  return ROTULOS.get(valor) ?? valor;
}

export const TIPO_COR: Record<string, string> = {
  // auditoria_inicial: "var(--org2)",
  pre_auditoria: "var(--acc2)",
  auditoria_certificacao: "var(--org2)",
  supervisao_documental: "var(--prp2)",
  supervisao_presencial: "var(--grn2)",
  renovacao: "var(--amb2)",
  mudanca_nivel: "var(--red2)",
};

export function conclusaoTone(conclusao: string): string {
  if (conclusao === "aprovado") return "bg-grn3 text-grn2";
  if (conclusao === "aprovado_ressalvas") return "bg-amb3 text-amb2";
  if (conclusao === "reprovado") return "bg-red3 text-red2";
  return "bg-bg3 text-t3";
}
