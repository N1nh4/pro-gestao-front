"use client";

import { type AcaoPlano } from "@/lib/mock/plano";
import { type AcaoPlano as AcaoPlanoOld } from "@/lib/mock/acoes";
import { unidadeById } from "@/lib/mock/unidades";
import { DILIGENCIAS, DIL_ST_LABEL } from "@/lib/mock/diligencias";

type A = AcaoPlano | AcaoPlanoOld;

const STATUS_COR: Record<string, { bg: string; txt: string }> = {
  PENDENTE: { bg: "bg-bg3", txt: "text-t3" },
  ENVIADO: { bg: "bg-amb3", txt: "text-amb2" },
  APROVADO: { bg: "bg-grn3", txt: "text-grn2" },
  DILIGÊNCIA: { bg: "bg-red3", txt: "text-red2" },
};

function isVencida(a: A) {
  if (!a.prazo) return false;
  if (a.status === "APROVADO") return false;
  const hoje = new Date("2026-07-31");
  const p = new Date(a.prazo + "T12:00:00");
  return p < hoje;
}

function formatDate(s: string | null) {
  if (!s) return "-";
  try {
    return new Date(s + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(" de ", "/");
  } catch {
    return s;
  }
}

export function AcoesTable({
  acoes,
  isOp,
  unidadeAtual,
}: {
  acoes: A[];
  isOp: boolean;
  unidadeAtual: string | null;
}) {
  // filtro por unidade p/ op já deve vir feito na página; mantém simples
  const data = isOp && unidadeAtual ? acoes.filter((a) => a.unidadeId === unidadeAtual) : acoes;

  return (
    <div className="overflow-hidden rounded-lg border border-brd bg-bg1">
      <div className="grid grid-cols-[70px_70px_120px_1fr_80px_110px_80px_90px_70px] gap-0 bg-bg3 px-3 py-1.5 text-[8px] font-bold uppercase tracking-wide text-t3">
        <div>ID_AÇÃO</div>
        <div>REQUISITO</div>
        <div>ITEM</div>
        <div>AÇÃO</div>
        <div>UNIDADE</div>
        <div>STATUS</div>
        <div>PRAZO</div>
        <div>DT_ENVIO</div>
        <div />
      </div>
      {data.map((a) => {
        const un = unidadeById(a.unidadeId);
        const st = STATUS_COR[a.status] || STATUS_COR.PENDENTE;
        const venc = isVencida(a);
        const dil = DILIGENCIAS.filter((d) => a.diligs.includes(d.num) || a.diligs.includes(`D-${d.num}`));
        return (
          <div key={a.idAcao} className="border-t border-brd">
            <div className="grid grid-cols-[70px_70px_120px_1fr_80px_110px_80px_90px_70px] items-center gap-0 px-3 py-2">
              <div className="font-mono text-[9px] font-bold text-acc2">{a.idAcao}</div>
              <div className="font-mono text-[9px] text-t3">{a.req}</div>
              <div className="truncate text-[10px] font-semibold text-t2">{a.item}</div>
              <div className="truncate pr-2 text-[10px] text-t1">{a.acao}</div>
              <div className="text-[9px] font-semibold text-t2">{un?.sigla || a.setor}</div>
              <div>
                <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${st.bg} ${st.txt}`}>{a.status}</span>
              </div>
              <div className={`text-[10px] font-semibold ${venc ? "text-red2" : "text-t2"}`}>{formatDate(a.prazo)}</div>
              <div className={`text-[10px] ${a.dtEnvio ? "text-grn2" : "text-t4"}`}>{formatDate(a.dtEnvio)}</div>
              <div className="text-center text-[10px] text-t4">...</div>
            </div>
            {dil.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-t border-brd px-3 py-1.5">
                {dil.map((d) => (
                  <span key={d.num} className="rounded bg-red3 px-1.5 py-0.5 text-[8px] font-bold text-red2">
                    D-{d.num} · {DIL_ST_LABEL[d.status]}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
