"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDrawer } from "@/context/DrawerContext";
import { useToast } from "@/context/ToastContext";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Kpi } from "@/components/ui/Kpi";
import { DiligenciaDetalhe } from "@/components/diligencias/DiligenciaDetalhe";
import { cn } from "@/lib/cn";
import {
  CRIT_LABEL,
  CRIT_TONE,
  DILIGENCIAS,
  DIL_ST_LABEL,
  DIL_ST_TONE,
  type Criticidade,
  type Diligencia,
  type DiligenciaStatus,
} from "@/lib/mock/diligencias";
import { CalendarClock, MessageSquare } from "lucide-react";

const CYCLE_END = new Date("2026-07-31");

function estaVencida(d: Diligencia) {
  return d.status === "vencida" || new Date(d.prazo + "T12:00:00") < CYCLE_END;
}

function formatPrazo(prazo: string) {
  try {
    return new Date(prazo + "T12:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return prazo;
  }
}

export default function DiligenciasPage() {
  const { perfil } = useAuth();
  const { openDrawer, closeDrawer } = useDrawer();
  const { toast } = useToast();

  const [items, setItems] = useState<Diligencia[]>(DILIGENCIAS);
  const [st, setSt] = useState<DiligenciaStatus | "">("");
  const [crit, setCrit] = useState<Criticidade | "">("");

  const isAdmin = perfil?.id === "ag" || perfil?.id === "sa";
  const isOp = perfil?.id === "op";

  const data = useMemo(
    () =>
      items.filter((d) => {
        if (st && d.status !== st) return false;
        if (crit && d.criticidade !== crit) return false;
        return true;
      }),
    [items, st, crit],
  );

  const k = useMemo(
    () => ({
      venc: items.filter((d) => d.status === "vencida").length,
      aberta: items.filter((d) => d.status === "aberta").length,
      retorno: items.filter((d) => d.status === "retorno").length,
      aprovada: items.filter((d) => d.status === "aprovada").length,
    }),
    [items],
  );

  function responder(num: string, texto: string) {
    const ts = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    setItems((prev) =>
      prev.map((d) =>
        d.num === num
          ? {
              ...d,
              retorno: texto,
              retornoTs: ts,
              status: d.status === "aberta" || d.status === "vencida" ? "retorno" : d.status,
              hist: [...d.hist, { dt: ts.slice(0, 5), ev: "Correção enviada pelo Operacional", user: perfil?.nome }],
            }
          : d,
      ),
    );
    closeDrawer();
    toast(`Correção da D-${num} enviada. Aguardando análise do Auditor.`, "ok");
  }

  function aprovar(num: string) {
    setItems((prev) =>
      prev.map((d) =>
        d.num === num
          ? { ...d, status: "aprovada", hist: [...d.hist, { dt: "hoje", ev: "Retorno aprovado pelo Auditor", user: perfil?.nome }] }
          : d,
      ),
    );
    closeDrawer();
    toast(`D-${num} aprovada e concluída.`, "ok");
  }

  function remitir(num: string) {
    const obs = window.prompt("Nova observação para remitir a diligência:");
    if (!obs) return;
    setItems((prev) =>
      prev.map((d) =>
        d.num === num
          ? {
              ...d,
              retorno: null,
              retornoTs: null,
              situacao: obs,
              status: "aberta",
              hist: [...d.hist, { dt: "hoje", ev: `Remitida com nova observação: ${obs.substring(0, 50)}`, user: perfil?.nome }],
            }
          : d,
      ),
    );
    closeDrawer();
    toast(`D-${num} remitida com nova observação.`, "warn");
  }

  function abrir(d: Diligencia) {
    openDrawer({
      title: `D-${d.num} — ${d.cod}`,
      sub: `${d.acaoItem} · ${d.setor} · ${DIL_ST_LABEL[d.status]}`,
      body: (
        <DiligenciaDetalhe
          d={d}
          isAdmin={isAdmin}
          isOp={isOp}
          onResponder={(texto) => responder(d.num, texto)}
          onAprovar={() => aprovar(d.num)}
          onRemitir={() => remitir(d.num)}
        />
      ),
    });
  }

  return (
    <div className="animate-fade-in">
      <Alert
        variant="info"
        title={isOp ? "Responda as diligências da sua unidade" : "Diligências — Acompanhamento das pendências de auditoria"}
      >
        {isAdmin
          ? "Analise os retornos enviados e aprove ou remita as diligências em aberto."
          : isOp
            ? "Envie a correção com justificativa; o Auditor avaliará o retorno."
            : "Acompanhe as diligências emitidas durante o ciclo de auditoria."}
      </Alert>

      <div className="mb-2.5 mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Kpi label="Vencidas" value={k.venc} tone="text-red2" delta="urgente" deltaTone="text-red2" />
        <Kpi label="Aguardando resposta" value={k.aberta} tone="text-amb2" delta="do operador" deltaTone="text-amb2" />
        <Kpi label="Retorno recebido" value={k.retorno} tone="text-prp2" delta="aguardando auditor" deltaTone="text-prp2" />
        <Kpi label="Aprovadas/Concluídas" value={k.aprovada} tone="text-grn2" delta="este ciclo" deltaTone="text-grn2" />
      </div>

      <Card className="mb-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={st}
            onChange={(e) => setSt(e.target.value as DiligenciaStatus | "")}
            className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none"
          >
            <option value="">Todas as situações</option>
            <option value="vencida">Vencida</option>
            <option value="aberta">Aguardando resposta</option>
            <option value="retorno">Retorno recebido</option>
            <option value="prorrogada">Prazo prorrogado</option>
            <option value="aprovada">Aprovada</option>
            <option value="remitida">Remitida</option>
          </select>
          <select
            value={crit}
            onChange={(e) => setCrit(e.target.value as Criticidade | "")}
            className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none"
          >
            <option value="">Todas as criticidades</option>
            <option value="critica">Crítica</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
          <div className="flex-1" />
          <span className="text-[10px] text-t3">{data.length} diligência(s)</span>
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        {data.length === 0 ? (
          <Card>
            <div className="py-6 text-center text-[11px] text-t3">Nenhuma diligência encontrada.</div>
          </Card>
        ) : (
          data.map((d) => {
            const vencida = estaVencida(d);
            return (
              <button
                key={d.num}
                type="button"
                onClick={() => abrir(d)}
                className="w-full cursor-pointer rounded-md border border-brd bg-bg1 px-3.5 py-3 text-left transition-colors hover:border-brd2 hover:bg-bg2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] font-bold text-t3">D-{d.num}</span>
                  <span className="text-[12px] font-semibold text-t1">{d.cod}</span>
                  <span className="text-[11px] text-t2">{d.acaoItem}</span>
                  <div className="flex-1" />
                  <span className={cn("rounded px-2 py-0.5 text-[9px] font-bold", CRIT_TONE[d.criticidade])}>
                    {CRIT_LABEL[d.criticidade]}
                  </span>
                  <span className={cn("rounded px-2.5 py-0.5 text-[10px] font-bold", DIL_ST_TONE[d.status])}>
                    {DIL_ST_LABEL[d.status]}
                  </span>
                </div>
                <div className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-t2">{d.situacao}</div>
                <div className="mt-1.5 flex items-center gap-3 text-[10px] text-t3">
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="size-3" />
                    {d.setor}
                  </span>
                  <span className={cn("inline-flex items-center gap-1", vencida && "font-semibold text-red2")}>
                    <CalendarClock className="size-3" />
                    Prazo: {formatPrazo(d.prazo)}
                  </span>
                  {d.retorno ? <span className="inline-flex items-center gap-1 text-prp2">Retorno enviado</span> : null}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
