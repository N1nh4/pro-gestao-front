import { ManualDetalhe } from "@/components/manual/ManualDetalhe";

/**
 * Detalhe de um manual (requisitos e itens).
 *
 * Rota dinâmica sem `generateStaticParams`: com `cacheComponents`, `params`
 * só existe no request time e não há shell estático útil para exibir antes.
 * A página, por isso, renderiza por requisição (`instant = false`).
 */
export const instant = false;

export default async function ManualPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idManual = Number(id);

  return <ManualDetalhe idManual={Number.isInteger(idManual) && idManual > 0 ? idManual : -1} />;
}
