/* Client de Administração — usuários, perfis e unidades. */

import { apiFetch } from "./client";

export interface UsuarioDto {
  id: string;
  id_usuario?: string;
  login?: string;
  email: string;
  nome_completo: string;
  status?: string;
  perfis: { id: string; nome: string }[];
  unidades?: { id: string; sigla: string }[];
  criado_em?: string | null;
}

export interface UsuarioPayload {
  nome_completo?: string;
  email?: string;
  senha?: string;
  status?: string;
  perfil_id?: string;
  perfil_ids?: string[];
  unidade_ids?: string[];
}

export interface UnidadePayload {
  sigla?: string;
  nome?: string;
  descricao?: string | null;
  ativo?: boolean;
}

export interface PerfilDto {
  id: string;
  nome: string;
  descricao: string | null;
  tipo: string;
  requer_setor: boolean;
}

export interface UnidadeDto {
  id: string;
  sigla: string;
  nome: string;
  descricao?: string | null;
}

export interface EnteDto {
  id: string;
  nome_ente: string;
  cnpj_ente: string;
  uf: string;
  tipo_ente: string;
  representante_legal?: string | null;
  cpf_representante?: string | null;
  data_inicio_processo?: string | null;
  data_fim_processo?: string | null;
  codigo_siafi?: string | null;
  email_contato?: string | null;
  telefone_contato?: string | null;
  cep?: string | null;
  cidade?: string | null;
  tipo_logradouro?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  bairro?: string | null;
  complemento?: string | null;
  nome_ug?: string | null;
  cnpj_ug?: string | null;
  nivel_atual?: string | null;
  nivel_pretendido?: string | null;
  entidade_certificadora?: string | null;
  num_segurados?: number | null;
  observacoes?: string | null;
  ativo: boolean;
}

export function listarUsuarios(): Promise<UsuarioDto[]> {
  return apiFetch<UsuarioDto[]>("/api/usuarios");
}

export function criarUsuario(payload: UsuarioPayload & { senha: string }): Promise<UsuarioDto> {
  return apiFetch<UsuarioDto>("/api/usuarios", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function atualizarUsuario(
  id: string,
  payload: UsuarioPayload,
): Promise<UsuarioDto> {
  return apiFetch<UsuarioDto>(`/api/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function listarPerfis(): Promise<PerfilDto[]> {
  return apiFetch<PerfilDto[]>("/api/perfis");
}

export function listarUnidades(): Promise<UnidadeDto[]> {
  return apiFetch<UnidadeDto[]>("/api/unidades");
}

export function criarUnidade(payload: UnidadePayload): Promise<UnidadeDto> {
  return apiFetch<UnidadeDto>("/api/unidades", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function atualizarUnidade(
  id: string,
  payload: UnidadePayload,
): Promise<UnidadeDto> {
  return apiFetch<UnidadeDto>(`/api/unidades/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function obterEnte(): Promise<EnteDto> {
  return apiFetch<EnteDto>("/api/ente");
}

export function atualizarEnte(payload: Partial<EnteDto>): Promise<EnteDto> {
  return apiFetch<EnteDto>("/api/ente", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
