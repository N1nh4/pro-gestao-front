/* ==========================================================================
   DOCUMENTOS — tipos e rótulos (sem dados).
   Ainda não há endpoint de documentos; a lista é exibida vazia.
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
