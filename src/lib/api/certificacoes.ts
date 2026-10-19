/* Client de Certificações e Auditorias. */

import { apiFetch } from "./client";
import {
  type Auditoria,
  type Conclusao,
  type Modalidade,
  type NovaAuditoriaInput,
  type TipoAuditoria,
} from "@/lib/domain/auditorias";

/* ── Auditorias ─────────────────────────────────────────────────── */

interface AuditoriaDto {
  id: string;
  tipo: string;
  modalidade: string;
  data_auditoria: string;
  duracao_horas: number | null;
  nivel_auditado: string | null;
  nivel_recomendado: string | null;
  parecer_geral: string | null;
  conclusao: string;
  auditor_nome: string | null;
}

const TIPO_LABEL: Record<string, TipoAuditoria> = {
  auditoria_inicial: "Auditoria Inicial",
  pre_auditoria: "Pré-Auditoria",
  supervisao_documental: "Supervisão Documental",
  supervisao_presencial: "Supervisão Presencial",
  renovacao: "Renovação",
  mudanca_nivel: "Mudança de Nível",
};

const TIPO_SLUG: Record<TipoAuditoria, string> = {
  "Auditoria Inicial": "auditoria_inicial",
  "Pré-Auditoria": "pre_auditoria",
  "Supervisão Documental": "supervisao_documental",
  "Supervisão Presencial": "supervisao_presencial",
  Renovação: "renovacao",
  "Mudança de Nível": "mudanca_nivel",
};

const MODALIDADE_LABEL: Record<string, Modalidade> = {
  presencial: "Presencial",
  remota: "Remota",
  hibrida: "Híbrida",
};

const MODALIDADE_SLUG: Record<Modalidade, string> = {
  Presencial: "presencial",
  Remota: "remota",
  Híbrida: "hibrida",
};

const CONCLUSAO_LABEL: Record<string, Conclusao> = {
  aprovado: "Aprovado",
  aprovado_ressalvas: "Aprovado com ressalvas",
  reprovado: "Reprovado",
};

const CONCLUSAO_SLUG: Record<Conclusao, string> = {
  Aprovado: "aprovado",
  "Aprovado com ressalvas": "aprovado_ressalvas",
  Reprovado: "reprovado",
};

type Nivel = "I" | "II" | "III" | "IV";
const NIVEIS: Nivel[] = ["I", "II", "III", "IV"];

function nivel(n: string | null, fallback: Nivel = "III"): Nivel {
  return NIVEIS.includes(n as Nivel) ? (n as Nivel) : fallback;
}

export function toAuditoria(dto: AuditoriaDto): Auditoria {
  return {
    id: dto.id,
    tipo: TIPO_LABEL[dto.tipo] ?? "Pré-Auditoria",
    data: dto.data_auditoria,
    empresa: "",
    auditor: dto.auditor_nome ?? "—",
    modalidade: MODALIDADE_LABEL[dto.modalidade] ?? "Presencial",
    duracao: dto.duracao_horas ? `${dto.duracao_horas}h` : "—",
    nivelAuditado: nivel(dto.nivel_auditado),
    nivelRecomendado: nivel(dto.nivel_recomendado, nivel(dto.nivel_auditado)),
    conclusao: CONCLUSAO_LABEL[dto.conclusao] ?? "Aprovado",
    criticidades: 0,
    parecer: dto.parecer_geral ?? "",
    obs: "",
  };
}

export async function listarAuditorias(): Promise<Auditoria[]> {
  const dtos = await apiFetch<AuditoriaDto[]>("/api/auditorias");
  return dtos.map(toAuditoria);
}

export function criarAuditoria(input: NovaAuditoriaInput): Promise<AuditoriaDto> {
  const duracaoMatch = input.duracao.match(/(\d+)/);
  const body = {
    tipo: TIPO_SLUG[input.tipo] ?? "pre_auditoria",
    modalidade: MODALIDADE_SLUG[input.modalidade] ?? "presencial",
    data_auditoria: input.data,
    duracao_horas: duracaoMatch ? Number(duracaoMatch[1]) : null,
    nivel_auditado: input.nivelAuditado,
    nivel_recomendado: input.nivelRecomendado,
    parecer_geral: input.parecer,
    conclusao: CONCLUSAO_SLUG[input.conclusao] ?? "pendente",
    auditor_nome: input.auditor,
  };
  return apiFetch<AuditoriaDto>("/api/auditorias", { method: "POST", body: JSON.stringify(body) });
}

/* ── Certificações ──────────────────────────────────────────────── */

export interface CertificacaoDto {
  id: string;
  nivel: string;
  data_certificacao: string;
  data_validade: string;
  entidade_certificadora: string;
  status: string;
  numero_certificado: string | null;
  observacoes: string | null;
}

export function listarCertificacoes(): Promise<CertificacaoDto[]> {
  return apiFetch<CertificacaoDto[]>("/api/certificacoes");
}
