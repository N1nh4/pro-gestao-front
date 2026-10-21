/* Client do Catálogo do Manual — manual, dimensões, requisitos e itens. */

import { apiFetch } from "./client";

export interface ManualDto {
  id_manual: number;
  nome_manual: string;
  versao_manual: string;
}

export interface DimensaoDto {
  id_dimensao: number;
  nome_dimensao: string;
}

export interface RequisitoDto {
  id_requisito: number;
  id_manual: number;
  id_dimensao: number;
  cod_requisito: string;
  nome_requisito: string;
  nome_dimensao: string;
  total_itens: number;
}

/** Requisito pronto para select: código, nome e versão do manual. */
export interface RequisitoOpcao {
  id_requisito: number;
  cod_requisito: string;
  nome_requisito: string;
  rotulo: string;
}

export interface ItemDto {
  id_item: number;
  id_requisito: number;
  nome_item: string;
  nivel: string;
  descricao: string | null;
}

export type NivelItem = "I" | "II" | "III" | "IV";

export interface ManualPayload {
  nome_manual: string;
  versao_manual: string;
}

export interface DimensaoPayload {
  nome_dimensao: string;
}

export interface RequisitoPayload {
  id_manual: number;
  id_dimensao: number;
  cod_requisito: string;
  nome_requisito: string;
}

export interface ItemPayload {
  id_requisito: number;
  nome_item: string;
  nivel: NivelItem;
  descricao?: string | null;
}

export function listarManuais(): Promise<ManualDto[]> {
  return apiFetch<ManualDto[]>("/api/catalogo/manuais");
}

export function criarManual(payload: ManualPayload): Promise<ManualDto> {
  return apiFetch<ManualDto>("/api/catalogo/manuais", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function atualizarManual(id: number, payload: Partial<ManualPayload>): Promise<ManualDto> {
  return apiFetch<ManualDto>(`/api/catalogo/manuais/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function removerManual(id: number): Promise<void> {
  return apiFetch<void>(`/api/catalogo/manuais/${id}`, { method: "DELETE" });
}

export function listarDimensoes(): Promise<DimensaoDto[]> {
  return apiFetch<DimensaoDto[]>("/api/catalogo/dimensoes");
}

export function criarDimensao(payload: DimensaoPayload): Promise<DimensaoDto> {
  return apiFetch<DimensaoDto>("/api/catalogo/dimensoes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function atualizarDimensao(
  id: number,
  payload: Partial<DimensaoPayload>,
): Promise<DimensaoDto> {
  return apiFetch<DimensaoDto>(`/api/catalogo/dimensoes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function removerDimensao(id: number): Promise<void> {
  return apiFetch<void>(`/api/catalogo/dimensoes/${id}`, { method: "DELETE" });
}

export function listarRequisitos(filtro?: {
  id_manual?: number;
  id_dimensao?: number;
}): Promise<RequisitoDto[]> {
  const params = new URLSearchParams();
  if (filtro?.id_manual != null) params.set("id_manual", String(filtro.id_manual));
  if (filtro?.id_dimensao != null) params.set("id_dimensao", String(filtro.id_dimensao));
  const qs = params.toString();
  return apiFetch<RequisitoDto[]>(`/api/catalogo/requisitos${qs ? `?${qs}` : ""}`);
}

export function criarRequisito(payload: RequisitoPayload): Promise<RequisitoDto> {
  return apiFetch<RequisitoDto>("/api/catalogo/requisitos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function atualizarRequisito(
  id: number,
  payload: Partial<RequisitoPayload>,
): Promise<RequisitoDto> {
  return apiFetch<RequisitoDto>(`/api/catalogo/requisitos/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function removerRequisito(id: number): Promise<void> {
  return apiFetch<void>(`/api/catalogo/requisitos/${id}`, { method: "DELETE" });
}

export function listarItens(filtro?: {
  id_requisito?: number;
  nivel?: NivelItem;
}): Promise<ItemDto[]> {
  const params = new URLSearchParams();
  if (filtro?.id_requisito != null) params.set("id_requisito", String(filtro.id_requisito));
  if (filtro?.nivel) params.set("nivel", filtro.nivel);
  const qs = params.toString();
  return apiFetch<ItemDto[]>(`/api/catalogo/itens${qs ? `?${qs}` : ""}`);
}

export function criarItem(payload: ItemPayload): Promise<ItemDto> {
  return apiFetch<ItemDto>("/api/catalogo/itens", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function atualizarItem(id: number, payload: Partial<ItemPayload>): Promise<ItemDto> {
  return apiFetch<ItemDto>(`/api/catalogo/itens/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function removerItem(id: number): Promise<void> {
  return apiFetch<void>(`/api/catalogo/itens/${id}`, { method: "DELETE" });
}

/* ── Níveis (catálogo) ──────────────────────────────────────────────
   As certificações do ente ficam em /api/certificacoes (ver api/certificacoes.ts). */

export interface NivelDto {
  id_nivel: number;
  nome_nivel: string;
}

export interface NivelPayload {
  nome_nivel: string;
}

export function listarNiveis(): Promise<NivelDto[]> {
  return apiFetch<NivelDto[]>("/api/catalogo/niveis");
}

export function criarNivel(payload: NivelPayload): Promise<NivelDto> {
  return apiFetch<NivelDto>("/api/catalogo/niveis", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function atualizarNivel(id: number, payload: Partial<NivelPayload>): Promise<NivelDto> {
  return apiFetch<NivelDto>(`/api/catalogo/niveis/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function removerNivel(id: number): Promise<void> {
  return apiFetch<void>(`/api/catalogo/niveis/${id}`, { method: "DELETE" });
}
