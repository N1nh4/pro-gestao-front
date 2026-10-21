/* Client do Plano de Ação — ações (tabela única `acao`): listar, criar, editar, status e remover. */

import { API_URL, ApiError, apiFetch, getToken } from "./client";
import { type AcaoPlano, type AcaoStatus, type DocumentoAcao } from "@/lib/domain/plano";

interface AcaoDocumentoDto {
  id: string;
  nome_arquivo: string;
  tipo_arquivo: string;
  versao: number | null;
  tamanho_bytes: number | null;
  enviado_em: string | null;
}

export interface AcaoDto {
  id_acao: number;
  id_certificacao: number;
  id_requisito: number;
  id_item: number | null;
  id_unidade: string;
  nome: string;
  descricao: string;
  prazo: string;
  data_envio: string | null;
  status: string;
  data_aprovacao: string | null;
  criado_em: string | null;
  cod_requisito: string;
  nome_requisito: string;
  nome_item: string;
  sigla_unidade: string;
  nome_unidade: string;
  nome_certificacao: string;
  nome_nivel: string;
  versao_manual: string;
  historico: { dt: string; ev: string }[];
  documentos: AcaoDocumentoDto[];
  diligencias_count: number;
}

const STATUS: AcaoStatus[] = ["PENDENTE", "ENVIADO", "APROVADO", "DILIGÊNCIA"];

export function toAcaoPlano(dto: AcaoDto): AcaoPlano {
  const status = (STATUS.includes(dto.status as AcaoStatus) ? dto.status : "PENDENTE") as AcaoStatus;
  return {
    idAcao: dto.id_acao,
    idCertificacao: dto.id_certificacao,
    idRequisito: dto.id_requisito,
    idItem: dto.id_item,
    req: dto.cod_requisito,
    reqNome: dto.nome_requisito,
    item: dto.nome_item,
    nome: dto.nome,
    acao: dto.descricao,
    unidadeId: dto.id_unidade,
    setor: dto.sigla_unidade || dto.nome_unidade || "",
    certificacao: dto.nome_certificacao,
    nivel: dto.nome_nivel,
    prazo: dto.prazo ?? "",
    dtEnvio: dto.data_envio,
    status,
    obs: "",
    hist: dto.historico ?? [],
    diligs: [],
    documentos: (dto.documentos ?? []).map(
      (documento): DocumentoAcao => ({
        id: documento.id,
        nomeArquivo: documento.nome_arquivo,
        tipoArquivo: documento.tipo_arquivo,
        versao: documento.versao,
        tamanhoBytes: documento.tamanho_bytes,
        enviadoEm: documento.enviado_em,
      }),
    ),
  };
}

export async function listarAcoes(filtro?: {
  id_certificacao?: number;
  id_unidade?: string;
  id_requisito?: number;
  status?: string;
}): Promise<AcaoPlano[]> {
  const params = new URLSearchParams();
  if (filtro?.id_certificacao != null) params.set("id_certificacao", String(filtro.id_certificacao));
  if (filtro?.id_unidade != null) params.set("id_unidade", filtro.id_unidade);
  if (filtro?.id_requisito != null) params.set("id_requisito", String(filtro.id_requisito));
  if (filtro?.status) params.set("status", filtro.status);
  const qs = params.toString();
  const dtos = await apiFetch<AcaoDto[]>(`/api/acoes${qs ? `?${qs}` : ""}`);
  return dtos.map(toAcaoPlano);
}

export interface NovaAcaoPayload {
  id_certificacao?: number;
  id_requisito: number;
  id_item: number;
  nome: string;
  descricao: string;
  prazo: string;
  unidade_ids: string[];
}

export type AtualizarAcaoPayload = Partial<
  Pick<NovaAcaoPayload, "id_requisito" | "id_item" | "nome" | "descricao" | "prazo"> & {
    status: AcaoStatus;
    data_envio: string | null;
  }
>;

export function criarAcao(payload: NovaAcaoPayload): Promise<AcaoDto[]> {
  return apiFetch("/api/acoes", { method: "POST", body: JSON.stringify(payload) });
}

export function atualizarAcao(idAcao: number, payload: AtualizarAcaoPayload): Promise<AcaoDto> {
  return apiFetch(`/api/acoes/${idAcao}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function atualizarStatusAcao(idAcao: number, status: AcaoStatus): Promise<AcaoDto> {
  return apiFetch(`/api/acoes/${idAcao}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function enviarDocumentoAcao(idAcao: number, arquivo: File): Promise<AcaoDocumentoDto> {
  const form = new FormData();
  form.append("arquivo", arquivo);
  const headers = new Headers();
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}/api/acoes/${idAcao}/documentos`, {
    method: "POST",
    headers,
    body: form,
  });
  if (!response.ok) {
    let message = response.statusText;
    try {
      const data = await response.json();
      message = data?.detail ?? message;
    } catch {
      // Use HTTP status text for a non-JSON error response.
    }
    throw new ApiError(response.status, message);
  }
  return response.json() as Promise<AcaoDocumentoDto>;
}

export async function baixarDocumentoAcao(idAcao: number, idDocumento: string): Promise<Blob> {
  const headers = new Headers();
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(
    `${API_URL}/api/acoes/${idAcao}/documentos/${encodeURIComponent(idDocumento)}`,
    { headers },
  );
  if (!response.ok) {
    let message = response.statusText;
    try {
      const data = await response.json();
      message = data?.detail ?? message;
    } catch {
      // Use HTTP status text for a non-JSON error response.
    }
    throw new ApiError(response.status, message);
  }
  return response.blob();
}

export function removerAcao(idAcao: number): Promise<void> {
  return apiFetch(`/api/acoes/${idAcao}`, { method: "DELETE" });
}
