/* Client de Certificações (certificado do ente) e Auditorias. */

import { apiFetch } from "./client";

/* ── Certificações ──────────────────────────────────────────────── */

export interface CertificacaoDto {
  id_certificacao: number;
  nome_certificacao: string;
  status: string;
  numero_certificado: string | null;
  data_certificacao: string | null;
  data_validade: string | null;
  entidade_certificadora: string | null;
  criado_em: string | null;
  atualizado_em: string | null;
  auditorias_count: number;
  acoes_count: number;
}

export interface CertificacaoPayload {
  nome_certificacao: string;
  status?: string;
  numero_certificado?: string | null;
  data_certificacao?: string | null;
  data_validade?: string | null;
  entidade_certificadora?: string | null;
}

export type CertificacaoUpdatePayload = Partial<CertificacaoPayload>;

export function listarCertificacoes(filtro?: { status?: string }): Promise<CertificacaoDto[]> {
  const params = new URLSearchParams();
  if (filtro?.status) params.set("status", filtro.status);
  const qs = params.toString();
  return apiFetch<CertificacaoDto[]>(`/api/certificacoes${qs ? `?${qs}` : ""}`);
}

export function obterCertificacao(id: number): Promise<CertificacaoDto> {
  return apiFetch<CertificacaoDto>(`/api/certificacoes/${id}`);
}

export function criarCertificacao(payload: CertificacaoPayload): Promise<CertificacaoDto> {
  return apiFetch<CertificacaoDto>("/api/certificacoes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function atualizarCertificacao(
  id: number,
  payload: CertificacaoUpdatePayload,
): Promise<CertificacaoDto> {
  return apiFetch<CertificacaoDto>(`/api/certificacoes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function removerCertificacao(id: number): Promise<void> {
  return apiFetch<void>(`/api/certificacoes/${id}`, { method: "DELETE" });
}

/* ── Auditorias (certificação + manual) ─────────────────────────── */

export interface AuditoriaDto {
  id: string;
  id_certificacao: number;
  id_manual: number;
  tipo: string;
  modalidade: string;
  data_auditoria: string;
  duracao_horas: number | null;
  nivel_recomendado: string | null;
  parecer_geral: string | null;
  conclusao: string;
  auditor_nome: string | null;
  auditor_email: string | null;
  criado_em: string | null;
  atualizado_em: string | null;
  nome_certificacao: string;
  nome_manual: string;
  versao_manual: string;
  acoes_count: number;
}

export interface AuditoriaPayload {
  id_certificacao: number;
  id_manual: number;
  tipo?: string;
  modalidade?: string;
  data_auditoria: string;
  duracao_horas?: number | null;
  nivel_recomendado?: string | null;
  parecer_geral?: string | null;
  conclusao?: string;
  auditor_nome?: string | null;
  auditor_email?: string | null;
}

export type AuditoriaUpdatePayload = Partial<AuditoriaPayload>;

export function listarAuditorias(filtro?: {
  id_certificacao?: number;
  id_manual?: number;
}): Promise<AuditoriaDto[]> {
  const params = new URLSearchParams();
  if (filtro?.id_certificacao != null)
    params.set("id_certificacao", String(filtro.id_certificacao));
  if (filtro?.id_manual != null) params.set("id_manual", String(filtro.id_manual));
  const qs = params.toString();
  return apiFetch<AuditoriaDto[]>(`/api/auditorias${qs ? `?${qs}` : ""}`);
}

export function obterAuditoria(id: string): Promise<AuditoriaDto> {
  return apiFetch<AuditoriaDto>(`/api/auditorias/${encodeURIComponent(id)}`);
}

export function criarAuditoria(payload: AuditoriaPayload): Promise<AuditoriaDto> {
  return apiFetch<AuditoriaDto>("/api/auditorias", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function atualizarAuditoria(
  id: string,
  payload: AuditoriaUpdatePayload,
): Promise<AuditoriaDto> {
  return apiFetch<AuditoriaDto>(`/api/auditorias/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function removerAuditoria(id: string): Promise<void> {
  return apiFetch<void>(`/api/auditorias/${encodeURIComponent(id)}`, { method: "DELETE" });
}
