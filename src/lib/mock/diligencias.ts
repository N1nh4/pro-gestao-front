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

export interface DiligenciaDoc {
  v: number;
  arq: string;
  ts: string;
  user: string;
}

export interface DiligenciaHist {
  dt: string;
  ev: string;
  user?: string;
}

export interface DiligenciaChat {
  t: "dil" | "out" | "in";
  u: string;
  m: string;
  ts: string;
}

export interface Diligencia {
  num: string;
  acaoCod: string;
  cod: string;
  acaoItem: string;
  setor: string;
  resp: string;
  situacao: string;
  prazo: string;
  retorno: string | null;
  retornoTs: string | null;
  criticidade: Criticidade;
  status: DiligenciaStatus;
  docs: DiligenciaDoc[];
  hist: DiligenciaHist[];
  chat: DiligenciaChat[];
  emitidoPor: string;
  emitidoTs: string;
}

export const DILIGENCIAS: Diligencia[] = [
  {
    num: "001",
    acaoCod: "AC-033",
    cod: "3.2.8",
    acaoItem: "Demonstrações Mensais",
    setor: "GEINP",
    resp: "GEINP",
    situacao: "Demonstrações financeiras mensais ausentes no portal. Publicar jan-jun/2026.",
    prazo: "2026-07-17",
    retorno: "Demonstrações jan-jun/2026 publicadas em 18/07.",
    retornoTs: "18/07 08:15",
    criticidade: "alta",
    status: "retorno",
    docs: [{ v: 1, arq: "Demonstracoes_jan_jun_2026.pdf", ts: "18/07/2026", user: "Roberto Oliveira" }],
    hist: [
      { dt: "17/03", ev: "D-001 emitida pelo Auditor: demonstrações ausentes", user: "Auditor" },
      { dt: "18/07", ev: "v1 enviada com jan-jun/2026", user: "Operacional" },
    ],
    chat: [
      { t: "dil", u: "João Silva (Auditor Interno)", m: "Portal sem demonstrações mensais. Publicar jan-jun/2026 e enviar evidência.", ts: "17/03 10:00" },
      { t: "out", u: "Roberto Oliveira (GEINP)", m: "Publicado. Segue link de confirmação.", ts: "18/07 08:15" },
    ],
    emitidoPor: "João Silva",
    emitidoTs: "17/03",
  },
  {
    num: "002",
    acaoCod: "AC-022",
    cod: "3.2.2",
    acaoItem: "Plano de Ação Anual",
    setor: "GEFIN",
    resp: "GEFIN",
    situacao: "Plano de Ação Anual 2026 enviado sem ata de aprovação do Conselho Deliberativo.",
    prazo: "2026-03-15",
    retorno: null,
    retornoTs: null,
    criticidade: "critica",
    status: "vencida",
    docs: [{ v: 1, arq: "Plano_Acao_2026_v1.pdf", ts: "01/03/2026", user: "Carlos Santos" }],
    hist: [
      { dt: "01/03", ev: "v1 enviada por GEFIN", user: "Operacional" },
      { dt: "05/03", ev: "D-002 emitida: sem ata do CD", user: "Auditor" },
      { dt: "16/03", ev: "Prazo dilatado: 15/03 → 15/04 — CD extraordinário", user: "Auditor" },
    ],
    chat: [
      { t: "dil", u: "João Silva (Auditor Interno)", m: "Documento não contempla ata de aprovação do CD. Prazo: 15/03.", ts: "05/03 14:32" },
      { t: "out", u: "Carlos Santos (GEFIN)", m: "CD extraordinário agendado. Enviaremos v2 com ata.", ts: "06/03 09:15" },
    ],
    emitidoPor: "João Silva",
    emitidoTs: "05/03",
  },
  {
    num: "003",
    acaoCod: "AC-013",
    cod: "3.1.3",
    acaoItem: "Isabela Loureiro — Gestora",
    setor: "GAB DPR",
    resp: "GAB DPR",
    situacao: "Certificação da Gestora vencida em março/2026. Renovação obrigatória para manutenção do Nível IV.",
    prazo: "2026-06-23",
    retorno: null,
    retornoTs: null,
    criticidade: "critica",
    status: "aberta",
    docs: [],
    hist: [{ dt: "01/03", ev: "D-003 emitida: certificação expirada", user: "Auditor" }],
    chat: [{ t: "dil", u: "João Silva (Auditor Interno)", m: "Certificação expirada em mar/2026. Providenciar renovação urgente.", ts: "01/03 09:00" }],
    emitidoPor: "João Silva",
    emitidoTs: "01/03",
  },
  {
    num: "004",
    acaoCod: "AC-004",
    cod: "3.1.1",
    acaoItem: "Compensação Previdenciária",
    setor: "GEPRE",
    resp: "GEPRE",
    situacao: "Mapeamento da compensação previdenciária incompleto — falta fluxograma assinado.",
    prazo: "2026-07-31",
    retorno: "Fluxograma atualizado e assinado enviado em 25/06.",
    retornoTs: "25/06 14:30",
    criticidade: "media",
    status: "retorno",
    docs: [{ v: 1, arq: "Fluxograma_Compensacao_v1.pdf", ts: "25/06/2026", user: "Ana Lima" }],
    hist: [
      { dt: "10/06", ev: "D-004 emitida: fluxograma ausente", user: "Auditor" },
      { dt: "25/06", ev: "v1 enviada com fluxograma assinado", user: "Operacional" },
    ],
    chat: [
      { t: "dil", u: "João Silva (Auditor Interno)", m: "Falta o fluxograma assinado pelo responsável.", ts: "10/06 11:00" },
      { t: "out", u: "Ana Lima (GEPRE)", m: "Fluxograma atualizado e assinado em anexo.", ts: "25/06 14:30" },
    ],
    emitidoPor: "João Silva",
    emitidoTs: "10/06",
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

export const DIL_ST_TONE: Record<DiligenciaStatus, string> = {
  aberta: "bg-acc3 text-acc2",
  retorno: "bg-prp3 text-prp2",
  aprovada: "bg-grn3 text-grn2",
  vencida: "bg-red3 text-red2",
  prorrogada: "bg-amb3 text-amb2",
  remitida: "bg-prp3 text-prp2",
};

export const CRIT_LABEL: Record<Criticidade, string> = {
  critica: "CRÍTICA",
  alta: "ALTA",
  media: "MÉDIA",
  baixa: "BAIXA",
};

export const CRIT_TONE: Record<Criticidade, string> = {
  critica: "bg-red3 text-red2",
  alta: "bg-org3 text-org2",
  media: "bg-amb3 text-amb2",
  baixa: "bg-grn3 text-grn2",
};

export function contarDiligenciasVencidas(): number {
  return DILIGENCIAS.filter((d) => d.status === "vencida").length;
}

export function isDiligenciaAberta(d: Diligencia): boolean {
  return d.status !== "aprovada" && d.status !== "remitida";
}

export function temDiligenciaAberta(idsAcao: string[]): boolean {
  return DILIGENCIAS.some((d) => idsAcao.includes(d.acaoCod) && isDiligenciaAberta(d));
}
