/* ==========================================================================
   DIAGNÓSTICO PRÓ-GESTÃO (mock) — portado de PG_DATA e DETAIL em
   sac-progestao-demo.html. Será substituído por dados da API na Fase 10.
   ========================================================================== */

export type DimensaoId = "CI" | "GC" | "EP";

export const DIMENSOES: Record<DimensaoId, { codigo: string; nome: string }> = {
  CI: { codigo: "3.1", nome: "Controles Internos" },
  GC: { codigo: "3.2", nome: "Governança Corporativa" },
  EP: { codigo: "3.3", nome: "Educação Previdenciária" },
};

export type RequisitoStatus = "atendido" | "parcial" | "nao";

export interface Requisito {
  cod: string;
  dim: DimensaoId;
  desc: string;
  resp: string;
  st: RequisitoStatus;
  evid: number;
  aud: string;
  ess?: boolean;
}

export const REQUISITOS: Requisito[] = [
  { cod: "3.1.1", dim: "CI", desc: "Mapeamento das Atividades das Áreas de Atuação do RPPS", resp: "GEPRE / UCGR", st: "parcial", evid: 6, aud: "22/11/2024" },
  { cod: "3.1.2", dim: "CI", desc: "Manualização das Atividades das Áreas de Atuação do RPPS", resp: "GEPRE / UCGR", st: "parcial", evid: 6, aud: "22/11/2024" },
  { cod: "3.1.3", dim: "CI", desc: "Certificação dos Dirigentes e Membros dos Conselhos", resp: "GAB DPR", st: "parcial", evid: 3, aud: "22/11/2024" },
  { cod: "3.1.4", dim: "CI", desc: "Estrutura de Controle Interno", resp: "GECOP", st: "nao", evid: 2, aud: "22/11/2024" },
  { cod: "3.1.5", dim: "CI", desc: "Política de Segurança da Informação", resp: "GEINP", st: "parcial", evid: 2, aud: "22/11/2024" },
  { cod: "3.1.6", dim: "CI", desc: "Gestão da Base de Dados Cadastrais", resp: "GEINP", st: "parcial", evid: 2, aud: "22/11/2024" },
  { cod: "3.2.1", dim: "GC", desc: "Relatório de Governança Corporativa", resp: "GEINP", st: "atendido", evid: 7, aud: "22/11/2024" },
  { cod: "3.2.2", dim: "GC", desc: "Planejamento", resp: "DIR. EXEC.", st: "nao", evid: 1, aud: "22/11/2024" },
  { cod: "3.2.3", dim: "GC", desc: "Relatório de Gestão Atuarial", resp: "DPR", st: "parcial", evid: 3, aud: "22/11/2024" },
  { cod: "3.2.4", dim: "GC", desc: "Código de Ética e Conduta", resp: "OUVIDORIA", st: "parcial", evid: 2, aud: "22/11/2024" },
  { cod: "3.2.5", dim: "GC", desc: "Gestão de Pessoas", resp: "GEINP/DGP", st: "parcial", evid: 4, aud: "22/11/2024" },
  { cod: "3.2.6", dim: "GC", desc: "Política de Investimentos", resp: "UCGR", st: "parcial", evid: 3, aud: "22/11/2024" },
  { cod: "3.2.7", dim: "GC", desc: "Comitê de Investimentos", resp: "DPR", st: "parcial", evid: 3, aud: "22/11/2024" },
  { cod: "3.2.8", dim: "GC", desc: "Transparência", resp: "GEINP", st: "nao", evid: 15, aud: "22/11/2024" },
  { cod: "3.2.9", dim: "GC", desc: "Avaliação dos Controles Internos", resp: "GEINP/DPR", st: "parcial", evid: 2, aud: "22/11/2024" },
  { cod: "3.2.10", dim: "GC", desc: "Segregação das Atividades", resp: "GEPRE/UCGR/GEFIN", st: "atendido", evid: 2, aud: "22/11/2024" },
  { cod: "3.2.11", dim: "GC", desc: "Ouvidoria", resp: "OUVIDORIA", st: "parcial", evid: 2, aud: "22/11/2024" },
  { cod: "3.2.12", dim: "GC", desc: "Gestão de Riscos", resp: "DIR. EXEC.", st: "parcial", evid: 3, aud: "22/11/2024" },
  { cod: "3.2.13", dim: "GC", desc: "Conselho Fiscal", resp: "DPR/ASSGER", st: "parcial", evid: 4, aud: "22/11/2024" },
  { cod: "3.2.14", dim: "GC", desc: "Conselho Deliberativo", resp: "DPR/ASSGER", st: "parcial", evid: 4, aud: "22/11/2024" },
  { cod: "3.2.15", dim: "GC", desc: "Mandato e Representação", resp: "DPR/GEINP", st: "parcial", evid: 2, aud: "22/11/2024" },
  { cod: "3.2.16", dim: "GC", desc: "Avaliação dos Agentes de Investimento", resp: "DPR/GEINP", st: "parcial", evid: 2, aud: "22/11/2024" },
  { cod: "3.3.1", dim: "EP", desc: "Plano de Ação de Capacitação", resp: "GEPRE/GECOP", st: "parcial", evid: 3, aud: "22/11/2024" },
  { cod: "3.3.2", dim: "EP", desc: "Ações de Diálogo com os Segurados", resp: "DPR/GEPRE", st: "parcial", evid: 3, aud: "22/11/2024" },
];

