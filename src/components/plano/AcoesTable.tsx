"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  CloudUpload,
  Download,
  FileText,
  Pencil,
  Send,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { type AcaoPlano } from "@/lib/domain/plano";
import {
  CRIT_LABEL,
  CRIT_TONE,
  DIL_ST_LABEL,
  DIL_ST_TONE,
  type Criticidade,
  type Diligencia,
} from "@/lib/domain/diligencias";
import { type RequisitoOpcao } from "@/lib/api/catalogo";
import { baixarDocumentoAcao } from "@/lib/api/plano";

type A = AcaoPlano;

const STATUS_COR: Record<string, { bg: string; txt: string }> = {
  PENDENTE: { bg: "bg-bg3", txt: "text-t3" },
  ENVIADO: { bg: "bg-amb3", txt: "text-amb2" },
  APROVADO: { bg: "bg-grn3", txt: "text-grn2" },
  DILIGÊNCIA: { bg: "bg-red3", txt: "text-red2" },
};

function isVencida(a: A) {
  if (!a.prazo) return false;
  if (a.status === "APROVADO") return false;
  return new Date(a.prazo + "T12:00:00") < new Date();
}

function formatDate(s: string | null) {
  if (!s) return "-";
  try {
    return new Date(s + "T12:00:00")
      .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
      .replace(" de ", "/");
  } catch {
    return s;
  }
}

