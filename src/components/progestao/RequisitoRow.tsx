"use client";

import {
  BookOpen,
  Building2,
  Circle,
  CircleCheck,
  Clock,
  Info,
  ListChecks,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  acoesDoRequisito,
  type AcaoPlano,
  type AcaoStatus,
} from "@/lib/mock/acoes";
import { temDiligenciaAberta } from "@/lib/mock/diligencias";
import { DETALHE, type NivelPG, type Requisito } from "@/lib/mock/progestao";
import { unidadeById } from "@/lib/mock/unidades";

const DIM_TONE: Record<Requisito["dim"], string> = {
  CI: "bg-acc3 text-acc2",
  GC: "bg-prp3 text-prp2",
  EP: "bg-grn3 text-grn2",
};

interface StatusInfo {
  label: string;
  className: string;
  bar: string;
  Icon: typeof CircleCheck;
}

function statusRequisito(pct: number, dilig: boolean): StatusInfo {
  if (dilig) {
    return { label: "Diligência aberta", className: "bg-red3 text-red2", bar: "bg-red2", Icon: TriangleAlert };
  }
  if (pct === 100) {
    return { label: "Concluído", className: "bg-grn3 text-grn2", bar: "bg-grn2", Icon: CircleCheck };
  }
  if (pct > 0) {
    return { label: "Em andamento", className: "bg-amb3 text-amb2", bar: "bg-amb2", Icon: Clock };
  }
  return { label: "Não iniciado", className: "bg-bg3 text-t3", bar: "bg-brd2", Icon: Circle };
}

const ACAO_STATUS_TONE: Record<AcaoStatus, string> = {
  APROVADO: "bg-grn3 text-grn2",
  ENVIADO: "bg-amb3 text-amb2",
  PENDENTE: "bg-bg3 text-t3",
  DILIGÊNCIA: "bg-red3 text-red2",
};

function areaStatus(acoes: AcaoPlano[], areaNome: string): AcaoStatus | undefined {
  const key = areaNome.toLowerCase().split(" ")[0];
  return acoes.find((a) => a.item && a.item.toLowerCase().includes(key))?.status;
}

function areaIcon(status: AcaoStatus | undefined) {
  if (status === "APROVADO") return <CircleCheck className="size-3 shrink-0 text-grn2" />;
  if (status === "ENVIADO") return <Clock className="size-3 shrink-0 text-amb2" />;
  if (status === "DILIGÊNCIA") return <TriangleAlert className="size-3 shrink-0 text-red2" />;
  return <Circle className="size-3 shrink-0 text-t4" />;
}

interface RequisitoRowProps {
  requisito: Requisito;
  nivelPret: NivelPG;
  isAdmin: boolean;
  expanded: boolean;
  onToggle: () => void;
}

export function RequisitoRow({ requisito, nivelPret, isAdmin, expanded, onToggle }: RequisitoRowProps) {
  const acoes = acoesDoRequisito(requisito.cod);
  const apr = acoes.filter((a) => a.status === "APROVADO").length;
  const tot = acoes.length;
  const pct = tot ? Math.round((apr / tot) * 100) : 0;
  const dilig = temDiligenciaAberta(acoes.map((a) => a.idAcao));
  const st = statusRequisito(pct, dilig);

  return (
    <div className="mb-2 overflow-hidden rounded-lg border border-brd">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-3 bg-bg1 px-3.5 py-3 text-left transition-colors hover:bg-bg2"
      >
        <div className="shrink-0 text-center">
          <div className="mb-0.5 rounded bg-acc3 px-1.5 py-0.5 font-mono text-[11px] font-bold text-acc2">
            {requisito.cod}
          </div>
          <span className={cn("rounded px-1.5 py-px text-[8px] font-bold", DIM_TONE[requisito.dim])}>
            {requisito.dim}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-bold text-t1">{requisito.desc}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-t3">
            <Building2 className="size-3" />
            {requisito.resp}
            {requisito.ess ? (
              <span className="rounded bg-red3 px-1.5 py-px text-[8px] font-bold text-red2">ESSENCIAL</span>
            ) : null}
          </div>
        </div>

        <div className="hidden w-40 shrink-0 sm:block">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[9px] text-t3">
              {apr}/{tot} ações aprovadas
            </span>
            <span className={cn("text-[11px] font-extrabold", st.className.split(" ")[1])}>{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-bg3">
            <div className={cn("h-full rounded-full transition-[width] duration-[400ms]", st.bar)} style={{ width: `${pct}%` }} />
          </div>
        </div>

        <span className={cn("flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded px-2 py-[3px] text-[9px] font-bold", st.className)}>
          <st.Icon className="size-3" />
          {st.label}
        </span>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("size-3.5 shrink-0 text-t3 transition-transform", expanded && "rotate-180")}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {expanded ? <RequisitoDetalhe requisito={requisito} nivelPret={nivelPret} isAdmin={isAdmin} acoes={acoes} /> : null}
    </div>
  );
}

