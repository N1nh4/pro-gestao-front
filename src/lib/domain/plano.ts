/* ==========================================================================
   PLANO DE AÇÃO — tipos e helpers (sem dados).
   As ações são carregadas da API (/api/acoes) — tudo por ID.
   ========================================================================== */

export type AcaoStatus = "PENDENTE" | "ENVIADO" | "APROVADO" | "DILIGÊNCIA";

export interface AcaoHist {
  dt: string;
  ev: string;
}

export interface DocumentoAcao {
  id: string;
  nomeArquivo: string;
  tipoArquivo: string;
  versao: number | null;
  tamanhoBytes: number | null;
  enviadoEm: string | null;
}

export interface AcaoPlano {
  idAcao: number;
  idCertificacao: number;
  idRequisito: number;
  idItem: number | null;
  req: string;
  reqNome: string;
  item: string;
  nome: string;
  acao: string;
  unidadeId: string;
  setor: string;
  certificacao: string;
  nivel: string;
  prazo: string;
  dtEnvio: string | null;
  status: AcaoStatus;
  obs: string;
  hist: AcaoHist[];
  diligs: string[];
  documentos: DocumentoAcao[];
}

export interface NovaAcaoInput {
  idRequisito: number;
  idItem: number;
  prazo: string;
  nome: string;
  descricao: string;
  unidadeIds: string[];
}
