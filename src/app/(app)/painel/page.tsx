"use client";

import { useRouter } from "next/navigation";
import { Award, Building, FileX, ListChecks, MessagesSquare, Target } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Kpi } from "@/components/ui/Kpi";
import { DimensaoChart } from "@/components/charts/DimensaoChart";
import { EvolucaoChart } from "@/components/charts/EvolucaoChart";
import { usePainelDrawers } from "@/components/painel/drawers";
import { contarDiligenciasVencidas } from "@/lib/domain/diligencias";
import { listarDiligencias } from "@/lib/api/diligencias";
import { useApiResource } from "@/lib/useApiResource";

export default function PainelPage() {
  const router = useRouter();
  const dilResource = useApiResource("diligencias", listarDiligencias, []);
  const diligencias = dilResource.data;
  const { verCertAtual, verCertPret, verDocsVencidos, verDiligencias } = usePainelDrawers(diligencias);
  const vencidas = contarDiligenciasVencidas(diligencias);

  return (
    <div className="animate-fade-in">
      {dilResource.offline ? (
        <Alert variant="warn" title="API indisponível — exibindo dados locais" className="mb-2">
          Não foi possível conectar à API. Os indicadores são exibidos do repositório local.
        </Alert>
      ) : null}

      <div className="mb-3 flex items-center gap-2">
        <div className="text-[11px] text-t3">
          <Building className="mr-1 inline size-3.5 text-acc2" />
          FUMPRES · Salvador/BA · Pró-Gestão v4.1 ·{" "}
          <strong className="text-t1">Nível III → IV</strong>
        </div>
        <div className="flex-1" />
        <Button
          icon={<FileX className="size-3.5 text-red2" />}
          onClick={verDocsVencidos}
        >
          8 vencidos
        </Button>
        {vencidas > 0 ? (
          <Button
            icon={<MessagesSquare className="size-3.5 text-red2" />}
            className="text-red2"
            onClick={verDiligencias}
          >
            {vencidas} dilig. vencida{vencidas > 1 ? "s" : ""}
          </Button>
        ) : null}
      </div>

      <div className="mb-3 grid grid-cols-4 gap-2.5">
        <Kpi
          label="Certificação Atual"
          value="Nível III"
          tone="text-grn2"
          delta="Vence 31/10/2026 · 127 dias"
          icon={<Award className="size-3.5 text-grn2" />}
          onClick={verCertAtual}
        />
        <Kpi
          label="Nível Pretendido"
          value="Nível IV"
          tone="text-acc2"
          delta="60,3% · 58 itens pendentes"
          icon={<Target className="size-3.5 text-acc2" />}
          bar={60}
          onClick={verCertPret}
        />
        <Kpi
          label="Diligências"
          value={String(diligencias.length)}
          tone="text-red2"
          delta={`${vencidas} vencida(s) · ${diligencias.length - vencidas} em andamento`}
          icon={<MessagesSquare className="size-3.5 text-red2" />}
          onClick={verDiligencias}
        />
        <Kpi
          label="Pendências"
          value="7"
          tone="text-amb2"
          delta="Plano de Ação"
          icon={<ListChecks className="size-3.5 text-amb2" />}
          onClick={() => router.push("/plano")}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardTitle>Conformidade por Dimensão</CardTitle>
          <DimensaoChart />
        </Card>
        <Card>
          <CardTitle>Evolução Score 2020–2026</CardTitle>
          <EvolucaoChart />
        </Card>
      </div>
    </div>
  );
}
