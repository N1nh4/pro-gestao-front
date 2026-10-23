"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ClipboardList, Pencil, Plus, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Kpi } from "@/components/ui/Kpi";
import { AuditoriaModal } from "@/components/certificacoes/AuditoriaModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { listarManuais, listarNiveis, type ManualDto, type NivelDto } from "@/lib/api/catalogo";
import {
  atualizarAuditoria,
  criarAuditoria,
  listarAuditorias,
  obterCertificacao,
  removerAuditoria,
  type AuditoriaDto,
  type AuditoriaPayload,
  type CertificacaoDto,
} from "@/lib/api/certificacoes";
import { conclusaoTone, rotulo, TIPO_COR } from "@/lib/domain/auditorias";
import { setPrimaryAction } from "@/lib/primaryAction";
import { useApiResource } from "@/lib/useApiResource";

function formatarData(data: string | null) {
  if (!data) return "—";
  const parsed = new Date(`${data}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? data : parsed.toLocaleDateString("pt-BR");
}

export function CertificacaoDetalhe({ idCertificacao }: { idCertificacao: number }) {
  const { perfil } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const idValido = Number.isSafeInteger(idCertificacao) && idCertificacao > 0;
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<AuditoriaDto | null>(null);
  const [auditoriaRecemCriada, setAuditoriaRecemCriada] = useState<string | null>(null);

  const certResource = useApiResource<CertificacaoDto | null>(
    `certificacao-${idCertificacao}`,
    () => (idValido ? obterCertificacao(idCertificacao) : Promise.resolve(null)),
    null,
  );
  const audsResource = useApiResource<AuditoriaDto[]>(
    `auditorias-certificacao-${idCertificacao}`,
    () =>
      idValido
        ? listarAuditorias({ id_certificacao: idCertificacao })
        : Promise.resolve([]),
    [],
  );
  const manuaisResource = useApiResource<ManualDto[]>("manuais", listarManuais, []);
  const niveisResource = useApiResource<NivelDto[]>("niveis", listarNiveis, []);
  const certificacao = certResource.data;
  const auditorias = [...audsResource.data].sort(
    (a, b) =>
      (a.id === auditoriaRecemCriada
        ? -1
        : b.id === auditoriaRecemCriada
          ? 1
          : (Date.parse(b.criado_em ?? "") || Date.parse(b.data_auditoria)) -
            (Date.parse(a.criado_em ?? "") || Date.parse(a.data_auditoria))),
  );
  const isAdmin = perfil?.id === "ag" || perfil?.id === "sa";

  useEffect(() => {
    if (!isAdmin) return;
    return setPrimaryAction(() => {
      setEditando(null);
      setModalAberto(true);
    });
  }, [isAdmin]);

  async function salvar(payload: AuditoriaPayload) {
    if (editando) {
      const salva = await atualizarAuditoria(editando.id, payload);
      audsResource.setData((atuais) =>
        atuais.map((item) => (item.id === salva.id ? salva : item)),
      );
      toast("Auditoria atualizada", "ok");
    } else {
      const criada = await criarAuditoria(payload);
      setAuditoriaRecemCriada(criada.id);
      audsResource.setData((atuais) =>
        [criada, ...atuais.filter((item) => item.id !== criada.id)].sort(
          (a, b) =>
            (Date.parse(b.criado_em ?? "") || Date.parse(b.data_auditoria)) -
            (Date.parse(a.criado_em ?? "") || Date.parse(a.data_auditoria)),
        ),
      );
      certResource.setData((atual) =>
        atual
          ? { ...atual, auditorias_count: atual.auditorias_count + 1 }
          : atual,
      );
      toast("Auditoria criada", "ok");
    }
  }

  async function remover(auditoria: AuditoriaDto) {
    if (
      !window.confirm(
        `Excluir a auditoria ${rotulo(auditoria.tipo)} de ${formatarData(auditoria.data_auditoria)}?`,
      )
    )
      return;
    try {
      await removerAuditoria(auditoria.id);
      audsResource.reload();
      certResource.reload();
      toast("Auditoria removida", "ok");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Não foi possível remover a auditoria", "err");
    }
  }

  const totalAcoes = auditorias.reduce((soma, a) => soma + a.acoes_count, 0);

  return (
    <div className="animate-fade-in">
      {certResource.offline || audsResource.offline ? (
        <Alert variant="warn" title="API indisponível" className="mb-2">
          Não foi possível carregar a certificação e suas auditorias.
        </Alert>
      ) : null}

      <Alert
        variant="info"
        title={certificacao ? certificacao.nome_certificacao : "Certificação"}
        action={
          <Button onClick={() => router.push("/certificacoes")} className="h-6 px-2 text-[10px]">
            <ArrowLeft className="size-3" />
            Certificações
          </Button>
        }
      >
        {certResource.loading
          ? "Carregando certificação…"
          : certificacao
            ? `${certificacao.entidade_certificadora || "Entidade não informada"} · Certificado ${certificacao.numero_certificado || "—"} · Validade ${formatarData(certificacao.data_validade)}.`
            : "A certificação solicitada não foi encontrada."}
      </Alert>

      {!idValido || (!certResource.loading && !certificacao) ? (
        <Alert variant="warn" title="Certificação indisponível" className="mt-2">
          Verifique o endereço ou selecione uma certificação cadastrada.
        </Alert>
      ) : null}

      {certificacao ? (
        <>
          <div className="mb-3 mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Kpi
              label="Status"
              value={certificacao.status}
              tone={certificacao.status === "VIGENTE" ? "text-grn2" : "text-amb2"}
            />
            <Kpi
              label="Auditorias"
              value={auditorias.length}
              tone="text-acc2"
              delta="manual + nível"
            />
            <Kpi label="Ações no plano" value={totalAcoes} tone="text-prp2" />
            <Kpi
              label="Validade"
              value={formatarData(certificacao.data_validade)}
              tone="text-t2"
            />
          </div>

          <Card className="mb-2.5">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-[12px] font-bold text-t1">Auditorias da certificação</h2>
                <p className="mt-0.5 text-[10px] text-t3">
                  Cada auditoria seleciona um manual e um nível e guarda o seu plano de ação.
                </p>
              </div>
              {isAdmin ? (
                <Button
                  variant="pri"
                  className="h-6 px-2 text-[10px]"
                  onClick={() => {
                    setEditando(null);
                    setModalAberto(true);
                  }}
                >
                  <Plus className="size-3" />
                  Nova auditoria
                </Button>
              ) : null}
            </div>

            {audsResource.loading ? (
              <div className="py-6 text-center text-[11px] text-t3">Carregando auditorias…</div>
            ) : auditorias.length ? (
              <div className="flex flex-col gap-2">
                {auditorias.map((auditoria) => (
                  <div
                    key={auditoria.id}
                    className="rounded-md border border-brd bg-bg2 px-3.5 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="text-[12px] font-semibold text-t1"
                        style={{ color: TIPO_COR[auditoria.tipo] }}
                      >
                        {rotulo(auditoria.tipo)}
                      </span>
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
                      <span>
                        {auditoria.nome_manual} · v{auditoria.versao_manual}
                      </span>
                      <span>· {rotulo(auditoria.modalidade)}</span>
                      <span>· {auditoria.auditor_nome || "Auditor não informado"}</span>
                      <span>· {auditoria.acoes_count} ação(ões)</span>
                    </div>
                    {auditoria.parecer_geral ? (
                      <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-t3">
                        {auditoria.parecer_geral}
                      </p>
                    ) : null}
                    <div className="mt-2 flex justify-end gap-1 border-t border-brd pt-2">
                      <button
                        type="button"
                        onClick={() => router.push(`/plano-de-acao/${auditoria.id}`)}
                        title="Abrir plano de ação"
                        aria-label={`Abrir plano da auditoria de ${formatarData(auditoria.data_auditoria)}`}
                        className="cursor-pointer rounded p-1.5 text-t3 transition-colors hover:bg-bg3 hover:text-acc2"
                      >
                        <ClipboardList className="size-3.5" />
                      </button>
                      {isAdmin ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditando(auditoria);
                              setModalAberto(true);
                            }}
                            title="Editar auditoria"
                            aria-label="Editar auditoria"
                            className="cursor-pointer rounded p-1.5 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => remover(auditoria)}
                            title="Excluir auditoria"
                            aria-label="Excluir auditoria"
                            className="cursor-pointer rounded p-1.5 text-t3 transition-colors hover:bg-red3 hover:text-red2"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-brd bg-bg2 px-4 py-8 text-center text-[11px] text-t3">
                Nenhuma auditoria cadastrada nesta certificação.
              </div>
            )}
          </Card>

          {modalAberto && isAdmin ? (
            <AuditoriaModal
              idCertificacao={certificacao.id_certificacao}
              auditoria={editando}
              manuais={manuaisResource.data}
              niveis={niveisResource.data}
              onClose={() => setModalAberto(false)}
              onSalvar={salvar}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
