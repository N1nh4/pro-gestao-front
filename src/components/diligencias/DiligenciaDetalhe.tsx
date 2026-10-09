"use client";

import { useState } from "react";
import {
  CircleCheck,
  CloudUpload,
  History,
  MessageSquare,
  Paperclip,
  RefreshCw,
  Send,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  CRIT_LABEL,
  CRIT_TONE,
  DIL_ST_LABEL,
  DIL_ST_TONE,
  type Diligencia,
} from "@/lib/mock/diligencias";

interface Props {
  d: Diligencia;
  isAdmin: boolean;
  isOp: boolean;
  onResponder: (texto: string) => void;
  onAprovar: () => void;
  onRemitir: () => void;
}

function formatPrazo(prazo: string) {
  try {
    return new Date(prazo + "T12:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return prazo;
  }
}

export function DiligenciaDetalhe({ d, isAdmin, isOp, onResponder, onAprovar, onRemitir }: Props) {
  const [texto, setTexto] = useState("");
  const vencida = d.status === "vencida" || new Date(d.prazo + "T12:00:00") < new Date("2026-07-31");
  const respondeu = !!d.retorno;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded px-3 py-1 text-[11px] font-extrabold", DIL_ST_TONE[d.status])}>
          {DIL_ST_LABEL[d.status]}
        </span>
        <span className="text-[11px] text-t2">
          Prazo:{" "}
          <strong className={vencida ? "text-red2" : "text-t1"}>{formatPrazo(d.prazo)}</strong>
        </span>
        <span className={cn("rounded px-2 py-0.5 text-[10px] font-bold", CRIT_TONE[d.criticidade])}>
          {CRIT_LABEL[d.criticidade]}
        </span>
      </div>

      <div className="rounded-md border border-red/25 bg-red3 p-3">
        <div className="mb-1.5 flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-wide text-red2">
          <TriangleAlert className="size-3" />
          Situação detectada pelo Auditor
          <span className="ml-auto font-medium opacity-70">
            {d.emitidoPor} · {d.emitidoTs}
          </span>
        </div>
        <div className="text-xs font-medium leading-relaxed text-t1">{d.situacao}</div>
      </div>

      {respondeu ? (
        <div className="rounded-md border border-prp/25 bg-prp3/40 p-2.5">
          <div className="mb-1 flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-wide text-prp2">
            <MessageSquare className="size-3" />
            Retorno enviado — {d.retornoTs}
          </div>
          <div className="text-xs leading-relaxed text-t1">{d.retorno}</div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-md border border-amb/25 bg-amb3 px-3 py-2 text-[11px] font-semibold text-amb2">
          <span className="size-2 rounded-full bg-amb2" />
          Aguardando retorno do setor {d.setor}
        </div>
      )}

      {isOp && !respondeu ? (
        <div className="flex flex-col gap-2">
          <div className="rounded-md border border-dashed border-brd2 bg-bg3 px-3 py-3 text-center">
            <CloudUpload className="mx-auto mb-1 size-5 text-acc2" />
            <div className="text-[11px] font-semibold text-t1">Selecionar arquivo de correção</div>
            <div className="text-[9px] text-t3">PDF, DOCX ou XLSX · máx. 20MB</div>
          </div>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Justificativa ou descrição da correção..."
            className="h-20 resize-none rounded border border-brd2 bg-bg2 px-2.5 py-2 text-[11px] text-t1 placeholder:text-t4 focus:outline-none"
          />
          <Button variant="pri" onClick={() => onResponder(texto.trim() || "Correção enviada")}>
            <Send className="size-3.5" />
            Enviar correção
          </Button>
        </div>
      ) : null}

      {isAdmin && respondeu && d.status !== "aprovada" ? (
        <div className="flex gap-2">
          <Button variant="suc" className="flex-1 justify-center py-2" onClick={onAprovar}>
            <CircleCheck className="size-3.5" />
            Aprovar retorno
          </Button>
          <Button variant="dan" className="flex-1 justify-center py-2" onClick={onRemitir}>
            <RefreshCw className="size-3.5" />
            Remitir
          </Button>
        </div>
      ) : null}

      {d.docs.length ? (
        <div>
          <div className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-t3">
            <Paperclip className="mr-1 inline size-3 text-acc2" />
            Documentos de correção
          </div>
          {d.docs.map((doc) => (
            <div key={doc.v} className="flex items-center gap-2 rounded border border-brd bg-bg1 px-2.5 py-1.5">
              <span className="font-mono text-[9px] text-t3">v{doc.v}</span>
              <span className="flex-1 truncate text-[10px] text-t1">{doc.arq}</span>
              <span className="text-[9px] text-t4">{doc.ts}</span>
            </div>
          ))}
        </div>
      ) : null}

      {d.hist.length ? (
        <div className="border-t border-brd pt-2.5">
          <div className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-t3">
            <History className="mr-1 inline size-3 text-acc2" />
            Histórico
          </div>
          <div className="flex max-h-32 flex-col overflow-y-auto">
            {d.hist.map((h, i) => (
              <div
                key={i}
                className={cn("flex gap-2 py-1", i < d.hist.length - 1 && "border-b border-brd")}
              >
                <span className="w-9 shrink-0 font-mono text-[9px] text-t3">{h.dt}</span>
                <span className="flex-1 text-[10px] text-t2">{h.ev}</span>
                {h.user ? <span className="text-[9px] text-t4">{h.user}</span> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {d.chat.length ? (
        <div className="border-t border-brd pt-2.5">
          <div className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-t3">
            <MessageSquare className="mr-1 inline size-3 text-acc2" />
            Comunicação
          </div>
          <div className="flex flex-col gap-1.5">
            {d.chat.map((c, i) => (
              <div key={i} className={cn("flex", c.t === "out" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-md px-2.5 py-1.5 text-[10px]",
                    c.t === "out" ? "bg-acc3 text-t1" : "bg-bg3 text-t1",
                  )}
                >
                  <div className="mb-0.5 text-[8px] font-bold text-t3">
                    {c.u} · {c.ts}
                  </div>
                  {c.m}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
