"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { AuditoriaModal } from "@/components/certificacoes/AuditoriaModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { listarManuais, listarNiveis } from "@/lib/api/catalogo";
import {
  atualizarAuditoria,
  criarAuditoria,
  listarAuditorias,
  listarCertificacoes,
  removerAuditoria,
  type AuditoriaDto,
  type AuditoriaPayload,
} from "@/lib/api/certificacoes";
import { conclusaoTone, rotulo, TIPO_COR } from "@/lib/domain/auditorias";
import { setPrimaryAction } from "@/lib/primaryAction";
import { useApiResource } from "@/lib/useApiResource";

function formatarData(data: string | null) {
  if (!data) return "—";
  const parsed = new Date(`${data}T12:00:00`);
  return Number.isNaN(parsed.getTime())
    ? data
    : parsed.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function CertificacaoPage() {
  const { perfil } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<AuditoriaDto | null>(null);
  const [auditoriaRecemCriada, setAuditoriaRecemCriada] = useState<
    string | null
  >(null);
  const auditoriasResource = useApiResource<AuditoriaDto[]>(
    "auditorias-historico",
    () => listarAuditorias(),
    [],
  );
  const certificacoesResource = useApiResource(
    "certificacoes-para-auditoria",
    listarCertificacoes,
    [],
  );
  const manuaisResource = useApiResource(
    "manuais-auditoria",
    listarManuais,
    [],
  );
  const niveisResource = useApiResource("niveis-auditoria", listarNiveis, []);
  const isAdmin = perfil?.id === "ag" || perfil?.id === "sa";
  const auditorias = auditoriasResource.data;

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
      auditoriasResource.setData((atuais) =>
        atuais.map((item) => (item.id === salva.id ? salva : item)),
      );
      toast("Auditoria atualizada", "ok");
    } else {
      const criada = await criarAuditoria(payload);
      setAuditoriaRecemCriada(criada.id);
      auditoriasResource.setData((atuais) =>
        [criada, ...atuais.filter((item) => item.id !== criada.id)].sort(
          (a, b) =>
            (Date.parse(b.criado_em ?? "") || Date.parse(b.data_auditoria)) -
            (Date.parse(a.criado_em ?? "") || Date.parse(a.data_auditoria)),
        ),
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
      auditoriasResource.reload();
      toast("Auditoria removida", "ok");
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Não foi possível remover a auditoria",
        "err",
      );
    }
  }

  const ordenadas = [...auditorias].sort((a, b) =>
    a.id === auditoriaRecemCriada
      ? -1
      : b.id === auditoriaRecemCriada
        ? 1
        : (Date.parse(b.criado_em ?? "") || Date.parse(b.data_auditoria)) -
          (Date.parse(a.criado_em ?? "") || Date.parse(a.data_auditoria)),
  );
  const aprovadas = auditorias.filter(
    (auditoria) => auditoria.conclusao === "aprovado",
  ).length;
  const pendentes = auditorias.filter(
    (auditoria) => auditoria.conclusao === "pendente",
  ).length;

  return (
    <div className="animate-fade-in">
      {auditoriasResource.offline ? (
        <Alert variant="warn" title="API indisponível" className="mb-2">
          {auditoriasResource.error ??
            "Não foi possível carregar as auditorias."}
        </Alert>
      ) : null}
      {isAdmin && certificacoesResource.offline ? (
        <Alert
          variant="warn"
          title="Certificações indisponíveis"
          className="mb-2"
        >
          Não foi possível carregar as certificações para cadastrar auditorias.
        </Alert>
      ) : null}
      {isAdmin && manuaisResource.offline ? (
        <Alert variant="warn" title="Manuais indisponíveis" className="mb-2">
          Não foi possível carregar os manuais para cadastrar auditorias.
        </Alert>
      ) : null}

      <Alert variant="info" title="Auditorias">
        Consulte as auditorias registradas e abra uma auditoria para acompanhar
        o plano de ação.
      </Alert>

      <div className="mb-2.5 mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <div className="rounded-md border border-brd bg-bg1 p-3">
          <div className="text-[10px] text-t3">Total registradas</div>
          <div className="mt-1 text-xl font-extrabold leading-none text-prp2">
            {auditorias.length}
          </div>
        </div>
        <div className="rounded-md border border-brd bg-bg1 p-3">
          <div className="text-[10px] text-t3">Aprovadas</div>
          <div className="mt-1 text-xl font-extrabold leading-none text-grn2">
            {aprovadas}
          </div>
        </div>
        <div className="rounded-md border border-brd bg-bg1 p-3">
          <div className="text-[10px] text-t3">Pendentes</div>
          <div className="mt-1 text-xl font-extrabold leading-none text-amb2">
            {pendentes}
          </div>
        </div>
        <div className="rounded-md border border-brd bg-bg1 p-3">
          <div className="text-[10px] text-t3">Última auditoria</div>
          <div className="mt-1 text-sm font-extrabold leading-none text-acc2">
            {ordenadas[0] ? formatarData(ordenadas[0].data_auditoria) : "—"}
          </div>
          <div className="mt-1 text-[9px] text-t3">
            {ordenadas[0] ? rotulo(ordenadas[0].tipo) : "—"}
          </div>
        </div>
      </div>

      {auditoriasResource.loading ? (
        <div className="py-10 text-center text-[11px] text-t3">
          Carregando auditorias…
        </div>
      ) : ordenadas.length ? (
        <div className="flex flex-col gap-2">
          {ordenadas.map((auditoria) => (
            <article
              key={auditoria.id}
              className="rounded-md border border-brd bg-bg1 px-3.5 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <ShieldCheck
                  className="size-4 shrink-0"
                  style={{ color: TIPO_COR[auditoria.tipo] }}
                />
                <span className="text-[12px] font-semibold text-t1">
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
                <span>{auditoria.nome_certificacao}</span>
                <span>
                  · {auditoria.nome_manual} · v{auditoria.versao_manual}
                </span>
                <span>· {rotulo(auditoria.modalidade)}</span>
                <span>
                  · {auditoria.auditor_nome || "Auditor não informado"}
                </span>
                <span>
                  · {auditoria.acoes_count}{" "}
                  {auditoria.acoes_count === 1 ? "ação" : "ações"}
                </span>
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
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-brd bg-bg1 px-4 py-10 text-center text-[11px] text-t3">
          Nenhuma auditoria registrada.
        </div>
      )}

      {modalAberto && isAdmin ? (
        <AuditoriaModal
          idCertificacao={editando?.id_certificacao}
          certificacoes={editando ? undefined : certificacoesResource.data}
          auditoria={editando}
          manuais={manuaisResource.data}
          niveis={niveisResource.data}
          onClose={() => setModalAberto(false)}
          onSalvar={salvar}
        />
      ) : null}
    </div>
  );
}
