"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDrawer } from "@/context/DrawerContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  DIL_ST_LABEL,
  DILIGENCIAS,
  contarDiligenciasVencidas,
  type DiligenciaStatus,
} from "@/lib/mock/diligencias";
import { cn } from "@/lib/cn";

const DOCS_VENCIDOS: { nome: string; cod: string; resp: string; emitido: string; val: string; status: "BREVE" | "VENCIDO" }[] = [
  { nome: "PSI", cod: "3.1.5", resp: "GECOP", emitido: "jan/2024", val: "30/06/2026", status: "BREVE" },
  { nome: "Certificado Isabela", cod: "3.1.3", resp: "GAB DPR", emitido: "mar/2024", val: "mar/2026", status: "VENCIDO" },
  { nome: "Plano Ação 2025", cod: "3.2.2", resp: "DIR.EXEC.", emitido: "jan/2025", val: "dez/2025", status: "VENCIDO" },
  { nome: "Relatório Atuarial", cod: "3.2.3", resp: "DPR", emitido: "nov/2025", val: "dez/2025", status: "VENCIDO" },
  { nome: "Código de Ética", cod: "3.2.4", resp: "OUVIDORIA", emitido: "jan/2022", val: "jan/2026", status: "VENCIDO" },
  { nome: "Transparência Portal", cod: "3.2.8", resp: "GEINP", emitido: "jan/2025", val: "dez/2025", status: "VENCIDO" },
  { nome: "PPP atualizado", cod: "3.2.5", resp: "GEINP", emitido: "2023", val: "2025", status: "VENCIDO" },
  { nome: "Regimento CF", cod: "3.2.13", resp: "ASSGER", emitido: "jan/2022", val: "jan/2024", status: "VENCIDO" },
];

const DIL_BADGE: Record<DiligenciaStatus, string> = {
  aberta: "bg-acc3 text-acc2",
  retorno: "bg-prp3 text-prp2",
  aprovada: "bg-grn3 text-grn2",
  vencida: "bg-red3 text-red2",
  prorrogada: "bg-amb3 text-amb2",
  remitida: "bg-prp3 text-prp2",
};

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className={cn("rounded-[5px] border border-transparent bg-bg2 p-[11px]", tone)}>
      <div className="text-[8px] uppercase tracking-wide text-t3">{label}</div>
      <div className="text-[16px] font-extrabold text-t1">{value}</div>
    </div>
  );
}

function CertAtualBody() {
  return (
    <div className="grid grid-cols-2 gap-[9px]">
      <Stat label="Nível" value="III" />
      <Stat label="Organismo" value="MPS/PREVIC" />
      <Stat label="Data cert." value="22/11/2022" />
      <div className="rounded-[5px] border border-red/20 bg-red3 p-[11px]">
        <div className="text-[8px] uppercase tracking-wide text-t3">Vencimento</div>
        <div className="text-[13px] font-bold text-red2">31/10/2026</div>
      </div>
      <div className="col-span-2 rounded-[5px] bg-bg2 p-2.5 text-[10px] text-t2">
        Portaria SRPC nº 236/2026 · Manual Pró-Gestão v4.1 · 22 ações atendidas
      </div>
    </div>
  );
}

function CertPretBody() {
  const rows: [string, string, string?][] = [
    ["% aderência atual", "60,3%"],
    ["Itens concluídos", "88 / 146", "text-grn2"],
    ["Itens pendentes", "58", "text-amb2"],
    ["Essenciais críticos", "2 (bloqueantes)", "text-red2"],
    ["Estimativa de conclusão", "Q4/2026", "text-acc2"],
    ["Empresa de auditoria", "IEPREV Certificações"],
  ];
  return (
    <div className="text-[11px] leading-relaxed text-t2">
      <div className="mb-2.5 rounded-[5px] border border-acc/20 bg-acc3 p-2.5">
        <div className="text-[9px] text-t3">Nível pretendido</div>
        <div className="text-xl font-extrabold text-acc2">IV</div>
      </div>
      <div className="flex flex-col gap-1.5">
        {rows.map(([label, value, tone]) => (
          <div key={label} className="flex justify-between">
            <span className="text-t3">{label}</span>
            <strong className={cn("font-bold text-t1", tone)}>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocsVencidosBody() {
  return (
    <div className="flex flex-col gap-1.5">
      {DOCS_VENCIDOS.map((doc) => {
        const venc = doc.status === "VENCIDO";
        return (
          <div
            key={`${doc.nome}-${doc.cod}`}
            className={cn(
              "rounded border p-2.5",
              venc ? "border-red/25 bg-red3" : "border-amb/25 bg-amb3",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-t1">{doc.nome}</span>
              <Badge className={venc ? "bg-red/20 text-red2" : "bg-amb/20 text-amb2"}>
                {doc.status}
              </Badge>
            </div>
            <div className="mt-0.5 text-[9px] text-t3">
              {doc.cod} · {doc.resp} · Emitido: {doc.emitido} · Val: {doc.val}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DiligListBody({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex flex-col gap-2">
      {DILIGENCIAS.map((d) => {
        const vencida = d.status === "vencida";
        return (
          <button
            key={d.num}
            type="button"
            onClick={onOpen}
            className={cn(
              "cursor-pointer rounded-[5px] border p-2.5 text-left transition-colors",
              vencida
                ? "border-red/25 bg-red3 hover:border-red/50"
                : "border-amb/25 bg-amb3 hover:border-amb/50",
            )}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className={cn("text-[11px] font-bold", vencida ? "text-red2" : "text-amb2")}>
                D-{d.num} · {d.cod}
              </span>
              <Badge className={DIL_BADGE[d.status]}>{DIL_ST_LABEL[d.status].toUpperCase()}</Badge>
            </div>
            <div className="mb-0.5 text-[10px] text-t2">{d.situacao}</div>
            <div className="text-[9px] text-t3">
              {d.setor} · Prazo: {d.prazo}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/** Abre os drawers do Painel Executivo. */
export function usePainelDrawers() {
  const { openDrawer, closeDrawer } = useDrawer();
  const router = useRouter();

  const abrirPlano = useCallback(() => {
    closeDrawer();
    router.push("/plano");
  }, [closeDrawer, router]);

  const verCertAtual = useCallback(
    () =>
      openDrawer({
        title: "Certificação Atual",
        sub: "FUMPRES · Nível III · Salvador/BA",
        body: <CertAtualBody />,
      }),
    [openDrawer],
  );

  const verCertPret = useCallback(
    () =>
      openDrawer({
        title: "Nível Pretendido",
        sub: "Nível IV · 60,3% · 58 itens pendentes",
        body: <CertPretBody />,
      }),
    [openDrawer],
  );

  const verDocsVencidos = useCallback(
    () =>
      openDrawer({
        title: "Documentos Vencidos",
        sub: "8 documentos requerem renovação",
        body: <DocsVencidosBody />,
      }),
    [openDrawer],
  );

  const verDiligencias = useCallback(
    () =>
      openDrawer({
        title: "Diligências",
        sub: `${contarDiligenciasVencidas()} vencida(s) · ${DILIGENCIAS.length - contarDiligenciasVencidas()} em andamento`,
        body: <DiligListBody onOpen={abrirPlano} />,
        footer: (
          <Button variant="pri" onClick={abrirPlano}>
            Abrir Plano de Ação
          </Button>
        ),
      }),
    [openDrawer, abrirPlano],
  );

  return { verCertAtual, verCertPret, verDocsVencidos, verDiligencias };
}
