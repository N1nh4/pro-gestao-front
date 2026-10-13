/* ==========================================================================
   DOCUMENTOS MODELOS (mock) — portado de DOCS_MODELOS_DB
   Fase 7 — /documentos
   ========================================================================== */

export type TipoDoc = "PDF" | "DOCX" | "XLSX" | "TXT" | "ZIP" | "PPTX";

export interface DocModelo {
  id: string;
  dim: "CI" | "GC" | "EP";
  req: string;
  reqNome: string;
  acao: string;
  titulo: string;
  descricao: string;
  tipo: TipoDoc;
  tags: string[];
  versao: string;
  status: "vigente" | "obsoleto";
  arquivo?: string | null;
}

export const DOCS: DocModelo[] = [
  { id: "dm001", dim: "CI", req: "3.1.1", reqNome: "Mapeamento das Atividades", acao: "Mapeamento documentado", titulo: "Modelo de Mapeamento de Processos", descricao: "Template para documentação dos processos.", tipo: "DOCX", tags: ["mapeamento", "processos"], versao: "v2.1", status: "vigente" },
  { id: "dm002", dim: "CI", req: "3.1.2", reqNome: "Capacitação", acao: "Plano de capacitação", titulo: "Modelo de Plano de Capacitação", descricao: "Plano anual de capacitação.", tipo: "XLSX", tags: ["capacitação", "plano"], versao: "v1.0", status: "vigente" },
  { id: "dm003", dim: "CI", req: "3.1.3", reqNome: "Certificação dos Dirigentes", acao: "Comprovação de certificação", titulo: "Checklist de Certificação", descricao: "Checklist para validade.", tipo: "PDF", tags: ["certificação", "dirigentes"], versao: "v1.2", status: "vigente" },
  { id: "dm004", dim: "CI", req: "3.1.5", reqNome: "Adesão ao CADPREV", acao: "Comprovação CADPREV", titulo: "Guia de Adesão ao CADPREV", descricao: "Passo a passo.", tipo: "PDF", tags: ["CADPREV", "MPS"], versao: "v1.0", status: "vigente" },
  { id: "dm005", dim: "CI", req: "3.1.6", reqNome: "Controles Internos", acao: "Manual de CI", titulo: "Manual de Controles Internos", descricao: "Modelo de manual.", tipo: "DOCX", tags: ["controles", "manual"], versao: "v3.0", status: "vigente" },
  { id: "dm006", dim: "GC", req: "3.2.1", reqNome: "Política de Investimentos", acao: "Política aprovada", titulo: "Modelo de Política de Investimentos", descricao: "Conforme CMN.", tipo: "DOCX", tags: ["investimentos", "política"], versao: "v2.0", status: "vigente" },
  { id: "dm007", dim: "GC", req: "3.2.2", reqNome: "Planejamento Estratégico", acao: "Plano quinquenal", titulo: "Modelo de Planejamento Estratégico", descricao: "Estrutura BSC.", tipo: "XLSX", tags: ["estratégico", "BSC"], versao: "v1.5", status: "vigente" },
  { id: "dm008", dim: "GC", req: "3.2.2", reqNome: "Planejamento Estratégico", acao: "Plano de Ação Anual", titulo: "Modelo de Plano de Ação Anual", descricao: "Planilha com metas.", tipo: "XLSX", tags: ["plano", "anual"], versao: "v2.2", status: "vigente" },
  { id: "dm009", dim: "GC", req: "3.2.5", reqNome: "Instâncias de Deliberação", acao: "Regimento interno", titulo: "Modelo de Regimento Interno", descricao: "CD e CF.", tipo: "DOCX", tags: ["conselho", "regimento"], versao: "v1.0", status: "vigente" },
  { id: "dm010", dim: "GC", req: "3.2.7", reqNome: "Código de Ética", acao: "Código aprovado", titulo: "Modelo de Código de Ética", descricao: "Conflito de interesses.", tipo: "PDF", tags: ["ética", "conduta"], versao: "v1.1", status: "vigente" },
  { id: "dm011", dim: "GC", req: "3.2.8", reqNome: "Transparência", acao: "Relatório de Gestão", titulo: "Modelo de Relatório de Gestão Anual", descricao: "Template RGA.", tipo: "DOCX", tags: ["transparência", "relatório"], versao: "v3.1", status: "vigente" },
  { id: "dm012", dim: "GC", req: "3.2.8", reqNome: "Transparência", acao: "Demonstrações mensais", titulo: "Modelo de Demonstrações Mensais", descricao: "Para portal.", tipo: "XLSX", tags: ["demonstrações", "portal"], versao: "v2.0", status: "vigente" },
  { id: "dm013", dim: "EP", req: "3.3.1", reqNome: "Educação Previdenciária", acao: "Plano anual", titulo: "Modelo de Plano de Educação Previd.", descricao: "Objetivos e indicadores.", tipo: "DOCX", tags: ["educação", "previdência"], versao: "v1.3", status: "vigente" },
  { id: "dm014", dim: "EP", req: "3.3.2", reqNome: "Programa de Educação", acao: "Relatório de ações", titulo: "Modelo de Relatório de Educação", descricao: "Registro de ações.", tipo: "DOCX", tags: ["educação", "relatório"], versao: "v1.0", status: "vigente" },
];

export const DIM_LABEL: Record<"CI" | "GC" | "EP", string> = {
  CI: "3.1 · Controles Internos",
  GC: "3.2 · Governança Corporativa",
  EP: "3.3 · Educação Previdenciária",
};

export const TIPO_TONE: Record<TipoDoc, string> = {
  PDF: "bg-red3 text-red2",
  DOCX: "bg-acc3 text-acc2",
  XLSX: "bg-grn3 text-grn2",
  TXT: "bg-bg3 text-t3",
  ZIP: "bg-amb3 text-amb2",
  PPTX: "bg-prp3 text-prp2",
};
