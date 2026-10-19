/* ==========================================================================
   UNIDADES — tipo e helper (sem dados).
   As unidades são carregadas da API (/api/unidades).
   ========================================================================== */

export interface Unidade {
  id: string;
  sigla: string;
  nome: string;
  ativo?: boolean;
}

export function unidadeById(id: string, unidades: Unidade[] = []): Unidade | undefined {
  return unidades.find((u) => u.id === id);
}
