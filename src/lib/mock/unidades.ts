/* ==========================================================================
   UNIDADES (mock) — portado de UNIDADES_CADASTRO em sac-progestao-demo.html.
   Será substituído por dados da API na Fase 10.
   ========================================================================== */

export interface Unidade {
  id: string;
  sigla: string;
  nome: string;
  ativo: boolean;
}

export const UNIDADES: Unidade[] = [
  { id: "un01", sigla: "DPR", nome: "Diretoria de Previdência", ativo: true },
  { id: "un02", sigla: "GEPRE", nome: "Gerência de Previdência", ativo: true },
  { id: "un03", sigla: "GECOP", nome: "Gerência de Controle e Pagamento", ativo: true },
  { id: "un04", sigla: "GEFIN", nome: "Gerência Financeira", ativo: true },
  { id: "un05", sigla: "UCGR", nome: "Unidade de Controle e Gest. Rec.", ativo: true },
  { id: "un06", sigla: "GEINP", nome: "Gerência de Informação e Publicidade", ativo: true },
  { id: "un07", sigla: "OUVFUMPRES", nome: "Ouvidoria FUMPRES", ativo: true },
  { id: "un08", sigla: "GAB DPR", nome: "Gabinete da Diretoria de Prev.", ativo: true },
  { id: "un09", sigla: "ASSGER", nome: "Assessoria de Gestão", ativo: true },
  { id: "un10", sigla: "SEAPO", nome: "Setor de Apoio ao Segurado", ativo: true },
];

export function unidadeById(id: string): Unidade | undefined {
  return UNIDADES.find((u) => u.id === id);
}
