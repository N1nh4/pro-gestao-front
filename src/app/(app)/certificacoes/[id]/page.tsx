import { CertificacaoDetalhe } from "@/components/certificacoes/CertificacaoDetalhe";

export const instant = false;

export default async function CertificacaoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idCertificacao = Number(id);
  return (
    <CertificacaoDetalhe
      idCertificacao={
        Number.isSafeInteger(idCertificacao) && idCertificacao > 0 ? idCertificacao : 0
      }
    />
  );
}
