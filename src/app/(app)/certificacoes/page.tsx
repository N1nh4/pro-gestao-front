"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
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
import { setPrimaryAction } from "@/lib/primaryAction";
import { useApiResource } from "@/lib/useApiResource";

function formatarData(data: string | null) {
  if (!data) return "—";
  const parsed = new Date(`${data}T12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? data
    : parsed.toLocaleDateString("pt-BR");
}

function statusClass(status: string) {
  if (status === "VIGENTE") return "bg-grn3 text-grn2";
  if (status === "VENCIDA" || status === "REVOGADA") return "bg-red3 text-red2";
  return "bg-amb3 text-amb2";
}

export default function CertificacoesPage() {
  const { perfil } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<CertificacaoDto | null>(null);
  const resource = useApiResource<CertificacaoDto[]>(
    "certificacoes",
    listarCertificacoes,
    [],
  );
  const isAdmin = perfil?.id === "ag" || perfil?.id === "sa";

  useEffect(() => {
    if (!isAdmin) return;
    return setPrimaryAction(() => {
      setEditando(null);
      setModalAberto(true);
    });
  }, [isAdmin]);

  async function salvar(payload: CertificacaoPayload) {
    if (editando) {
      await atualizarCertificacao(editando.id_certificacao, {
        id_nivel: payload.id_nivel,
        nome_certificacao: payload.nome_certificacao,
        status: payload.status,
        numero_certificado: payload.numero_certificado,
        data_certificacao: payload.data_certificacao,
        data_validade: payload.data_validade,
        entidade_certificadora: payload.entidade_certificadora,
      });
      toast("Certificação atualizada", "ok");
    } else {
      await criarCertificacao(payload);
      toast("Certificação criada", "ok");
    }
    resource.reload();
  }

  async function remover(certificacao: CertificacaoDto) {
    if (
      !window.confirm(
        `Excluir a certificação "${certificacao.nome_certificacao}"?`,
      )
    )
      return;
    try {
      await removerCertificacao(certificacao.id_certificacao);
      resource.reload();
      toast("Certificação removida", "ok");
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Não foi possível remover a certificação",
        "err",
      );
    }
  }

  return (
    <div className="animate-fade-in">
      {resource.offline ? (
        <Alert variant="warn" title="API indisponível" className="mb-2">
          {resource.error ??
            "Não foi possível carregar as certificações. Tente novamente mais tarde."}
        </Alert>
      ) : null}

      {/* <Alert
        variant="info"
        title="Certificações do ente"
      >
        Acesse uma certificação para acompanhar e gerenciar seu plano de ação.
      </Alert> */}

      {resource.loading ? (
        <div className="py-10 text-center text-[11px] text-t3">
          Carregando certificações…
        </div>
      ) : resource.data.length ? (
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {resource.data.map((certificacao) => (
            <article
              key={certificacao.id_certificacao}
              className="rounded-lg border border-brd bg-bg1 p-3.5 transition-colors hover:border-brd2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-[12px] font-semibold text-t1">
                    {certificacao.nome_certificacao}
                  </h2>
                  <p className="mt-1 text-[10px] text-t3">
                    {certificacao.nome_manual} · v{certificacao.versao_manual}
                  </p>
                </div>
                <span className="shrink-0 rounded bg-acc3 px-2 py-0.5 text-[9px] font-bold text-acc2">
                  Nível {certificacao.nome_nivel}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
                <span className="text-t3">Status</span>
                <span className="justify-self-end">
                  <span
                    className={`rounded px-1.5 py-0.5 font-bold ${statusClass(certificacao.status)}`}
                  >
                    {certificacao.status}
                  </span>
                </span>
                <span className="text-t3">Certificado</span>
                <span className="truncate text-right text-t2">
                  {certificacao.numero_certificado || "—"}
                </span>
                <span className="text-t3">Validade</span>
                <span className="text-right text-t2">
                  {formatarData(certificacao.data_validade)}
                </span>
              </div>

              <div className="mt-3 flex justify-end gap-1 border-t border-brd pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditando(certificacao);
                    setModalAberto(true);
                  }}
                  disabled={!isAdmin}
                  title={
                    isAdmin ? "Editar certificação" : "Apenas Admin pode editar"
                  }
                  aria-label={`Editar certificação ${certificacao.nome_certificacao}`}
                  className="cursor-pointer rounded p-1.5 text-t3 transition-colors hover:bg-bg3 hover:text-t1 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remover(certificacao)}
                  disabled={!isAdmin}
                  title={
                    isAdmin
                      ? "Excluir certificação"
                      : "Apenas Admin pode excluir"
                  }
                  aria-label={`Excluir certificação ${certificacao.nome_certificacao}`}
                  className="cursor-pointer rounded p-1.5 text-t3 transition-colors hover:bg-red3 hover:text-red2 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Trash2 className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/certificacoes/${certificacao.id_certificacao}`,
                    )
                  }
                  title="Visualizar plano de ação"
                  aria-label={`Visualizar certificação ${certificacao.nome_certificacao}`}
                  className="cursor-pointer rounded p-1.5 text-t3 transition-colors hover:bg-bg3 hover:text-acc2"
                >
                  <Eye className="size-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : !resource.offline ? (
        <div className="mt-3 rounded-lg border border-brd bg-bg1 px-4 py-10 text-center text-[11px] text-t3">
          Nenhuma certificação cadastrada.
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
