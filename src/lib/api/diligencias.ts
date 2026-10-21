/* Client de Diligências — emissão, retorno e aprovação. */

import { apiFetch } from "./client";
import { listarAcoes } from "./plano";
import {
  type Criticidade,
  type Diligencia,
  type DiligenciaStatus,
} from "@/lib/domain/diligencias";
import type { AcaoPlano } from "@/lib/domain/plano";

interface DiligenciaDto {
  id: string;
  num: string;
  acao_id: number;
  situacao_detectada: string;
  criticidade: string;
  prazo_resposta: string | null;
  status: string;
  emitido_em: string | null;
  retorno_texto: string | null;
  retorno_em: string | null;
}

const CRITS: Criticidade[] = ["critica", "alta", "media", "baixa"];
const STATUSS: DiligenciaStatus[] = ["aberta", "retorno", "aprovada", "vencida", "prorrogada", "remitida"];

function limparNum(num: string): string {
  return num.replace(/^D-/, "");
}

function formatTs(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

export function toDiligencia(dto: DiligenciaDto, acao?: AcaoPlano): Diligencia {
  const criticidade = (CRITS.includes(dto.criticidade as Criticidade) ? dto.criticidade : "media") as Criticidade;
  const status = (STATUSS.includes(dto.status as DiligenciaStatus) ? dto.status : "aberta") as DiligenciaStatus;
  return {
    apiId: dto.id,
    num: limparNum(dto.num),
    acaoCod: dto.acao_id,
    cod: acao?.req ?? "",
    acaoItem: acao?.item ?? "",
    setor: acao?.setor ?? "",
    resp: acao?.setor ?? "",
    situacao: dto.situacao_detectada,
    prazo: dto.prazo_resposta ?? "",
    retorno: dto.retorno_texto,
    retornoTs: formatTs(dto.retorno_em),
    criticidade,
    status,
    docs: [],
    hist: [],
    chat: [],
    emitidoPor: "",
    emitidoTs: formatTs(dto.emitido_em) ?? "",
  };
}

export async function listarDiligencias(): Promise<Diligencia[]> {
  const [dtos, acoes] = await Promise.all([apiFetch<DiligenciaDto[]>("/api/diligencias"), listarAcoes()]);
  const map = new Map(acoes.map((a) => [a.idAcao, a]));
  return dtos.map((d) => toDiligencia(d, map.get(d.acao_id)));
}

export interface NovaDiligenciaPayload {
  acao_id: number;
  situacao_detectada: string;
  criticidade: Criticidade;
  prazo_resposta: string;
}

export function criarDiligencia(payload: NovaDiligenciaPayload): Promise<{ id: string; num: string }> {
  return apiFetch("/api/diligencias", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function enviarRetorno(apiId: string, retornoTexto: string): Promise<{ status: string }> {
  return apiFetch(`/api/diligencias/${encodeURIComponent(apiId)}/retorno`, {
    method: "PATCH",
    body: JSON.stringify({ retorno_texto: retornoTexto }),
  });
}

export function aprovarDiligencia(apiId: string): Promise<{ status: string; acao_status: string }> {
  return apiFetch(`/api/diligencias/${encodeURIComponent(apiId)}/aprovar`, { method: "PATCH" });
}
