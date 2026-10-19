/* Client de autenticação — login e usuário logado. */

import { apiFetch } from "./client";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario_id: string;
  nome: string;
  email: string;
  perfis: string[];
  unidades: { id: string; sigla: string; nome: string }[];
}

export interface MeResponse {
  id: string;
  id_usuario?: string;
  login?: string;
  email: string;
  nome_completo: string;
  status?: string;
  perfis: { id: string; nome: string; tipo?: string }[];
}

export function loginApi(email: string, senha: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

export function meApi(): Promise<MeResponse> {
  return apiFetch<MeResponse>("/api/auth/me");
}
