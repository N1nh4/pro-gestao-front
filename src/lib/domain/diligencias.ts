/* ==========================================================================
   DILIGÊNCIAS — tipos, rótulos e helpers (sem dados).
   As diligências são carregadas da API (/api/diligencias).
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
  acaoCod: number;
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
  apiId?: string;
}

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

export function contarDiligenciasVencidas(lista: Diligencia[] = []): number {
  return lista.filter((d) => d.status === "vencida").length;
}

export function isDiligenciaAberta(d: Diligencia): boolean {
  return d.status !== "aprovada" && d.status !== "remitida";
}

export function temDiligenciaAberta(idsAcao: number[], lista: Diligencia[] = []): boolean {
  return lista.some((d) => idsAcao.includes(d.acaoCod) && isDiligenciaAberta(d));
}
