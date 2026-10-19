/* Client do Plano de Ação — lista/criação de ações e mudança de status. */

import { apiFetch } from "./client";
import { type AcaoPlano, type AcaoStatus, nomeRequisito } from "@/lib/domain/plano";

export interface AcaoDto {
  id_acao: string;
  requisito_cod: string;
  item: string;
  descricao_acao: string;
  unidade_id: string;
  unidade_sigla: string;
  unidade_nome: string;
  status: string;
  prazo: string | null;
  dt_envio: string | null;
  dt_aprovacao: string | null;
  criado_em: string | null;
  diligencias_count: number;
  historico: { dt: string; ev: string }[];
}

const STATUS: AcaoStatus[] = ["PENDENTE", "ENVIADO", "APROVADO", "DILIGÊNCIA"];

export function toAcaoPlano(dto: AcaoDto): AcaoPlano {
  const status = (STATUS.includes(dto.status as AcaoStatus) ? dto.status : "PENDENTE") as AcaoStatus;
  return {
    idAcao: dto.id_acao,
    req: dto.requisito_cod,
    reqNome: nomeRequisito(dto.requisito_cod),
    item: dto.item,
    acao: dto.descricao_acao,
    unidadeId: dto.unidade_id,
    setor: dto.unidade_sigla || dto.unidade_nome || "",
    prazo: dto.prazo ?? "",
    dtEnvio: dto.dt_envio,
    status,
    obs: "",
    hist: dto.historico ?? [],
    diligs: [],
  };
}

export async function listarAcoes(): Promise<AcaoPlano[]> {
  const dtos = await apiFetch<AcaoDto[]>("/api/acoes");
  return dtos.map(toAcaoPlano);
}

export interface NovaAcaoPayload {
  requisito_cod: string;
  item: string;
  descricao_acao: string;
  prazo: string;
  unidade_ids: string[];
}

export function criarAcao(payload: NovaAcaoPayload): Promise<{ criadas: string[]; total: number }> {
  return apiFetch("/api/acoes", { method: "POST", body: JSON.stringify(payload) });
}

export function atualizarStatusAcao(idAcao: string, status: AcaoStatus): Promise<{ id_acao: string; status: string }> {
  return apiFetch(`/api/acoes/${encodeURIComponent(idAcao)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
