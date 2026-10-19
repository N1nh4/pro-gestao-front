"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { Kpi } from "@/components/ui/Kpi";
import { Button } from "@/components/ui/Button";
import { useDrawer } from "@/context/DrawerContext";
import { useToast } from "@/context/ToastContext";import { cn } from "@/lib/cn";
import {
  CONC_TONE_BG,
  CONC_TONE_TX,
  TIPO_COR,
  montarAuditoria,
  type Auditoria,
  type NovaAuditoriaInput,
} from "@/lib/domain/auditorias";
import { RegistrarAuditoriaModal } from "@/components/certificacao/RegistrarAuditoriaModal";
import { criarAuditoria, listarAuditorias } from "@/lib/api/certificacoes";
import { useApiResource } from "@/lib/useApiResource";
import { Award, CalendarDays, ListChecks, ShieldCheck, UserCheck } from "lucide-react";

function formatData(d: string) {
  try {
    return new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}

function formatDataLong(d: string) {
  try {
    return new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return d;
  }
}

function auditorShort(aud: string) {
  return aud.split(" ").slice(0, 2).join(" ");
}

export default function CertificacaoPage() {
  const { perfil } = useAuth();
  const { openDrawer } = useDrawer();
  const { toast } = useToast();

  const { data: lista, offline, setData, reload } = useApiResource<Auditoria[]>(
    "auditorias",
    listarAuditorias,
    [],
  );
  const [modalAberto, setModalAberto] = useState(false);
  const isAdmin = perfil?.id === "ag" || perfil?.id === "sa";

  const ult = [...lista].sort((a, b) => (a.data < b.data ? 1 : -1))[0];

  function nova() {
    if (!isAdmin) {
      toast("Apenas Admin do Ente registra auditoria.", "warn");
      return;
    }
    setModalAberto(true);
  }

  function salvar(input: NovaAuditoriaInput) {
    const novaAud = montarAuditoria(input, lista);
    setData((prev) => [novaAud, ...prev].sort((a, b) => (a.data < b.data ? 1 : -1)));
    criarAuditoria(input)
      .then(() => reload())
      .catch(() => toast("API offline — auditoria registrada localmente.", "warn"));
  }

  function abrir(a: Auditoria) {
    openDrawer({
      title: `${a.tipo} — ${a.id}`,
      sub: `${formatDataLong(a.data)} · ${a.empresa}`,
      body: (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded px-2.5 py-0.5 text-[10px] font-bold"
              style={{ background: "var(--bg3)", color: TIPO_COR[a.tipo] }}
            >
              {a.conclusao}
            </span>
            {a.criticidades > 0 ? (
              <span className="rounded bg-red3 px-2.5 py-0.5 text-[10px] font-bold text-red2">
                {a.criticidades} pendência(s)
              </span>
            ) : null}
          </div>
          <div className="rounded-md border border-brd bg-bg2 p-3">
            <div className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-t3">Dados da Auditoria</div>
            <dl className="grid grid-cols-[110px_1fr] gap-1.5 text-[11px]">
              <dt className="text-t3">Auditor</dt>
              <dd className="font-medium text-t1">{a.auditor}</dd>
              <dt className="text-t3">Empresa</dt>
              <dd className="font-medium text-t1">{a.empresa}</dd>
              <dt className="text-t3">Modalidade</dt>
              <dd className="font-medium text-t1">{a.modalidade}</dd>
              <dt className="text-t3">Duração</dt>
              <dd className="font-medium text-t1">{a.duracao}</dd>
              <dt className="text-t3">Nível Auditado</dt>
              <dd className="font-medium text-t1">{a.nivelAuditado}</dd>
              <dt className="text-t3">Nível Recomendado</dt>
              <dd className="font-medium text-t1">{a.nivelRecomendado}</dd>
            </dl>
          </div>
          <div className="rounded-md border border-brd bg-bg2 p-3">
            <div className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-t3">Parecer do Auditor</div>
            <div className="text-[11px] leading-relaxed text-t2">{a.parecer}</div>
            {a.obs ? (
              <div className="mt-2 rounded bg-bg3 px-2.5 py-1.5 text-[10px] text-t3">{a.obs}</div>
            ) : null}
          </div>
        </div>
      ),
    });
  }

  return (
    <div className="animate-fade-in">
      {offline ? (
        <Alert variant="warn" title="API indisponível — exibindo dados locais" className="mb-2">
          Não foi possível conectar à API. As auditorias são exibidas do repositório local.
        </Alert>
      ) : null}

      <Alert
        variant="info"
        title="Central de Certificações — Auditoria · FUMPRES · Pró-Gestão v4.1"
        action={
          isAdmin ? (
            <Button onClick={nova} variant="pri" className="h-6 px-2 text-[10px]">
              Registrar Auditoria
            </Button>
          ) : undefined
        }
      >
        Histórico de auditorias, níveis auditado/recomendado e pareceres.
      </Alert>

      <div className="mb-2.5 mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Kpi
          label="Nível Atual"
          value="III"
          icon={<Award className="size-3 text-grn2" />}
          tone="text-grn2"
          delta="FUMPRES · Salvador/BA"
        />
        <Kpi
          label="Nível Pretendido"
          value="IV"
          icon={<ListChecks className="size-3 text-acc2" />}
          tone="text-acc2"
          delta="Meta da certificação"
        />
        <Kpi
          label="Última Auditoria"
          value={ult ? formatData(ult.data) : "—"}
          icon={<CalendarDays className="size-3 text-amb2" />}
          tone="text-amb2"
          delta={ult ? `${ult.empresa} · ${auditorShort(ult.auditor)}` : "—"}
        />
        <Kpi
          label="Total Registradas"
          value={lista.length}
          icon={<UserCheck className="size-3 text-prp2" />}
          tone="text-prp2"
          delta="auditorias"
        />
      </div>

      <div className="flex flex-col gap-2">
        {lista.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => abrir(a)}
            className="w-full cursor-pointer rounded-md border border-brd bg-bg1 px-3.5 py-3 text-left transition-colors hover:border-brd2 hover:bg-bg2"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="size-4 shrink-0" style={{ color: TIPO_COR[a.tipo] }} />
              <span className="text-[12px] font-semibold text-t1">{a.tipo}</span>
              <span className={cn("rounded px-2 py-0.5 text-[9px] font-bold", CONC_TONE_BG[a.conclusao], CONC_TONE_TX[a.conclusao])}>
                {a.conclusao}
              </span>
              {a.criticidades > 0 ? (
                <span className="rounded bg-red3 px-2 py-0.5 text-[9px] font-bold text-red2">
                  {a.criticidades} pendência(s)
                </span>
              ) : null}
              <div className="flex-1" />
              <span className="text-[10px] text-t3">{formatDataLong(a.data)}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-3 text-[10px] text-t2">
              <span>{a.empresa}</span>
              <span>· {a.auditor}</span>
              <span>· {a.modalidade}</span>
              <span>· {a.duracao}</span>
              <span className="text-t3">
                Nível: {a.nivelAuditado} → {a.nivelRecomendado}
              </span>
            </div>
          </button>
        ))}
      </div>

      {modalAberto && isAdmin ? (
        <RegistrarAuditoriaModal
          onClose={() => setModalAberto(false)}
          onSalvar={salvar}
        />
      ) : null}
    </div>
  );
}
