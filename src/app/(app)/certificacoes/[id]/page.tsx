import { CertificacaoPlano } from "@/components/certificacoes/CertificacaoPlano";

export const instant = false;

export default async function CertificacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idCertificacao = Number(id);

  return (
    <CertificacaoPlano
      idCertificacao={
        Number.isSafeInteger(idCertificacao) && idCertificacao > 0
          ? idCertificacao
          : -1
      }
    />
  );
}