export type NivelPG = "I" | "II" | "III" | "IV";

export interface AreaManual {
  nome: string;
  docs: number;
  desc: string;
}

export interface NivelManual {
  areas: AreaManual[];
  opcoes?: AreaManual[];
  escolherOpcoes?: number;
}

export type DetalheRequisito = Record<NivelPG, NivelManual>;

const req = (cod: string): Requisito | undefined => REQUISITOS.find((r) => r.cod === cod);
export { req as requisitoPorCodigo };

/** Nível estimado (I–IV) a partir da quantidade de ações aprovadas. */
export function nivelEstimado(totalAprovadas: number): string {
  if (totalAprovadas >= 24) return "IV";
  if (totalAprovadas >= 22) return "III";
  if (totalAprovadas >= 20) return "II";
  if (totalAprovadas >= 18) return "I";
  return "Sem cert.";
}

export const DETALHE: Record<string, DetalheRequisito> = {
  "3.1.1": {
    I: {
      areas: [
        { nome: "Benefícios", docs: 2, desc: "Concessão e revisão de aposentadorias e pensões" },
        { nome: "Arrecadação", docs: 3, desc: "Arrecadação mensal de contribuições, cobrança de débitos do ente federativo e dos servidores licenciados e cedidos" },
      ],
    },
    II: {
      areas: [
        { nome: "Benefícios", docs: 3, desc: "Concessão e revisão de aposentadorias e pensões e gestão da folha de pagamento" },
        { nome: "Arrecadação", docs: 3, desc: "Arrecadação mensal de contribuições, cobrança de débitos do ente e servidores" },
        { nome: "Investimentos", docs: 3, desc: "Processo decisório de aplicação e resgate: elaboração da política, credenciamento das instituições, alocação/desinvestimento" },
        { nome: "Compensação Previdenciária", docs: 1, desc: "Envio e análise de requerimentos de compensação previdenciária" },
      ],
    },
    III: {
      areas: [
        { nome: "Benefícios", docs: 3, desc: "Concessão e revisão de aposentadorias e pensões e gestão da folha" },
        { nome: "Arrecadação", docs: 3, desc: "Arrecadação mensal de contribuições, cobrança de débitos" },
        { nome: "Investimentos", docs: 3, desc: "Processo decisório de aplicação e resgate dos recursos" },
        { nome: "Compensação Previdenciária", docs: 1, desc: "Envio e análise de requerimentos de compensação" },
        { nome: "Atendimento", docs: 1, desc: "Atendimento presencial aos segurados, atendimento telefônico e ouvidoria" },
        { nome: "Financeiro", docs: 1, desc: "Tesouraria, orçamento e contabilidade" },
      ],
    },
    IV: {
      areas: [
        { nome: "Benefícios", docs: 3, desc: "Concessão e revisão de aposentadorias e pensões e gestão da folha" },
        { nome: "Arrecadação", docs: 3, desc: "Arrecadação mensal de contribuições, cobrança de débitos" },
        { nome: "Investimentos", docs: 3, desc: "Processo decisório de aplicação e resgate dos recursos" },
        { nome: "Compensação Previdenciária", docs: 1, desc: "Envio e análise de requerimentos de compensação" },
        { nome: "Atendimento", docs: 1, desc: "Atendimento presencial aos segurados, atendimento telefônico e ouvidoria" },
        { nome: "Financeiro", docs: 1, desc: "Tesouraria, orçamento e contabilidade" },
      ],
      opcoes: [
        { nome: "Administrativo", docs: 1, desc: "Gestão administrativa, contratos e licitações" },
        { nome: "Atuarial", docs: 1, desc: "Elaboração e revisão de avaliações atuariais" },
        { nome: "Jurídica", docs: 1, desc: "Assessoria jurídica e contencioso previdenciário" },
        { nome: "Tecnologia da Informação", docs: 1, desc: "Gestão de sistemas e infraestrutura de TI" },
      ],
      escolherOpcoes: 2,
    },
  },

  "3.1.2": {
    I: {
      areas: [
        { nome: "Benefícios", docs: 1, desc: "Manual de concessão e revisão de aposentadorias" },
        { nome: "Arrecadação", docs: 1, desc: "Manual de arrecadação e cobrança de contribuições" },
      ],
    },
    II: {
      areas: [
        { nome: "Benefícios", docs: 1, desc: "Manual de benefícios previdenciários" },
        { nome: "Arrecadação", docs: 1, desc: "Manual de arrecadação" },
        { nome: "Investimentos", docs: 1, desc: "Manual de gestão de investimentos" },
        { nome: "Compensação Previdenciária", docs: 1, desc: "Manual de compensação previdenciária" },
      ],
    },
    III: {
      areas: [
        { nome: "Benefícios", docs: 1, desc: "Manual atualizado" },
        { nome: "Arrecadação", docs: 1, desc: "Manual atualizado" },
        { nome: "Investimentos", docs: 1, desc: "Manual atualizado" },
        { nome: "Compensação Previdenciária", docs: 1, desc: "Manual atualizado" },
        { nome: "Atendimento", docs: 1, desc: "Manual de atendimento ao segurado" },
        { nome: "Financeiro", docs: 1, desc: "Manual financeiro e contábil" },
      ],
    },
    IV: {
      areas: [
        { nome: "Benefícios", docs: 1, desc: "Manual" },
        { nome: "Arrecadação", docs: 1, desc: "Manual" },
        { nome: "Investimentos", docs: 1, desc: "Manual" },
        { nome: "Compensação Previdenciária", docs: 1, desc: "Manual" },
        { nome: "Atendimento", docs: 1, desc: "Manual" },
        { nome: "Financeiro", docs: 1, desc: "Manual" },
      ],
      opcoes: [
        { nome: "Administrativo", docs: 1, desc: "Manual administrativo" },
        { nome: "Atuarial", docs: 1, desc: "Manual atuarial" },
        { nome: "Jurídica", docs: 1, desc: "Manual jurídico" },
        { nome: "Tecnologia da Informação", docs: 1, desc: "Manual de TI" },
      ],
      escolherOpcoes: 2,
    },
  },

  "3.1.3": {
    I: { areas: [{ nome: "Certificação Básica — Dirigentes e Conselheiros", docs: 1, desc: "Certificação dos dirigentes e membros dos conselhos em nível básico (RPPS Básico)" }] },
    II: {
      areas: [
        { nome: "Certificação Intermediária — Dirigentes", docs: 1, desc: "Certificação intermediária dos dirigentes e membros" },
        { nome: "Certificação — Responsável por Investimentos", docs: 1, desc: "Certificação do responsável pela gestão das aplicações dos recursos" },
      ],
    },
    III: {
      areas: [
        { nome: "Certificação Avançada — Todos os membros", docs: 1, desc: "Certificação avançada de dirigentes, conselheiros deliberativos e fiscais" },
        { nome: "Certificação — Comitê de Investimentos", docs: 1, desc: "Certificação dos membros do Comitê de Investimentos" },
      ],
    },
    IV: {
      areas: [
        { nome: "Certificação Avançada atualizada — Todos", docs: 1, desc: "Renovação e atualização de todas as certificações" },
        { nome: "Certificação — Comitê de Investimentos (renovada)", docs: 1, desc: "Renovação das certificações do Comitê" },
      ],
      opcoes: [],
      escolherOpcoes: 0,
    },
  },

  "3.1.4": {
    I: { areas: [{ nome: "Estrutura de Controle Interno — Básica", docs: 1, desc: "Documento que institui a estrutura de controle interno" }] },
    II: {
      areas: [
        { nome: "Unidade/Setor de CI", docs: 1, desc: "Designação formal da unidade ou servidor responsável pelo controle interno" },
        { nome: "Plano anual de atividades CI", docs: 1, desc: "Plano de atividades da unidade de controle interno" },
      ],
    },
    III: {
      areas: [
        { nome: "Regulamento de CI", docs: 1, desc: "Regulamento interno da unidade de controle interno" },
        { nome: "Relatório anual de CI", docs: 1, desc: "Relatório das atividades realizadas pela unidade de CI" },
      ],
    },
    IV: {
      areas: [
        { nome: "Plano plurianual de CI", docs: 1, desc: "Planejamento plurianual das atividades de controle interno" },
        { nome: "Relatório anual consolidado", docs: 1, desc: "Relatório consolidado com recomendações e providências" },
      ],
      opcoes: [],
      escolherOpcoes: 0,
    },
  },

  "3.1.5": {
    I: { areas: [{ nome: "Política de Segurança da Informação", docs: 1, desc: "Documento que institui a PSI do RPPS" }] },
    II: {
      areas: [
        { nome: "PSI aprovada pela diretoria", docs: 1, desc: "Política aprovada formalmente pela diretoria executiva" },
        { nome: "Plano de ação de segurança", docs: 1, desc: "Plano de ação para implementação da PSI" },
      ],
    },
    III: {
      areas: [
        { nome: "Normas complementares de TI", docs: 1, desc: "Normas complementares de segurança de sistemas e dados" },
        { nome: "Relatório de conformidade", docs: 1, desc: "Relatório de conformidade com a PSI" },
      ],
    },
    IV: {
      areas: [
        { nome: "Auditoria de segurança externa", docs: 1, desc: "Relatório de auditoria de segurança realizada por empresa especializada" },
        { nome: "Plano de continuidade", docs: 1, desc: "Plano de continuidade de negócio relacionado à TI" },
      ],
      opcoes: [],
      escolherOpcoes: 0,
    },
  },

  "3.1.6": {
    I: { areas: [{ nome: "Base de dados cadastrais — servidores ativos", docs: 1, desc: "Levantamento e gestão da base de servidores ativos" }] },
    II: {
      areas: [
        { nome: "Servidores ativos", docs: 1, desc: "Base atualizada de servidores ativos" },
        { nome: "Aposentados", docs: 1, desc: "Base de dados de aposentados" },
      ],
    },
    III: {
      areas: [
        { nome: "Servidores ativos", docs: 1, desc: "Base atualizada" },
        { nome: "Aposentados", docs: 1, desc: "Base atualizada" },
        { nome: "Pensionistas", docs: 1, desc: "Base de dados de pensionistas" },
      ],
    },
    IV: {
      areas: [
        { nome: "Servidores ativos", docs: 1, desc: "Base certificada" },
        { nome: "Aposentados", docs: 1, desc: "Base certificada" },
        { nome: "Pensionistas", docs: 1, desc: "Base certificada" },
        { nome: "Recadastramento periódico", docs: 1, desc: "Comprovante do último recadastramento realizado" },
      ],
      opcoes: [],
      escolherOpcoes: 0,
    },
  },

  "3.2.1": {
    I: { areas: [{ nome: "Relatório Anual de Governança — exercício anterior", docs: 1, desc: "Relatório anual de governança corporativa publicado" }] },
    II: { areas: [{ nome: "Relatório Anual completo", docs: 1, desc: "Relatório com todos os itens exigidos para Nível II" }] },
    III: { areas: [{ nome: "Relatório + Indicadores", docs: 1, desc: "Relatório com indicadores de desempenho institucional" }] },
    IV: { areas: [{ nome: "Relatório + Comparativo histórico", docs: 1, desc: "Relatório com série histórica e comparativo entre exercícios" }], opcoes: [], escolherOpcoes: 0 },
  },

  "3.2.2": {
    I: { areas: [{ nome: "Planejamento estratégico vigente", docs: 1, desc: "Documento de planejamento estratégico institucional aprovado pelo conselho" }] },
    II: {
      areas: [
        { nome: "Plano estratégico com metas", docs: 1, desc: "Planejamento com metas quantitativas e responsáveis" },
        { nome: "Relatório de execução", docs: 1, desc: "Relatório de execução do planejamento anterior" },
      ],
    },
    III: {
      areas: [
        { nome: "Plano estratégico 2026-2028", docs: 1, desc: "Planejamento aprovado em reunião formal do conselho deliberativo" },
        { nome: "Monitoramento trimestral", docs: 1, desc: "Relatórios de monitoramento das metas planejadas" },
      ],
    },
    IV: {
      areas: [
        { nome: "Plano estratégico integrado", docs: 1, desc: "Planejamento integrado com orçamento e plano atuarial" },
        { nome: "Avaliação anual", docs: 1, desc: "Avaliação formal anual do planejamento com aprovação do conselho" },
      ],
      opcoes: [],
      escolherOpcoes: 0,
    },
  },

  "3.2.3": {
    I: { areas: [{ nome: "Avaliação Atuarial vigente", docs: 1, desc: "Última avaliação atuarial realizada por atuário credenciado MIBA" }] },
    II: {
      areas: [
        { nome: "Avaliação Atuarial", docs: 1, desc: "Avaliação atuarial atualizada" },
        { nome: "Nota técnica atuarial", docs: 1, desc: "Nota técnica com premissas e resultados" },
      ],
    },
    III: {
      areas: [
        { nome: "Avaliação Atuarial", docs: 1, desc: "Avaliação atuarial" },
        { nome: "Relatório de gestão atuarial", docs: 1, desc: "Relatório com projeções e plano de equacionamento" },
      ],
    },
    IV: {
      areas: [
        { nome: "Avaliação Atuarial completa", docs: 1, desc: "Avaliação com todas as projeções exigidas" },
        { nome: "Plano de equacionamento", docs: 1, desc: "Plano de equacionamento aprovado (se houver déficit)" },
      ],
      opcoes: [],
      escolherOpcoes: 0,
    },
  },

  "3.2.4": {
    I: { areas: [{ nome: "Código de Ética aprovado", docs: 1, desc: "Código de ética e conduta aprovado pelo conselho deliberativo e publicado" }] },
    II: {
      areas: [
        { nome: "Código de Ética publicado", docs: 1, desc: "Código publicado no portal oficial" },
        { nome: "Treinamento de ética", docs: 1, desc: "Comprovante de capacitação sobre o código de ética" },
      ],
    },
    III: {
      areas: [
        { nome: "Código atualizado", docs: 1, desc: "Código revisado e atualizado" },
        { nome: "Relatório de conformidade ética", docs: 1, desc: "Relatório de ocorrências e providências" },
      ],
    },
    IV: { areas: [{ nome: "Código com canal de denúncias", docs: 1, desc: "Código integrado com canal de denúncias ativo" }], opcoes: [], escolherOpcoes: 0 },
  },

  "3.2.5": {
    I: { areas: [{ nome: "Política previdenciária de saúde", docs: 1, desc: "Política de saúde e segurança do servidor publicada" }] },
    II: {
      areas: [
        { nome: "Política de saúde", docs: 1, desc: "Política aprovada" },
        { nome: "Política de revisão por incapacidade", docs: 1, desc: "Procedimentos de revisão de aposentadoria por incapacidade" },
      ],
    },
    III: {
      areas: [
        { nome: "Política integrada", docs: 1, desc: "Política integrada de saúde, segurança e revisão" },
        { nome: "Relatório de revisões", docs: 1, desc: "Relatório das revisões de aposentadorias realizadas" },
      ],
    },
    IV: {
      areas: [
        { nome: "Política atualizada", docs: 1, desc: "Política revisada anualmente" },
        { nome: "Programa de prevenção", docs: 1, desc: "Programa de prevenção de incapacidade e reabilitação" },
      ],
      opcoes: [],
      escolherOpcoes: 0,
    },
  },

  "3.2.6": {
    I: { areas: [{ nome: "Política de Investimentos vigente", docs: 1, desc: "Política de Investimentos aprovada pelo conselho e em vigor" }] },
    II: {
      areas: [
        { nome: "PI aprovada", docs: 1, desc: "Política de Investimentos" },
        { nome: "Relatório de aderência", docs: 1, desc: "Relatório de aderência da carteira à PI" },
      ],
    },
    III: {
      areas: [
        { nome: "PI completa", docs: 1, desc: "PI com todos os segmentos e limites" },
        { nome: "Relatório semestral de aderência", docs: 1, desc: "Relatório semestral de aderência" },
      ],
    },
    IV: {
      areas: [
        { nome: "PI revisada anualmente", docs: 1, desc: "PI aprovada com revisão anual formal" },
        { nome: "Relatório de risco", docs: 1, desc: "Relatório de risco de mercado e liquidez" },
      ],
      opcoes: [],
      escolherOpcoes: 0,
    },
  },

  "3.2.7": {
    I: { areas: [{ nome: "Ato de instituição do Comitê", docs: 1, desc: "Decreto/Portaria que institui o Comitê de Investimentos" }] },
    II: {
      areas: [
        { nome: "Ato de instituição", docs: 1, desc: "Ato formal" },
        { nome: "Atas de reuniões", docs: 1, desc: "Atas das reuniões do Comitê" },
      ],
    },
    III: {
      areas: [
        { nome: "Regimento do Comitê", docs: 1, desc: "Regimento interno do Comitê de Investimentos" },
        { nome: "Atas e deliberações", docs: 1, desc: "Atas com deliberações formais documentadas" },
      ],
    },
    IV: {
      areas: [
        { nome: "Regimento atualizado", docs: 1, desc: "Regimento revisado" },
        { nome: "Relatório anual do Comitê", docs: 1, desc: "Relatório anual das atividades do Comitê" },
      ],
      opcoes: [],
      escolherOpcoes: 0,
    },
  },

  "3.2.8": {
    I: { areas: [{ nome: "Portal de transparência — básico", docs: 1, desc: "Portal com informações mínimas exigidas: CNPJ, endereço, atas, demonstrativos" }] },
    II: {
      areas: [
        { nome: "Portal com demonstrativos", docs: 1, desc: "Portal com demonstrativos financeiros e atuariais publicados" },
        { nome: "Comprovante de atualização", docs: 1, desc: "Comprovante de atualização mensal das informações" },
      ],
    },
    III: {
      areas: [
        { nome: "Portal completo", docs: 1, desc: "Portal com todas as informações do Nível III publicadas e atualizadas" },
        { nome: "Política de privacidade", docs: 1, desc: "Política de privacidade e proteção de dados publicada" },
      ],
    },
    IV: {
      areas: [
        { nome: "Portal com dados abertos", docs: 1, desc: "Portal com dados em formato aberto (csv/json)" },
        { nome: "Auditoria de transparência", docs: 1, desc: "Relatório de auditoria de transparência" },
      ],
      opcoes: [],
      escolherOpcoes: 0,
    },
  },

  "3.2.9": {
    I: { areas: [{ nome: "Definição de alçadas — Nível I", docs: 1, desc: "Documento que define os limites de alçadas para contratações e movimentações" }] },
    II: {
      areas: [
        { nome: "Tabela de alçadas aprovada", docs: 1, desc: "Tabela de limites por tipo de ato e valor" },
        { nome: "Ato de aprovação", docs: 1, desc: "Ato formal de aprovação do conselho" },
      ],
    },
    III: { areas: [{ nome: "Manual de alçadas", docs: 1, desc: "Manual detalhado de alçadas e delegações de competência" }] },
    IV: {
      areas: [
        { nome: "Manual revisado", docs: 1, desc: "Manual revisado anualmente" },
        { nome: "Relatório de controle", docs: 1, desc: "Relatório de conformidade com os limites definidos" },
      ],
      opcoes: [],
      escolherOpcoes: 0,
    },
  },

  "3.2.10": {
    I: { areas: [{ nome: "Mapeamento de segregação", docs: 1, desc: "Documento que demonstra a segregação das atividades incompatíveis" }] },
    II: {
      areas: [
        { nome: "Organograma funcional", docs: 1, desc: "Organograma com funções segregadas formalmente" },
        { nome: "Norma de segregação", docs: 1, desc: "Norma que veda acúmulo de funções incompatíveis" },
      ],
    },
    III: {
      areas: [
        { nome: "Auditoria de segregação", docs: 1, desc: "Relatório de auditoria interna sobre a segregação" },
        { nome: "Norma atualizada", docs: 1, desc: "Norma revisada e publicada" },
      ],
    },
    IV: { areas: [{ nome: "Auditoria externa de segregação", docs: 1, desc: "Auditoria externa sobre a efetividade da segregação" }], opcoes: [], escolherOpcoes: 0 },
  },

  "3.2.11": {
    I: { areas: [{ nome: "Canal de ouvidoria instituído", docs: 1, desc: "Ato que institui a ouvidoria e define responsável" }] },
    II: {
      areas: [
        { nome: "Regulamento de ouvidoria", docs: 1, desc: "Regulamento com prazos e fluxos de atendimento" },
        { nome: "Relatório semestral", docs: 1, desc: "Relatório de demandas recebidas e atendidas" },
      ],
    },
    III: {
      areas: [
        { nome: "Ouvidoria ativa e divulgada", docs: 1, desc: "Comprovante de divulgação do canal aos segurados" },
        { nome: "Relatório anual consolidado", docs: 1, desc: "Relatório anual com estatísticas" },
      ],
    },
    IV: { areas: [{ nome: "Ouvidoria com múltiplos canais", docs: 1, desc: "Ouvidoria operando via telefone, e-mail, portal e presencial" }], opcoes: [], escolherOpcoes: 0 },
  },

  "3.2.12": {
    I: { areas: [{ nome: "Ato de designação da Diretoria", docs: 1, desc: "Portaria ou decreto de nomeação dos dirigentes" }] },
    II: { areas: [{ nome: "Regimento da Diretoria", docs: 1, desc: "Regimento interno que define competências da diretoria executiva" }] },
    III: { areas: [{ nome: "Relatório de gestão da Diretoria", docs: 1, desc: "Relatório anual de gestão apresentado ao conselho" }] },
    IV: { areas: [{ nome: "Avaliação de desempenho", docs: 1, desc: "Processo formal de avaliação de desempenho dos dirigentes" }], opcoes: [], escolherOpcoes: 0 },
  },

  "3.2.13": {
    I: { areas: [{ nome: "Ato de constituição do Conselho Fiscal", docs: 1, desc: "Portaria/decreto de constituição e designação dos membros" }] },
    II: {
      areas: [
        { nome: "Regimento do Conselho Fiscal", docs: 1, desc: "Regimento interno com competências e funcionamento" },
        { nome: "Atas de reuniões", docs: 1, desc: "Atas das reuniões do Conselho Fiscal" },
      ],
    },
    III: {
      areas: [
        { nome: "Relatório anual do CF", docs: 1, desc: "Relatório anual emitido pelo Conselho Fiscal" },
        { nome: "Pareceres formais", docs: 1, desc: "Pareceres emitidos sobre as demonstrações contábeis" },
      ],
    },
    IV: { areas: [{ nome: "Relatório com recomendações", docs: 1, desc: "Relatório com recomendações e acompanhamento das providências" }], opcoes: [], escolherOpcoes: 0 },
  },

  "3.2.14": {
    I: { areas: [{ nome: "Ato de constituição do Conselho Deliberativo", docs: 1, desc: "Portaria/decreto de constituição do CD" }] },
    II: {
      areas: [
        { nome: "Regimento do CD", docs: 1, desc: "Regimento interno do Conselho Deliberativo" },
        { nome: "Atas das reuniões", docs: 1, desc: "Atas formais das reuniões do CD" },
      ],
    },
    III: { areas: [{ nome: "Relatório anual do CD", docs: 1, desc: "Relatório anual de atividades do Conselho Deliberativo" }] },
    IV: { areas: [{ nome: "Avaliação do desempenho do CD", docs: 1, desc: "Processo de autoavaliação ou avaliação externa do CD" }], opcoes: [], escolherOpcoes: 0 },
  },

  "3.2.15": {
    I: { areas: [{ nome: "Atos de mandato — Diretoria", docs: 1, desc: "Documentos que comprovam o mandato dos membros da diretoria" }] },
    II: {
      areas: [
        { nome: "Mandatos — Diretoria e CD", docs: 1, desc: "Mandatos da diretoria e do conselho deliberativo" },
        { nome: "Mandatos — Conselho Fiscal", docs: 1, desc: "Mandatos dos membros do conselho fiscal" },
      ],
    },
    III: { areas: [{ nome: "Controle de mandatos — todos os órgãos", docs: 1, desc: "Sistema/planilha de controle de início e fim de mandatos" }] },
    IV: { areas: [{ nome: "Política de mandatos e recondução", docs: 1, desc: "Política formal que disciplina mandatos, representação e limites de recondução" }], opcoes: [], escolherOpcoes: 0 },
  },

  "3.2.16": {
    I: { areas: [{ nome: "Plano de capacitação dos servidores do RPPS", docs: 1, desc: "Plano anual de capacitação dos servidores da unidade gestora" }] },
    II: {
      areas: [
        { nome: "Plano de capacitação", docs: 1, desc: "Plano aprovado" },
        { nome: "Relatório de execução", docs: 1, desc: "Relatório de execução das capacitações realizadas" },
      ],
    },
    III: {
      areas: [
        { nome: "Política de gestão de pessoas", docs: 1, desc: "Política formal de gestão de pessoas do RPPS" },
        { nome: "Avaliação de desempenho", docs: 1, desc: "Processo de avaliação de desempenho dos servidores" },
      ],
    },
    IV: { areas: [{ nome: "Programa de gestão por competências", docs: 1, desc: "Programa estruturado de gestão por competências" }], opcoes: [], escolherOpcoes: 0 },
  },

  "3.3.1": {
    I: { areas: [{ nome: "Plano de Capacitação Previdenciária — básico", docs: 1, desc: "Plano com ações de capacitação para os segurados sobre o RPPS" }] },
    II: {
      areas: [
        { nome: "Plano com metas", docs: 1, desc: "Plano de capacitação com metas de alcance definidas" },
        { nome: "Relatório de ações realizadas", docs: 1, desc: "Relatório das capacitações realizadas no exercício" },
      ],
    },
    III: {
      areas: [
        { nome: "Plano plurianual", docs: 1, desc: "Plano de capacitação com horizonte plurianual" },
        { nome: "Avaliação de efetividade", docs: 1, desc: "Pesquisa de avaliação da efetividade das ações" },
      ],
    },
    IV: { areas: [{ nome: "Programa certificado de educação previdenciária", docs: 1, desc: "Programa com certificação dos participantes e publicação dos resultados" }], opcoes: [], escolherOpcoes: 0 },
  },

  "3.3.2": {
    I: { areas: [{ nome: "Ações de comunicação com segurados", docs: 1, desc: "Registros de ações de diálogo com segurados (boletins, eventos, cartilhas)" }] },
    II: {
      areas: [
        { nome: "Ações com segurados", docs: 1, desc: "Relatório de ações realizadas" },
        { nome: "Ações com a sociedade", docs: 1, desc: "Evidências de diálogo com a sociedade em geral" },
      ],
    },
    III: {
      areas: [
        { nome: "Calendário anual de eventos", docs: 1, desc: "Calendário de eventos e ações de diálogo publicado" },
        { nome: "Relatório de participação", docs: 1, desc: "Relatório de participação e alcance das ações" },
      ],
    },
    IV: {
      areas: [
        { nome: "Programa de educação financeira", docs: 1, desc: "Programa estruturado em parceria com entidades de educação financeira" },
        { nome: "Relatório de impacto", docs: 1, desc: "Relatório de impacto das ações realizadas" },
      ],
      opcoes: [],
      escolherOpcoes: 0,
    },
  },
};
