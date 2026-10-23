"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, CalendarCheck, CalendarClock, Eye, Pencil, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { CertificacaoModal } from "@/components/certificacoes/CertificacaoModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  atualizarCertificacao,
  criarCertificacao,
  listarCertificacoes,
  removerCertificacao,
  type CertificacaoDto,
  type CertificacaoPayload,
} from "@/lib/api/certificacoes";
import { useApiResource } from "@/lib/useApiResource";

function formatarData(data: string | null) {
  if (!data) return "—";
  const parsed = new Date(`${data}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? data : parsed.toLocaleDateString("pt-BR");
}

const STATUS: Record<string, { pill: string; barra: string }> = {
  VIGENTE: { pill: "bg-grn3 text-grn2", barra: "bg-grn2" },
  VENCIDA: { pill: "bg-red3 text-red2", barra: "bg-red2" },
  REVOGADA: { pill: "bg-red3 text-red2", barra: "bg-red2" },
  PENDENTE: { pill: "bg-amb3 text-amb2", barra: "bg-amb2" },
};

export default function CertificacoesPage() {
  const { perfil } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<CertificacaoDto | null>(null);
  const resource = useApiResource<CertificacaoDto[]>("certificacoes", listarCertificacoes, []);
  const certificacoesOrdenadas = [...resource.data].sort((a, b) => {
    const dataA = a.criado_em ? Date.parse(a.criado_em) : 0;
    const dataB = b.criado_em ? Date.parse(b.criado_em) : 0;
    const diferenca =
      (Number.isNaN(dataB) ? 0 : dataB) - (Number.isNaN(dataA) ? 0 : dataA);
    return diferenca || b.id_certificacao - a.id_certificacao;
  });
  const isAdmin = perfil?.id === "ag" || perfil?.id === "sa";

  useEffect(() => {
    if (isAdmin) {
      router.replace("/config?tab=certificacoes");
    }
  }, [isAdmin, router]);

  if (isAdmin) {
    return <div className="py-10 text-center text-[11px] text-t3">Abrindo certificações…</div>;
  }

  async function salvar(payload: CertificacaoPayload) {
    if (editando) {
      await atualizarCertificacao(editando.id_certificacao, payload);
      toast("Certificação atualizada", "ok");
    } else {
      await criarCertificacao(payload);
      toast("Certificação criada", "ok");
    }
    resource.reload();
  }

  async function remover(certificacao: CertificacaoDto) {
    if (!window.confirm(`Excluir a certificação "${certificacao.nome_certificacao}"?`)) return;
    try {
      await removerCertificacao(certificacao.id_certificacao);
      resource.reload();
      toast("Certificação removida", "ok");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Não foi possível remover a certificação",
        "err",
      );
    }
  }

  const abrirNova = () => {
    setEditando(null);
    setModalAberto(true);
  };

  return (
    <div className="animate-fade-in">
      {resource.offline ? (
        <Alert variant="warn" title="API indisponível" className="mb-2">
          {resource.error ??
            "Não foi possível carregar as certificações. Tente novamente mais tarde."}
        </Alert>
      ) : null}

      {resource.loading ? (
        <div className="py-10 text-center text-[11px] text-t3">Carregando certificações…</div>
      ) : certificacoesOrdenadas.length ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
        {certificacoesOrdenadas.map((certificacao) => {
            const visual = STATUS[certificacao.status] ?? {
              pill: "bg-bg3 text-t3",
              barra: "bg-brd2",
            };

            return (
              <article
                key={certificacao.id_certificacao}
                className="group relative overflow-hidden rounded-lg border border-brd bg-bg1 transition-colors hover:border-brd2"
              >
                <span className={`absolute inset-y-0 left-0 w-[3px] ${visual.barra}`} />

                <div className="flex items-start gap-3 p-4 pl-5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-acc3 text-acc2">
                    <Award className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-[13px] font-semibold leading-snug text-t1">
                      {certificacao.nome_certificacao}
                    </h2>
                    <span
                      className={`mt-1.5 inline-block rounded px-2 py-0.5 text-[9px] font-bold ${visual.pill}`}
                    >
                      {certificacao.status}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/certificacoes/${certificacao.id_certificacao}`)
                      }
                      title="Abrir certificação e auditorias"
                      aria-label={`Abrir certificação ${certificacao.nome_certificacao}`}
                      className="cursor-pointer rounded p-1.5 text-t3 transition-colors hover:bg-bg3 hover:text-acc2"
                    >
                      <Eye className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditando(certificacao);
                        setModalAberto(true);
                      }}
                      disabled={!isAdmin}
                      title={isAdmin ? "Editar certificação" : "Apenas Admin pode editar"}
                      aria-label={`Editar certificação ${certificacao.nome_certificacao}`}
                      className="cursor-pointer rounded p-1.5 text-t3 transition-colors hover:bg-bg3 hover:text-t1 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remover(certificacao)}
                      disabled={!isAdmin}
                      title={isAdmin ? "Excluir certificação" : "Apenas Admin pode excluir"}
                      aria-label={`Excluir certificação ${certificacao.nome_certificacao}`}
                      className="cursor-pointer rounded p-1.5 text-t3 transition-colors hover:bg-red3 hover:text-red2 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {certificacao.data_certificacao || certificacao.data_validade ? (
                  <div className="flex gap-6 border-t border-brd bg-bg2/40 py-2.5 pl-5 pr-4">
                    {certificacao.data_certificacao ? (
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="size-3.5 text-t3" />
                        <div>
                          <div className="text-[9px] font-semibold uppercase tracking-wide text-t3">
                            Certificada em
                          </div>
                          <div className="text-[11px] font-medium text-t2">
                            {formatarData(certificacao.data_certificacao)}
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {certificacao.data_validade ? (
                      <div className="flex items-center gap-2">
                        <CalendarClock className="size-3.5 text-t3" />
                        <div>
                          <div className="text-[9px] font-semibold uppercase tracking-wide text-t3">
                            Válida até
                          </div>
                          <div className="text-[11px] font-medium text-t2">
                            {formatarData(certificacao.data_validade)}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : !resource.offline ? (
        <div className="mt-3 flex flex-col items-center justify-center rounded-lg border border-dashed border-brd2 bg-bg1 px-4 py-12 text-center">
          <Award className="size-8 text-t4" />
          <p className="mt-2 text-[12px] font-semibold text-t2">Nenhuma certificação cadastrada</p>
          <p className="mt-0.5 text-[10px] text-t3">
            Cadastre a certificação do ente para começar a registrar auditorias.
          </p>
          {isAdmin ? (
            <button
              type="button"
              onClick={abrirNova}
              className="mt-3 cursor-pointer rounded-md bg-acc px-4 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-acc2"
            >
              Nova certificação
            </button>
          ) : null}
        </div>
      ) : null}

      {modalAberto && isAdmin ? (
        <CertificacaoModal
          certificacao={editando}
          onClose={() => setModalAberto(false)}
          onSalvar={salvar}
        />
      ) : null}
    </div>
  );
}
