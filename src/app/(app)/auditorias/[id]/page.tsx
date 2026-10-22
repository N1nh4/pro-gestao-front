import { notFound } from "next/navigation";
import { AuditoriaPlano } from "@/components/auditorias/AuditoriaPlano";

export const instant = false;

export default async function AuditoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id.trim()) notFound();
  return <AuditoriaPlano idAuditoria={id} />;
}
