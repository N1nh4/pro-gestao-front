/* ==========================================================================
   AÇÕES DO PLANO (mock) — portado de ACOES_DB em sac-progestao-demo.html.
   Base tanto do Plano de Ação (Fase 4) quanto do Diagnóstico (Fase 3).
   Será substituído por dados da API na Fase 10.
   ========================================================================== */

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

export const ACOES: AcaoPlano[] = [
  // ── 3.1.1 Mapeamento ────────────────────────────────
  {
    idAcao: "AC-001",
    req: "3.1.1",
    reqNome: "Mapeamento das Atividades das Áreas",
    item: "Benefícios",
    acao: "Mapeamento documentado do processo de concessão, revisão e manutenção de aposentadorias e pensões",
    unidadeId: "un01",
    setor: "DPR",
    prazo: "2026-09-30",
    dtEnvio: null,
    status: "PENDENTE",
    obs: "",
    hist: [],
    diligs: [],
  },
  {
    idAcao: "AC-002",
    req: "3.1.1",
    reqNome: "Mapeamento das Atividades das Áreas",
    item: "Arrecadação",
    acao: "Mapeamento da arrecadação mensal de contribuições e cobrança de débitos",
    unidadeId: "un04",
    setor: "GEFIN",
    prazo: "2026-09-30",
    dtEnvio: null,
    status: "PENDENTE",
    obs: "",
    hist: [],
    diligs: [],
  },
  {
    idAcao: "AC-003",
    req: "3.1.1",
    reqNome: "Mapeamento das Atividades das Áreas",
    item: "Arrecadação",
    acao: "Mapeamento da arrecadação mensal de contribuições e cobrança de débitos previdenciários",
    unidadeId: "un05",
    setor: "UCGR",
    prazo: "2026-09-30",
    dtEnvio: "2026-05-15",
    status: "APROVADO",
    obs: "Aprovado pelo Auditor em 20/05",
    hist: [
      { dt: "15/05", ev: "Documento enviado por UCGR" },
      { dt: "20/05", ev: "✓ Aprovado pelo Auditor Interno" },
    ],
    diligs: [],
  },
  {
    idAcao: "AC-004",
    req: "3.1.1",
    reqNome: "Mapeamento das Atividades das Áreas",
    item: "Arrecadação",
    acao: "Mapeamento da arrecadação mensal de contribuições e cobrança de débitos previdenciários",
    unidadeId: "un02",
    setor: "GEPRE",
    prazo: "2026-09-30",
    dtEnvio: "2026-06-10",
    status: "ENVIADO",
    obs: "",
    hist: [{ dt: "10/06", ev: "Documento enviado por GEPRE" }],
    diligs: [],
  },
  {
    idAcao: "AC-005",
    req: "3.1.1",
    reqNome: "Mapeamento das Atividades das Áreas",
    item: "Atendimento ao Segurado",
    acao: "Mapeamento do fluxo de atendimento presencial e remoto aos segurados",
    unidadeId: "un10",
    setor: "SEAPO",
    prazo: "2026-09-30",
    dtEnvio: "2026-06-02",
    status: "APROVADO",
    obs: "",
    hist: [
      { dt: "02/06", ev: "Enviado por SEAPO" },
      { dt: "08/06", ev: "✓ Aprovado pelo Auditor Interno" },
    ],
    diligs: [],
  },
  {
    idAcao: "AC-006",
    req: "3.1.1",
    reqNome: "Mapeamento das Atividades das Áreas",
    item: "Financeiro e Contábil",
    acao: "Mapeamento das rotinas financeiras e contabilidade do RPPS",
    unidadeId: "un04",
    setor: "GEFIN",
    prazo: "2026-09-30",
    dtEnvio: "2026-06-05",
    status: "APROVADO",
    obs: "",
    hist: [
      { dt: "05/06", ev: "Enviado por GEFIN" },
      { dt: "10/06", ev: "✓ Aprovado pelo Auditor Interno" },
    ],
    diligs: [],
  },
  {
    idAcao: "AC-007",
    req: "3.1.1",
    reqNome: "Mapeamento das Atividades das Áreas",
    item: "Concessão e Revisão",
    acao: "Mapeamento detalhado do fluxo de análise e concessão de benefícios",
    unidadeId: "un01",
    setor: "DPR",
    prazo: "2026-09-30",
    dtEnvio: null,
    status: "PENDENTE",
    obs: "",
    hist: [],
    diligs: [],
  },
  {
    idAcao: "AC-008",
    req: "3.1.1",
    reqNome: "Mapeamento das Atividades das Áreas",
    item: "Ouvidoria",
    acao: "Mapeamento dos processos da Ouvidoria e canais de manifestação",
    unidadeId: "un07",
    setor: "OUVFUMPRES",
    prazo: "2026-09-30",
    dtEnvio: null,
    status: "PENDENTE",
    obs: "",
    hist: [],
    diligs: [],
  },

  // ── 3.1.3 Certificação dirigentes ─────────────────
  {
    idAcao: "AC-011",
    req: "3.1.3",
    reqNome: "Certificação dos Dirigentes e Membros dos Conselhos",
    item: "Diretor de Previdência",
    acao: "Certificação profissional válida do Diretor de Previdência",
    unidadeId: "un01",
    setor: "DPR",
    prazo: "2026-09-30",
    dtEnvio: "2026-03-10",
    status: "APROVADO",
    obs: "",
    hist: [
      { dt: "10/03", ev: "Certificação enviada" },
      { dt: "15/03", ev: "✓ Aprovado" },
    ],
    diligs: [],
  },
  {
    idAcao: "AC-012",
    req: "3.1.3",
    reqNome: "Certificação dos Dirigentes e Membros dos Conselhos",
    item: "Conselho Deliberativo",
    acao: "Certificação profissional do Presidente do Conselho Deliberativo",
    unidadeId: "un08",
    setor: "GAB DPR",
    prazo: "2026-09-30",
    dtEnvio: "2026-03-12",
    status: "APROVADO",
    obs: "",
    hist: [
      { dt: "12/03", ev: "Enviado" },
      { dt: "14/03", ev: "✓ Aprovado" },
    ],
    diligs: [],
  },
  {
    idAcao: "AC-013",
    req: "3.1.3",
    reqNome: "Certificação dos Dirigentes e Membros dos Conselhos",
    item: "Isabela Loureiro — Gestora",
    acao: "Certificação da Gestora de Previdência — vencida em mar/2026. Renovação urgente.",
    unidadeId: "un08",
    setor: "GAB DPR",
    prazo: "2026-06-23",
    dtEnvio: "2026-03-01",
    status: "DILIGÊNCIA",
    obs: "Certificação expirada — renovação obrigatória",
    hist: [
      { dt: "01/03", ev: "Certificação enviada" },
      { dt: "01/03", ev: "⚠ Expirada — D-003 emitida pelo Auditor" },
    ],
    diligs: ["D-003"],
  },

  // ── 3.2.2 Planejamento ─────────────────────────────
  {
    idAcao: "AC-021",
    req: "3.2.2",
    reqNome: "Planejamento Estratégico",
    item: "Plano Estratégico (5 anos)",
    acao: "Planejamento Estratégico do RPPS aprovado pelo CD",
    unidadeId: "un01",
    setor: "DPR",
    prazo: "2026-03-31",
    dtEnvio: "2026-01-20",
    status: "APROVADO",
    obs: "",
    hist: [
      { dt: "20/01", ev: "Plano enviado" },
      { dt: "25/01", ev: "✓ Aprovado" },
    ],
    diligs: [],
  },
  {
    idAcao: "AC-022",
    req: "3.2.2",
    reqNome: "Planejamento Estratégico",
    item: "Plano de Ação Anual",
    acao: "Plano de Ação Anual 2026 com metas quantitativas e ata de aprovação do CD",
    unidadeId: "un04",
    setor: "GEFIN",
    prazo: "2026-03-15",
    dtEnvio: "2026-03-01",
    status: "DILIGÊNCIA",
    obs: "Plano sem ata de aprovação do CD",
    hist: [
      { dt: "01/03", ev: "v1 enviada" },
      { dt: "05/03", ev: "D-002 emitida: sem ata" },
    ],
    diligs: ["D-002"],
  },
  {
    idAcao: "AC-023",
    req: "3.2.2",
    reqNome: "Planejamento Estratégico",
    item: "Plano Plurianual (PPA)",
    acao: "PPA do ente federativo vigente com ações do RPPS inseridas",
    unidadeId: "un01",
    setor: "DPR",
    prazo: "2026-09-30",
    dtEnvio: null,
    status: "PENDENTE",
    obs: "",
    hist: [],
    diligs: [],
  },

  // ── 3.2.8 Transparência ───────────────────────────
  {
    idAcao: "AC-031",
    req: "3.2.8",
    reqNome: "Transparência — Portal do RPPS",
    item: "Balanço Anual",
    acao: "Balanço anual do RPPS publicado no portal",
    unidadeId: "un06",
    setor: "GEINP",
    prazo: "2026-06-30",
    dtEnvio: "2026-01-20",
    status: "APROVADO",
    obs: "",
    hist: [
      { dt: "20/01", ev: "Publicado no portal" },
      { dt: "22/01", ev: "✓ Aprovado" },
    ],
    diligs: [],
  },
  {
    idAcao: "AC-032",
    req: "3.2.8",
    reqNome: "Transparência — Portal do RPPS",
    item: "Relatório de Gestão",
    acao: "Relatório de Gestão anual publicado no portal",
    unidadeId: "un06",
    setor: "GEINP",
    prazo: "2026-06-30",
    dtEnvio: "2026-01-25",
    status: "APROVADO",
    obs: "",
    hist: [
      { dt: "25/01", ev: "Publicado" },
      { dt: "27/01", ev: "✓ Aprovado" },
    ],
    diligs: [],
  },
  {
    idAcao: "AC-033",
    req: "3.2.8",
    reqNome: "Transparência — Portal do RPPS",
    item: "Demonstrações Mensais",
    acao: "Demonstrações financeiras mensais jan–jun/2026 publicadas no portal",
    unidadeId: "un06",
    setor: "GEINP",
    prazo: "2026-07-17",
    dtEnvio: "2026-07-18",
    status: "ENVIADO",
    obs: "Demonstrações jan-jun/2026 enviadas",
    hist: [
      { dt: "17/03", ev: "D-001 emitida: demonstrações ausentes" },
      { dt: "18/07", ev: "v1 enviada com jan-jun/2026" },
    ],
    diligs: ["D-001"],
  },

  // ── 3.3.1 Capacitação ─────────────────────────────
  {
    idAcao: "AC-041",
    req: "3.3.1",
    reqNome: "Plano de Ação de Capacitação",
    item: "Plano de Capacitação 2026",
    acao: "Plano de Capacitação dos servidores do RPPS para 2026",
    unidadeId: "un03",
    setor: "GECOP",
    prazo: "2026-09-30",
    dtEnvio: "2026-03-15",
    status: "APROVADO",
    obs: "",
    hist: [
      { dt: "15/03", ev: "Plano enviado" },
      { dt: "20/03", ev: "✓ Aprovado" },
    ],
    diligs: [],
  },
  {
    idAcao: "AC-042",
    req: "3.3.1",
    reqNome: "Plano de Ação de Capacitação",
    item: "Capacita FUMPRES 2026",
    acao: "Comprovação de realização e certificados do Capacita FUMPRES 2026",
    unidadeId: "un03",
    setor: "GECOP",
    prazo: "2026-11-30",
    dtEnvio: null,
    status: "PENDENTE",
    obs: "",
    hist: [],
    diligs: [],
  },
  {
    idAcao: "AC-043",
    req: "3.3.1",
    reqNome: "Plano de Ação de Capacitação",
    item: "Certificados Concessão",
    acao: "Certificados dos servidores da área de concessão em capacitação técnica",
    unidadeId: "un01",
    setor: "DPR",
    prazo: "2026-11-30",
    dtEnvio: null,
    status: "PENDENTE",
    obs: "",
    hist: [],
    diligs: [],
  },
];

export function acoesDoRequisito(req: string): AcaoPlano[] {
  return ACOES.filter((a) => a.req === req);
}

/** Percentual (0–100) de ações aprovadas do requisito. */
export function pctRequisito(req: string): number {
  const acoes = acoesDoRequisito(req);
  if (!acoes.length) return 0;
  return Math.round((acoes.filter((a) => a.status === "APROVADO").length / acoes.length) * 100);
}

export function acoesAprovadas(): number {
  return ACOES.filter((a) => a.status === "APROVADO").length;
}
