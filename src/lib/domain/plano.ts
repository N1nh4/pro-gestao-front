/* ==========================================================================
   PLANO DE AÇÃO — tipos, opções de referência e helpers (sem dados).
   As ações são carregadas da API (/api/acoes).
   ========================================================================== */

import type { Unidade } from "./unidades";

export type AcaoStatus = "PENDENTE" | "ENVIADO" | "APROVADO" | "DILIGÊNCIA";

export interface AcaoHist {
  dt: string;
  ev: string;
}

export interface AcaoPlano {
  idAcao: string;
  req: string;
  reqNome: string;
  item: string;
  acao: string;
  unidadeId: string;
  setor: string;
  prazo: string;
  dtEnvio: string | null;
  status: AcaoStatus;
  obs: string;
  hist: AcaoHist[];
  diligs: string[];
}

/* -------------------------------------------------------------------------- */
/* Modal "Nova Ação" — listas de referência (manual Pró-Gestão / setores)      */
/* -------------------------------------------------------------------------- */

/** Todos os códigos de requisito oferecidos no select. */
export const REQS_TODOS: string[] = [
  "3.1.1", "3.1.2", "3.1.3", "3.1.4", "3.1.5", "3.1.6",
  "3.2.1", "3.2.2", "3.2.3", "3.2.4", "3.2.5", "3.2.6", "3.2.7",
  "3.2.8", "3.2.9", "3.3.1", "3.3.2", "3.3.3", "3.3.4",
];

/** Items conhecidos por requisito (dropdown do modal). */
export const ITEM_POR_REQ: Record<string, string[]> = {
  "3.1.1": ["Benefícios", "Arrecadação", "Investimentos", "Compensação Previdenciária",
    "Atendimento ao Segurado", "Financeiro e Contábil", "Concessão e Revisão",
    "Ouvidoria", "Cadastro de Segurados", "Tempo de Contribuição"],
  "3.1.2": ["Capacitação Inicial", "Treinamento Técnico", "Atualização Normativa"],
  "3.1.3": ["Diretor de Previdência", "Conselho Deliberativo", "Conselho Fiscal",
    "Gestora de Previdência", "Comitê de Investimentos"],
  "3.1.4": ["Plano de Capacitação", "Certificação Profissional", "Qualificação Técnica"],
  "3.1.5": ["Adesão CADPREV", "Atualização Cadastral", "Dados dos Segurados"],
  "3.1.6": ["Controles Internos", "Manuais de Procedimentos", "Segregação de Funções"],
  "3.2.1": ["Política de Investimentos", "ALM", "Benchmarks"],
  "3.2.2": ["Plano Estratégico (5 anos)", "Plano de Ação Anual", "Plano Plurianual (PPA)"],
  "3.2.3": ["Comitê de Investimentos", "Reuniões do Comitê", "Atas e Deliberações"],
  "3.2.4": ["Alienação de Bens", "Desinvestimentos", "Contratos"],
  "3.2.5": ["Conselho Deliberativo", "Conselho Fiscal", "Reuniões Plenárias"],
  "3.2.6": ["Atas de Reuniões", "Frequência de Reuniões", "Quórum"],
  "3.2.7": ["Código de Ética", "Conflito de Interesses", "Vedações"],
  "3.2.8": ["Balanço Anual", "Relatório de Gestão", "Demonstrações Mensais",
    "Portal de Transparência", "Informações ao Segurado"],
  "3.2.9": ["Canal de Denúncias", "Ouvidoria", "Respostas a Denúncias"],
  "3.3.1": ["Plano de Capacitação 2026", "Capacita FUMPRES 2026", "Certificados Concessão"],
  "3.3.2": ["Programa Educacional", "Palestras", "Workshops"],
  "3.3.3": ["Parcerias Institucionais", "Convênios", "Entidades Certificadoras"],
  "3.3.4": ["Avaliação de Resultados", "Relatório de Efetividade", "Métricas"],
};

/** Setores responsáveis oferecidos no modal. */
export const SETORES_ALL: string[] = [
  "ASSCOMP", "ASSGER", "GEPRE", "DPR", "GECOP", "GEFIN", "UDI", "SEAPO",
  "SEPEN", "SEORI", "CBE", "SEASS", "UCI", "CFOP", "GEINP", "OUVFUMPRES",
  "UCGR", "UAT", "GEPREC",
];

/** Nomes adicionais p/ requisitos sem descrição na lista de referência. */
const NOMES_EXTRA: Record<string, string> = {
  "3.3.3": "Parcerias para Educação Previdenciária",
  "3.3.4": "Avaliação das Ações de Educação Previdenciária",
};

/** Nome do requisito a partir das referências (fallback: o próprio código). */
export function nomeRequisito(cod: string): string {
  return NOMES_EXTRA[cod] ?? cod;
}

/** Opções do modal "Nova Ação": código + nome. */
export const REQS_OPCOES: { cod: string; nome: string }[] = REQS_TODOS.map((cod) => ({
  cod,
  nome: nomeRequisito(cod),
}));

/** unidadeId pela sigla do setor (fallback: "ext-<sigla>"). */
export function unidadePorSetor(setor: string, unidades: Unidade[] = []): string {
  return unidades.find((u) => u.sigla === setor)?.id ?? `ext-${setor}`;
}

/** Gera um id de ação único (AC-XXX). */
export function proximaAcaoId(existentes: AcaoPlano[]): string {
  const usados = new Set(existentes.map((a) => a.idAcao));
  let n = existentes.length + 1;
  let id = `AC-${String(n).padStart(3, "0")}`;
  while (usados.has(id)) {
    n++;
    id = `AC-${String(n).padStart(3, "0")}`;
  }
  return id;
}

export interface NovaAcaoInput {
  req: string;
  prazo: string;
  item: string;
  objetivo: string;
  setores: string[];
}

/** Monta uma ação por setor selecionado (regra do demo). */
export function montarAcoes(
  input: NovaAcaoInput,
  existentes: AcaoPlano[],
  unidades: Unidade[] = [],
): AcaoPlano[] {
  const reqNome = nomeRequisito(input.req);
  const dt = new Date().toLocaleDateString("pt-BR").slice(0, 5);
  return input.setores.map((setor) => {
    const id = proximaAcaoId(existentes);
    const acao: AcaoPlano = {
      idAcao: id,
      req: input.req,
      reqNome,
      item: input.item,
      acao: input.objetivo,
      unidadeId: unidadePorSetor(setor, unidades),
      setor,
      prazo: input.prazo,
      dtEnvio: null,
      status: "PENDENTE",
      obs: "",
      hist: [{ dt, ev: `Ação criada — ${setor}` }],
      diligs: [],
    };
    existentes.push(acao);
    return acao;
  });
}