function DetalheAcao({
  acao,
  diligencias,
  podeAuditar,
  podeEnviar,
  onAprovar,
  onEnviarDocumento,
  onEmitirDiligencia,
}: {
  acao: A;
  diligencias: Diligencia[];
  podeAuditar: boolean;
  podeEnviar: boolean;
  onAprovar?: (acao: A) => Promise<void>;
  onEnviarDocumento?: (acao: A, arquivo: File) => Promise<void>;
  onEmitirDiligencia?: (
    acao: A,
    payload: {
      situacao_detectada: string;
      criticidade: Criticidade;
      prazo_resposta: string;
    },
  ) => Promise<void>;
}) {
  const { toast } = useToast();
  const [formAberto, setFormAberto] = useState(false);
  const [situacao, setSituacao] = useState("");
  const [criticidade, setCriticidade] = useState<Criticidade>("media");
  const [prazo, setPrazo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const podeAprovar = acao.status === "ENVIADO" && Boolean(onAprovar);
  const podeEmitirDiligencia =
    acao.status === "ENVIADO" && Boolean(onEmitirDiligencia);

  async function aprovar() {
    if (!onAprovar) return;
    setSalvando(true);
    try {
      await onAprovar(acao);
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Não foi possível aprovar a ação",
        "err",
      );
    } finally {
      setSalvando(false);
    }
  }

  async function emitirDiligencia() {
    if (!onEmitirDiligencia || !situacao.trim() || !prazo) return;
    setSalvando(true);
    try {
      await onEmitirDiligencia(acao, {
        situacao_detectada: situacao.trim(),
        criticidade,
        prazo_resposta: prazo,
      });
      setSituacao("");
      setPrazo("");
      setCriticidade("media");
      setFormAberto(false);
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Não foi possível emitir a diligência",
        "err",
      );
    } finally {
      setSalvando(false);
    }
  }

  async function enviarDocumento() {
    if (!onEnviarDocumento || !arquivo) return;
    if (arquivo.size > 20 * 1024 * 1024) {
      toast("O arquivo deve ter no máximo 20 MB", "warn");
      return;
    }
    setSalvando(true);
    try {
      await onEnviarDocumento(acao, arquivo);
      setArquivo(null);
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Não foi possível enviar a comprovação",
        "err",
      );
    } finally {
      setSalvando(false);
    }
  }

  async function baixarDocumento(id: string, nome: string) {
    try {
      const blob = await baixarDocumentoAcao(acao.idAcao, id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = nome;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Não foi possível baixar o documento",
        "err",
      );
    }
  }

  return (
    <div className="grid gap-4 border-t border-brd bg-bg2 px-4 py-3 sm:grid-cols-2">
      <section>
        {podeEnviar ? (
          <div className="mb-3 rounded-md border border-brd bg-bg1 p-2.5">
            <h3 className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-t3">
              <CloudUpload className="size-3 text-acc2" />
              Envio de comprovação
            </h3>
            {acao.status === "PENDENTE" || acao.status === "DILIGÊNCIA" ? (
              <div className="flex flex-col gap-2">
                {acao.status === "DILIGÊNCIA" ? (
                  <p className="rounded bg-red3 px-2 py-1.5 text-[9px] text-red2">
                    Envie a correção solicitada para submeter novamente à análise.
                  </p>
                ) : null}
                <label className="flex cursor-pointer flex-col items-center gap-1 rounded border border-dashed border-brd2 bg-bg2 px-3 py-3 text-center transition-colors hover:bg-bg3">
                  <CloudUpload className="size-4 text-acc2" />
                  <span className="text-[10px] font-semibold text-t1">
                    {arquivo?.name ?? "Selecionar arquivo de comprovação"}
                  </span>
                  <span className="text-[9px] text-t3">PDF, DOCX ou XLSX · máximo 20 MB</span>
                  <input
                    key={arquivo?.name ?? "arquivo-vazio"}
                    type="file"
                    accept=".pdf,.docx,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="sr-only"
                    onChange={(event) => setArquivo(event.target.files?.[0] ?? null)}
                  />
                </label>
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={!arquivo || salvando}
                    onClick={enviarDocumento}
                    className="inline-flex cursor-pointer items-center gap-1 rounded bg-acc px-2.5 py-1 text-[10px] font-bold text-white transition-colors hover:bg-acc2 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send className="size-3" />
                    {salvando ? "Enviando..." : "Enviar comprovação"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[9px] text-t3">
                A comprovação foi enviada e está aguardando revisão do Admin.
              </p>
            )}
          </div>
        ) : null}

        {podeAuditar ? (
          <div className="mb-3 rounded-md border border-brd bg-bg1 p-2.5">
            <h3 className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-t3">
              <TriangleAlert className="size-3 text-acc2" />
              Ações do Auditor
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                disabled={!podeAprovar || salvando}
                onClick={aprovar}
                className="inline-flex cursor-pointer items-center gap-1 rounded border border-grn/30 bg-grn3 px-2.5 py-1 text-[10px] font-bold text-grn2 transition-colors hover:bg-grn3 disabled:cursor-not-allowed disabled:opacity-40"
                title={
                  podeAprovar
                    ? "Aprovar ação enviada"
                    : "A ação precisa estar enviada para ser aprovada"
                }
              >
                <Check className="size-3" />
                Aprovar
              </button>
              <button
                type="button"
                disabled={!podeEmitirDiligencia || salvando}
                onClick={() => setFormAberto((aberto) => !aberto)}
                className="inline-flex cursor-pointer items-center gap-1 rounded border border-red/30 bg-red3 px-2.5 py-1 text-[10px] font-bold text-red2 transition-colors hover:bg-red3 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {formAberto ? (
                  <X className="size-3" />
                ) : (
                  <TriangleAlert className="size-3" />
                )}
                {formAberto ? "Cancelar" : "Emitir Diligência"}
              </button>
            </div>
            {acao.status === "PENDENTE" ? (
              <p className="mt-2 text-[9px] text-t3">
                Aguardando envio da comprovação pelo Operacional para liberar a revisão.
              </p>
            ) : null}
            {acao.status === "APROVADO" ? (
              <p className="mt-2 text-[9px] font-semibold text-grn2">
                Ação aprovada — conta para a completude do requisito.
              </p>
            ) : null}
            {formAberto ? (
              <div className="mt-2 flex flex-col gap-2 border-t border-brd pt-2">
                <label className="text-[9px] font-semibold text-t2">
                  Situação identificada
                  <textarea
                    value={situacao}
                    onChange={(event) => setSituacao(event.target.value)}
                    rows={3}
                    className="mt-1 w-full resize-y rounded border border-brd2 bg-bg2 px-2 py-1.5 text-[10px] font-normal text-t1 focus:outline-none"
                    placeholder="Descreva a pendência encontrada..."
                    required
                  />
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="text-[9px] font-semibold text-t2">
                    Criticidade
                    <select
                      value={criticidade}
                      onChange={(event) =>
                        setCriticidade(event.target.value as Criticidade)
                      }
                      className="mt-1 w-full rounded border border-brd2 bg-bg2 px-2 py-1.5 text-[10px] text-t1 focus:outline-none"
                    >
                      {(Object.keys(CRIT_LABEL) as Criticidade[]).map(
                        (opcao) => (
                          <option key={opcao} value={opcao}>
                            {CRIT_LABEL[opcao]}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                  <label className="text-[9px] font-semibold text-t2">
                    Prazo de resposta
                    <input
                      type="date"
                      value={prazo}
                      onChange={(event) => setPrazo(event.target.value)}
                      className="mt-1 w-full rounded border border-brd2 bg-bg2 px-2 py-1.5 text-[10px] text-t1 focus:outline-none"
                      required
                    />
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={salvando || !situacao.trim() || !prazo}
                    onClick={emitirDiligencia}
                    className="inline-flex cursor-pointer items-center gap-1 rounded bg-red px-2.5 py-1 text-[10px] font-bold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send className="size-3" />
                    {salvando ? "Enviando..." : "Confirmar diligência"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        <h3 className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-t3">
          Histórico e diligências
        </h3>
        {acao.hist.length ? (
          <ol className="mb-3 flex flex-col gap-1.5">
            {acao.hist.map((evento, index) => (
              <li
                key={`${evento.dt}-${evento.ev}-${index}`}
                className="flex gap-2 text-[10px]"
              >
                <time className="shrink-0 font-mono text-t3">{evento.dt}</time>
                <span className="text-t1">{evento.ev}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mb-3 text-[10px] text-t3">Nenhum evento registrado.</p>
        )}

        {diligencias.length ? (
          <div className="flex flex-col gap-1.5">
            {diligencias.map((diligencia) => (
              <div
                key={diligencia.num}
                className="rounded border border-brd bg-bg1 px-2.5 py-2"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[9px] font-bold text-red2">
                    D-{diligencia.num}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${DIL_ST_TONE[diligencia.status]}`}
                  >
                    {DIL_ST_LABEL[diligencia.status]}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${CRIT_TONE[diligencia.criticidade]}`}
                  >
                    {CRIT_LABEL[diligencia.criticidade]}
                  </span>
                  <span className="ml-auto text-[9px] text-t3">
                    Prazo: {formatDate(diligencia.prazo)}
                  </span>
                </div>
                <p className="mt-1 text-[10px] leading-relaxed text-t1">
                  {diligencia.situacao}
                </p>
                {diligencia.retorno ? (
                  <p className="mt-1 border-t border-brd pt-1 text-[9px] text-t2">
                    Retorno: {diligencia.retorno}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {acao.documentos.length ? (
          <div className="mt-3 border-t border-brd pt-2.5">
            <h4 className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-t3">
              Comprovações enviadas
            </h4>
            <div className="flex flex-col gap-1">
              {acao.documentos.map((documento) => (
                <div
                  key={documento.id}
                  className="flex items-center gap-2 rounded border border-brd bg-bg1 px-2 py-1.5"
                >
                  <FileText className="size-3 shrink-0 text-acc2" />
                  <span className="min-w-0 flex-1 break-words text-[9px] text-t1">
                    v{documento.versao ?? "—"} · {documento.nomeArquivo}
                  </span>
                  {documento.enviadoEm ? (
                    <time className="shrink-0 text-[8px] text-t3">
                      {new Date(documento.enviadoEm).toLocaleDateString("pt-BR")}
                    </time>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => baixarDocumento(documento.id, documento.nomeArquivo)}
                    title={`Baixar ${documento.nomeArquivo}`}
                    aria-label={`Baixar ${documento.nomeArquivo}`}
                    className="shrink-0 cursor-pointer rounded p-1 text-t3 hover:bg-bg3 hover:text-t1"
                  >
                    <Download className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function LinhaAcao({
  acao,
  unidade,
  diligencias,
  podeEditar,
  podeAuditar,
  podeEnviar,
  onEditar,
  onRemover,
  onAprovar,
  onEnviarDocumento,
  onEmitirDiligencia,
}: {
  acao: A;
  unidade: string;
  diligencias: Diligencia[];
  podeEditar: boolean;
  podeAuditar: boolean;
  podeEnviar: boolean;
  onEditar?: (acao: A) => void;
  onRemover?: (acao: A) => void;
  onAprovar?: (acao: A) => Promise<void>;
  onEnviarDocumento?: (acao: A, arquivo: File) => Promise<void>;
  onEmitirDiligencia?: (
    acao: A,
    payload: {
      situacao_detectada: string;
      criticidade: Criticidade;
      prazo_resposta: string;
    },
  ) => Promise<void>;
}) {
  const [expandida, setExpandida] = useState(false);
  const status = STATUS_COR[acao.status] || STATUS_COR.PENDENTE;
  const vencida = isVencida(acao);

  return (
    <div className="border-t border-brd">
      <div
        onClick={() => setExpandida((aberta) => !aberta)}
        className="grid cursor-pointer grid-cols-[70px_120px_1fr_80px_100px_80px_80px_60px] items-center gap-0 px-3 py-2 transition-colors hover:bg-bg2"
      >
        <div className="font-mono text-[9px] font-bold text-acc2">
          #{acao.idAcao}
        </div>
        <div className="min-w-0 break-words whitespace-normal text-[10px] font-semibold text-t2">
          {acao.item || "—"}
        </div>
        <div className="min-w-0 break-words whitespace-normal pr-2 text-[10px] text-t1">
          {acao.nome || acao.acao || "—"}
          {diligencias.length ? (
            <span className="ml-1 rounded bg-red3 px-1 text-[8px] font-bold text-red2">
              D
            </span>
          ) : null}
        </div>
        <div className="min-w-0 break-words whitespace-normal text-[9px] font-semibold text-t2">
          {unidade || "—"}
        </div>
        <div>
          <span
            className={`rounded px-2 py-0.5 text-[9px] font-bold ${status.bg} ${status.txt}`}
          >
            {acao.status}
          </span>
        </div>
        <div
          className={`text-[10px] font-semibold ${vencida ? "text-red2" : "text-t2"}`}
        >
          {formatDate(acao.prazo)}
          {vencida ? " ⚠" : ""}
        </div>
        <div
          className={`text-[10px] ${acao.dtEnvio ? "text-grn2" : "text-t4"}`}
        >
          {formatDate(acao.dtEnvio)}
        </div>
        <div className="flex items-center justify-end gap-1">
          {podeEditar && onEditar ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEditar(acao);
              }}
              title="Editar"
              className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
            >
              <Pencil className="size-3" />
            </button>
          ) : null}
          {podeEditar && onRemover ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRemover(acao);
              }}
              title="Excluir"
              className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-red3 hover:text-red2"
            >
              <Trash2 className="size-3" />
            </button>
          ) : null}
          <button
            type="button"
            aria-expanded={expandida}
            aria-label={`${expandida ? "Recolher" : "Expandir"} ação ${acao.idAcao}`}
            onClick={(event) => {
              event.stopPropagation();
              setExpandida((aberta) => !aberta);
            }}
            className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
            title={expandida ? "Recolher ação" : "Expandir ação"}
          >
            <ChevronDown
              className={`size-3 transition-transform ${expandida ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
      {expandida ? (
        <DetalheAcao
          acao={acao}
          diligencias={diligencias}
          podeAuditar={podeAuditar}
          podeEnviar={podeEnviar}
          onAprovar={onAprovar}
          onEnviarDocumento={onEnviarDocumento}
          onEmitirDiligencia={onEmitirDiligencia}
        />
      ) : null}
    </div>
  );
}

export function AcoesTable({
  acoes,
  unidades = [],
  diligencias = [],
  requisitos = [],
  podeEditar = false,
  podeAuditar = false,
  podeEnviar = false,
  onEditar,
  onRemover,
  onAprovar,
  onEnviarDocumento,
  onEmitirDiligencia,
}: {
  acoes: A[];
  unidades?: { id: string; sigla: string }[];
  diligencias?: Diligencia[];
  requisitos?: RequisitoOpcao[];
  podeEditar?: boolean;
  podeAuditar?: boolean;
  podeEnviar?: boolean;
  onEditar?: (acao: A) => void;
  onRemover?: (acao: A) => void;
  onAprovar?: (acao: A) => Promise<void>;
  onEnviarDocumento?: (acao: A, arquivo: File) => Promise<void>;
  onEmitirDiligencia?: (
    acao: A,
    payload: {
      situacao_detectada: string;
      criticidade: Criticidade;
      prazo_resposta: string;
    },
  ) => Promise<void>;
}) {
  // O Operador já recebe apenas as ações das suas unidades (filtro no backend).
  const data = acoes;
  const nomeReq = (id: number) =>
    requisitos.find((r) => r.id_requisito === id)?.nome_requisito ?? "";
  const siglaUnidade = (id: string) =>
    unidades.find((u) => u.id === id)?.sigla ?? "";
  const [requisitoAberto, setRequisitoAberto] = useState<number | null>(null);
  const grupos = Array.from(
    data
      .reduce((map, acao) => {
        const grupo = map.get(acao.idRequisito) ?? {
          id: acao.idRequisito,
          codigo: acao.req,
          nome: acao.reqNome || nomeReq(acao.idRequisito),
          acoes: [],
        };
        grupo.acoes.push(acao);
        map.set(acao.idRequisito, grupo);
        return map;
      }, new Map<number, { id: number; codigo: string; nome: string; acoes: A[] }>())
      .values(),
  );

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-brd bg-bg1 px-4 py-8 text-center text-[11px] text-t3">
        Nenhuma ação no plano.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {grupos.map((grupo) => {
        const aberto = requisitoAberto === grupo.id;
        const aprovadas = grupo.acoes.filter(
          (acao) => acao.status === "APROVADO",
        ).length;
        const progresso = Math.round((aprovadas / grupo.acoes.length) * 100);
        return (
          <section
            key={grupo.id}
            className="overflow-hidden rounded-lg border border-brd bg-bg1"
          >
            <button
              type="button"
              aria-expanded={aberto}
              onClick={() => setRequisitoAberto(aberto ? null : grupo.id)}
              className="flex w-full cursor-pointer flex-wrap items-center gap-2.5 bg-bg2 px-3 py-2.5 text-left transition-colors hover:bg-bg3"
            >
              {aberto ? (
                <ChevronDown className="size-3.5 shrink-0 text-t3" />
              ) : (
                <ChevronRight className="size-3.5 shrink-0 text-t3" />
              )}
              <span className="shrink-0 rounded bg-acc3 px-1.5 py-0.5 font-mono text-[9px] font-bold text-acc2">
                {grupo.codigo || "—"}
              </span>
              <span className="min-w-0 flex-1 break-words whitespace-normal text-[11px] font-semibold text-t1">
                {grupo.nome || "Requisito sem nome"}
              </span>
              <span className="text-[9px] text-t3">
                {grupo.acoes.length} ação{grupo.acoes.length === 1 ? "" : "ões"}
              </span>
              <span className="text-[10px] font-bold text-acc2">
                {progresso}%
              </span>
              <span className="text-[9px] text-t3">
                {aprovadas}/{grupo.acoes.length} aprovadas
              </span>
            </button>

            {aberto ? (
              <div className="overflow-x-auto border-t border-brd">
                <div className="min-w-[820px]">
                  <div className="grid grid-cols-[70px_120px_1fr_80px_100px_80px_80px_60px] gap-0 bg-bg3 px-3 py-1.5 text-[8px] font-bold uppercase tracking-wide text-t3">
                    <div>ID AÇÃO</div>
                    <div>ITEM</div>
                    <div>AÇÃO</div>
                    <div>UNIDADE</div>
                    <div>STATUS</div>
                    <div>PRAZO</div>
                    <div>ENVIO</div>
                    <div />
                  </div>
                  {grupo.acoes.map((acao) => (
                    <LinhaAcao
                      key={acao.idAcao}
                      acao={acao}
                      unidade={acao.setor || siglaUnidade(acao.unidadeId)}
                      diligencias={diligencias.filter(
                        (d) => d.acaoCod === acao.idAcao,
                      )}
                      podeEditar={podeEditar}
                      podeAuditar={podeAuditar}
                      podeEnviar={podeEnviar}
                      onEditar={onEditar}
                      onRemover={onRemover}
                      onAprovar={onAprovar}
                      onEnviarDocumento={onEnviarDocumento}
                      onEmitirDiligencia={onEmitirDiligencia}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