function RequisitoDetalhe({
  requisito,
  nivelPret,
  isAdmin,
  acoes,
}: {
  requisito: Requisito;
  nivelPret: NivelPG;
  isAdmin: boolean;
  acoes: AcaoPlano[];
}) {
  const det = DETALHE[requisito.cod];
  const areas = det?.[nivelPret]?.areas ?? det?.IV?.areas ?? det?.III?.areas ?? det?.I?.areas ?? [];
  const opcoes = det?.[nivelPret]?.opcoes ?? [];
  const escolher = det?.[nivelPret]?.escolherOpcoes ?? 0;
  const apr = acoes.filter((a) => a.status === "APROVADO").length;

  return (
    <div className="border-t border-brd bg-bg2 p-4">
      <div className="mb-3.5 flex items-start gap-3.5">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-t3">
            <BookOpen className="size-3.5 text-acc2" />
            Manual Pró-Gestão v4.1 · Requisito {requisito.cod}
          </div>
          <div className="mb-1 text-xs font-bold text-t1">{requisito.desc}</div>
          <div className="text-[10px] text-t3">
            Responsável: <strong className="text-t2">{requisito.resp}</strong>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="mb-0.5 text-[9px] text-t3">Progresso atual</div>
          <div
            className={cn(
              "text-xl font-black",
              acoes.length && apr === acoes.length ? "text-grn2" : apr > 0 ? "text-amb2" : "text-red2",
            )}
          >
            {acoes.length ? `${Math.round((apr / acoes.length) * 100)}%` : "—"}
          </div>
          <div className="text-[9px] text-t3">
            {apr} de {acoes.length} aprovadas
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-t2">
            <ListChecks className="size-3.5 text-acc2" />
            Itens exigidos — Nível {nivelPret}
          </div>
          {areas.length ? (
            areas.map((area) => {
              const status = areaStatus(acoes, area.nome);
              const acaoArea = acoes.find((a) => a.item && a.item.toLowerCase().includes(area.nome.toLowerCase().split(" ")[0]));
              return (
                <div key={area.nome} className="mb-1.5 rounded border border-brd bg-bg1 px-2.5 py-2">
                  <div className="mb-0.5 flex items-center gap-1.5">
                    {areaIcon(status)}
                    <span className="text-[11px] font-bold text-t1">{area.nome}</span>
                    {area.docs ? (
                      <span className="ml-auto text-[8px] text-t3">
                        {area.docs} doc{area.docs > 1 ? "s" : ""}
                      </span>
                    ) : null}
                  </div>
                  <div className="pl-[19px] text-[9px] leading-relaxed text-t3">{area.desc}</div>
                  {acaoArea ? (
                    <div
                      className={cn(
                        "pl-[19px] pt-0.5 text-[8px] font-bold",
                        areaStatus(acoes, area.nome) === "APROVADO" && "text-grn2",
                        areaStatus(acoes, area.nome) === "ENVIADO" && "text-amb2",
                        areaStatus(acoes, area.nome) === "DILIGÊNCIA" && "text-red2",
                      )}
                    >
                      {acaoArea.idAcao} · {acaoArea.status}
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="p-2 text-[10px] text-t3">Detalhe não disponível para este requisito.</div>
          )}
          {opcoes.length ? (
            <div className="mt-1.5 rounded bg-bg3 px-2 py-1.5 text-[9px] text-t3">
              <Info className="mr-1 inline size-3" />
              Escolher {escolher} de {opcoes.length} opções: {opcoes.map((o) => o.nome).join(", ")}
            </div>
          ) : null}
        </div>

        <div>
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-t2">
            <ListChecks className="size-3.5 text-acc2" />
            Ações no Plano ({acoes.length})
          </div>
          {acoes.length ? (
            acoes.map((a) => {
              const un = unidadeById(a.unidadeId);
              return (
                <div key={a.idAcao} className="mb-1.5 rounded border border-brd bg-bg1 px-2.5 py-2">
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <span className="rounded bg-acc3 px-1.5 py-px font-mono text-[9px] text-acc2">{a.idAcao}</span>
                    <span className="flex-1 text-[10px] font-bold text-t1">{a.item}</span>
                    <span className={cn("rounded px-1.5 py-px text-[8px] font-bold", ACAO_STATUS_TONE[a.status])}>
                      {a.status}
                    </span>
                  </div>
                  <div className="text-[9px] text-t3">
                    {un?.sigla || a.setor || "—"} · Prazo: {a.prazo || "—"}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded border border-brd bg-bg1 px-2 py-2 text-[10px] text-t3">
              Nenhuma ação cadastrada para este requisito.
              {isAdmin ? (
                <span className="mt-1 block font-bold text-acc2">→ Ir ao Plano de Ação</span>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
