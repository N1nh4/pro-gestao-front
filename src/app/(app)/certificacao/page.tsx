"use client";

import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Kpi } from "@/components/ui/Kpi";
import { listarAuditorias, type AuditoriaDto } from "@/lib/api/certificacoes";
import { conclusaoTone, rotulo, TIPO_COR } from "@/lib/domain/auditorias";
import { useApiResource } from "@/lib/useApiResource";
import { CheckCircle2, Clock, History, ShieldCheck } from "lucide-react";

function formatarData(data: string | null) {
  if (!data) return "—";
  const parsed = new Date(`${data}T12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? data
    : parsed.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CertificacaoPage() {
  const router = useRouter();
  const { data: lista, loading, offline } = useApiResource<AuditoriaDto[]>(
    "auditorias-historico",
    () => listarAuditorias(),
    [],
  );

  const ordenadas = [...lista].sort((a, b) => (a.data_auditoria < b.data_auditoria ? 1 : -1));
  const ultima = ordenadas[0];
  const aprovadas = lista.filter((a) => a.conclusao === "aprovado").length;
  const pendentes = lista.filter((a) => a.conclusao === "pendente").length;

  return (
    <div className="animate-fade-in">
      {offline ? (
        <Alert variant="warn" title="API indisponível" className="mb-2">
          Não foi possível carregar o histórico de auditorias.
        </Alert>
      ) : null}

      <Alert
        variant="info"
        title="Histórico de Auditorias"
        action={
          <Button
            onClick={() => router.push("/certificacoes")}
            className="h-6 px-2 text-[10px]"
          >
            Certificações
          </Button>
        }
      >
        Auditorias registradas nas certificações do ente. Abra uma auditoria para consultar o plano
        de ação.
      </Alert>

      <div className="mb-2.5 mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Kpi
          label="Total registradas"
          value={lista.length}
          icon={<History className="size-3 text-prp2" />}
          tone="text-prp2"
          delta="auditorias"
        />
        <Kpi
          label="Aprovadas"
          value={aprovadas}
          icon={<CheckCircle2 className="size-3 text-grn2" />}
          tone="text-grn2"
        />
        <Kpi
          label="Pendentes"
          value={pendentes}
          icon={<Clock className="size-3 text-amb2" />}
          tone="text-amb2"
        />
        <Kpi
          label="Última auditoria"
          value={ultima ? formatarData(ultima.data_auditoria) : "—"}
          icon={<ShieldCheck className="size-3 text-acc2" />}
          tone="text-acc2"
          delta={ultima ? rotulo(ultima.tipo) : "—"}
        />
      </div>

      {loading ? (
        <div className="py-10 text-center text-[11px] text-t3">Carregando auditorias…</div>
      ) : ordenadas.length ? (
        <div className="flex flex-col gap-2">
          {ordenadas.map((auditoria) => (
            <button
              key={auditoria.id}
              type="button"
              onClick={() => router.push(`/auditorias/${auditoria.id}`)}
              className="w-full cursor-pointer rounded-md border border-brd bg-bg1 px-3.5 py-3 text-left transition-colors hover:border-brd2 hover:bg-bg2"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <ShieldCheck
                  className="size-4 shrink-0"
                  style={{ color: TIPO_COR[auditoria.tipo] }}
                />
                <span className="text-[12px] font-semibold text-t1">{rotulo(auditoria.tipo)}</span>
                <span
                  className={`rounded px-2 py-0.5 text-[9px] font-bold ${conclusaoTone(auditoria.conclusao)}`}
                >
                  {rotulo(auditoria.conclusao)}
                </span>
                <div className="flex-1" />
                <span className="text-[10px] text-t3">
                  {formatarData(auditoria.data_auditoria)}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] text-t2">
                <span>{auditoria.nome_certificacao}</span>
                <span>
                  · {auditoria.nome_manual} · v{auditoria.versao_manual}
                </span>
                <span>· {rotulo(auditoria.modalidade)}</span>
                <span>· {auditoria.auditor_nome || "Auditor não informado"}</span>
                <span>· {auditoria.acoes_count} ação(ões)</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-brd bg-bg1 px-4 py-10 text-center text-[11px] text-t3">
          Nenhuma auditoria registrada.
        </div>
      )}
    </div>
  );
}
