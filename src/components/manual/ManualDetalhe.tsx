"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { ApiError } from "@/lib/api/client";
import { useApiResource } from "@/lib/useApiResource";
import {
  atualizarItem,
  atualizarRequisito,
  criarItem,
  criarRequisito,
  listarDimensoes,
  listarItens,
  listarManuais,
  listarRequisitos,
  removerItem,
  removerRequisito,
  type DimensaoDto,
  type ItemDto,
  type ManualDto,
  type NivelItem,
  type RequisitoDto,
} from "@/lib/api/catalogo";

const NIVEL_COR: Record<string, string> = {
  I: "bg-bg3 text-t3",
  II: "bg-acc3 text-acc2",
  III: "bg-amb3 text-amb2",
  IV: "bg-red/15 text-red2",
};

const NIVEIS: NivelItem[] = ["I", "II", "III", "IV"];

const campo =
  "w-full rounded border border-brd2 bg-bg2 px-2.5 py-[6px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none";

const ACOES =
  "cursor-pointer rounded p-0.5 text-t3 transition-colors hover:bg-bg3 hover:text-t1";
const ACOES_RUIM =
  "cursor-pointer rounded p-0.5 text-t3 transition-colors hover:bg-red/10 hover:text-red";

type ModalEstado =
  | { tipo: "requisito"; registro: RequisitoDto | null }
  | { tipo: "item"; registro: ItemDto | null };

export function ManualDetalhe({ idManual }: { idManual: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const { perfil } = useAuth();
  const podeEditar = perfil?.id === "sa" || perfil?.id === "ag";

  const manuais = useApiResource<ManualDto[]>("det-manuais", listarManuais, []);
  const requisitos = useApiResource<RequisitoDto[]>(
    `det-reqs-${idManual}`,
    () => listarRequisitos({ id_manual: idManual }),
    [],
  );
  const dimensoes = useApiResource<DimensaoDto[]>(
    "det-dims",
    listarDimensoes,
    [],
  );
  const itens = useApiResource<ItemDto[]>("det-itens", listarItens, []);

  const [reqAberto, setReqAberto] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalEstado | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const listaManuais = manuais.data;
  const listaReqs = requisitos.data;
  const listaDims = dimensoes.data;
  const listaItens = itens.data;

  const manual = listaManuais.find((m) => m.id_manual === idManual);
  const carregando =
    manuais.loading || requisitos.loading || dimensoes.loading || itens.loading;
  const offline =
    manuais.offline || requisitos.offline || dimensoes.offline || itens.offline;
  const msgOffline =
    manuais.error ||
    requisitos.error ||
    dimensoes.error ||
    itens.error ||
    "API indisponível.";

  const idsDims = new Set(listaDims.map((d) => d.id_dimensao));
  const grupos: { chave: string; nome: string; reqs: RequisitoDto[] }[] =
    listaDims.map((d) => ({
      chave: `d-${d.id_dimensao}`,
      nome: d.nome_dimensao,
      reqs: listaReqs.filter((r) => r.id_dimensao === d.id_dimensao),
    }));
  const orfaos = listaReqs.filter((r) => !idsDims.has(r.id_dimensao));
  if (orfaos.length > 0) {
    grupos.push({ chave: "sem-dim", nome: "Sem dimensão", reqs: orfaos });
  }

  const totalItens = listaReqs.reduce((acc, r) => acc + r.total_itens, 0);

  function recarregar() {
    requisitos.reload();
    itens.reload();
    manuais.reload();
  }

  function abrir(estado: ModalEstado, valores: Record<string, string>) {
    setErro(null);
    setModal(estado);
    setForm(valores);
  }

  function fecharModal() {
    setModal(null);
    setErro(null);
  }

  function alterar(nome: string, valor: string) {
    setForm((prev) => ({ ...prev, [nome]: valor }));
  }

  function abrirNovoRequisito(idDimensao: number | null) {
    abrir(
      { tipo: "requisito", registro: null },
      {
        cod_requisito: "",
        nome_requisito: "",
        id_dimensao: String(idDimensao ?? listaDims[0]?.id_dimensao ?? ""),
      },
    );
  }

  function abrirEditarRequisito(r: RequisitoDto) {
    abrir(
      { tipo: "requisito", registro: r },
      {
        cod_requisito: r.cod_requisito,
        nome_requisito: r.nome_requisito,
        id_dimensao: String(r.id_dimensao),
      },
    );
  }

  function abrirNovoItem(idRequisito: number) {
    abrir(
      { tipo: "item", registro: null },
      {
        nome_item: "",
        nivel: "I",
        descricao: "",
        id_requisito: String(idRequisito),
      },
    );
  }

  function abrirEditarItem(i: ItemDto) {
    abrir(
      { tipo: "item", registro: i },
      {
        nome_item: i.nome_item,
        nivel: i.nivel,
        descricao: i.descricao ?? "",
        id_requisito: String(i.id_requisito),
      },
    );
  }

  function salvar() {
    if (!modal) return;
    setSalvando(true);
    setErro(null);

    const edicao = modal.registro != null;
    let promessa: Promise<unknown>;

    if (modal.tipo === "requisito") {
      const payload = {
        id_manual: idManual,
        id_dimensao: Number(form.id_dimensao),
        cod_requisito: (form.cod_requisito ?? "").trim(),
        nome_requisito: (form.nome_requisito ?? "").trim(),
      };
      if (!payload.cod_requisito || !payload.nome_requisito) {
        setSalvando(false);
        setErro("Informe código e nome do requisito.");
        return;
      }
      if (!Number.isFinite(payload.id_dimensao)) {
        setSalvando(false);
        setErro("Cadastre uma dimensão antes de criar requisitos.");
        return;
      }
      promessa = modal.registro
        ? atualizarRequisito(modal.registro.id_requisito, payload)
        : criarRequisito(payload);
    } else {
      const payload = {
        id_requisito: Number(form.id_requisito),
        nome_item: (form.nome_item ?? "").trim(),
        nivel: form.nivel as NivelItem,
        descricao: (form.descricao ?? "").trim() || null,
      };
      if (!payload.nome_item) {
        setSalvando(false);
        setErro("Informe o nome do item.");
        return;
      }
      promessa = modal.registro
        ? atualizarItem(modal.registro.id_item, payload)
        : criarItem(payload);
    }

    promessa
      .then(() => {
        toast(edicao ? "Registro atualizado." : "Registro criado.", "ok");
        fecharModal();
        recarregar();
      })
      .catch((err: unknown) => {
        setErro(err instanceof ApiError ? err.message : "Falha ao salvar.");
      })
      .finally(() => setSalvando(false));
  }

  function remover(rotulo: string, acao: () => Promise<void>) {
    if (!window.confirm(`Remover ${rotulo}?`)) return;
    acao()
      .then(() => {
        toast("Registro removido.", "ok");
        recarregar();
      })
      .catch((err: unknown) => {
        toast(
          err instanceof ApiError ? err.message : "Falha ao remover.",
          "err",
        );
      });
  }

  function voltar() {
    router.push("/config");
  }

  const semDimensao = listaDims.length === 0;

  return (
    <div className="animate-fade-in flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={voltar}
          title="Voltar para Configurações"
          className="cursor-pointer rounded border border-brd2 bg-bg2 p-1.5 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-bold text-t1">
            {manual ? manual.nome_manual : "Manual"}
          </div>
          <div className="text-[10px] text-t3">
            {manual ? `v${manual.versao_manual} · ` : ""}
            {listaReqs.length} requisito{listaReqs.length === 1 ? "" : "s"} ·{" "}
            {totalItens} item
            {totalItens === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {offline ? (
        <Alert
          variant="warn"
          title="API indisponível"
          action={
            <button
              type="button"
              onClick={recarregar}
              className="text-[10px] font-semibold text-acc2 hover:underline"
            >
              Recarregar
            </button>
          }
        >
          {msgOffline}
        </Alert>
      ) : null}

      {carregando ? (
        <div className="py-6 text-center text-[11px] text-t3">
          Carregando requisitos…
        </div>
      ) : !manual ? (
        <Alert variant="crit" title="Manual não encontrado">
          Não existe manual com o identificador {idManual}.
          <div className="mt-2">
            <button
              type="button"
              onClick={voltar}
              className="text-[11px] font-semibold text-acc2 hover:underline"
            >
              Voltar para Configurações
            </button>
          </div>
        </Alert>
      ) : (
        <Card>
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <div className="text-[12px] font-semibold text-t1">
                Requisitos
              </div>
              <div className="text-[10px] text-t3">
                Agrupados por dimensão. Clique em um requisito para ver e editar
                os itens dos níveis I–IV.
              </div>
            </div>
            <Button
              variant="pri"
              icon={<Plus className="size-3.5" />}
              disabled={!podeEditar || semDimensao}
              title={
                semDimensao
                  ? "Cadastre uma dimensão primeiro"
                  : "Novo requisito"
              }
              onClick={() => abrirNovoRequisito(null)}
            >
              Novo
            </Button>
          </div>

          {semDimensao ? (
            <Alert variant="warn" title="Nenhuma dimensão cadastrada">
              Cadastre ao menos uma dimensão (aba Manuais → seção Dimensões)
              antes de criar requisitos.
            </Alert>
          ) : null}

          <div className="mt-2 flex flex-col gap-2">
            {grupos.map((g) => (
              <div key={g.chave} className="rounded border border-brd bg-bg2">
                <div className="flex items-center justify-between border-b border-brd bg-bg3/60 px-2 py-1.5">
                  <span className="text-[11px] font-semibold text-t1">
                    {g.nome}
                  </span>
                  <span className="text-[10px] text-t3">
                    {g.reqs.length} requisito{g.reqs.length === 1 ? "" : "s"}
                  </span>
                </div>

                {g.reqs.length === 0 ? (
                  <div className="px-2 py-2 text-[10px] text-t3">
                    Nenhum requisito nesta dimensão.
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 p-1.5">
                    {g.reqs.map((r) => {
                      const aberto = reqAberto === r.id_requisito;
                      const itensDoReq = aberto
                        ? listaItens.filter(
                            (i) => i.id_requisito === r.id_requisito,
                          )
                        : [];
                      return (
                        <div
                          key={r.id_requisito}
                          className="rounded border border-brd bg-bg1"
                        >
                          <div className="flex items-center gap-2 px-2 py-1.5 text-[11px]">
                            <button
                              type="button"
                              onClick={() =>
                                setReqAberto(aberto ? null : r.id_requisito)
                              }
                              className="cursor-pointer rounded p-0.5 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                              title={
                                aberto ? "Recolher itens" : "Expandir itens"
                              }
                            >
                              {aberto ? (
                                <ChevronDown className="size-3.5" />
                              ) : (
                                <ChevronRight className="size-3.5" />
                              )}
                            </button>
                            <span className="w-[62px] shrink-0 font-mono text-[10px] font-bold text-t2">
                              {r.cod_requisito}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium text-t1">
                                {r.nome_requisito}
                              </div>
                            </div>
                            <span className="shrink-0 text-[10px] text-t3">
                              {r.total_itens} itens
                            </span>
                            <button
                              type="button"
                              title="Editar requisito"
                              disabled={!podeEditar}
                              onClick={() => abrirEditarRequisito(r)}
                              className={ACOES}
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Excluir requisito"
                              disabled={!podeEditar}
                              onClick={() =>
                                remover(`o requisito ${r.cod_requisito}`, () =>
                                  removerRequisito(r.id_requisito),
                                )
                              }
                              className={ACOES_RUIM}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>

                          {aberto ? (
                            <div className="border-t border-brd bg-bg2 px-2 py-1.5">
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-[10px] font-semibold text-t3">
                                  ITENS
                                </span>
                                <Button
                                  variant="ghost"
                                  icon={<Plus className="size-3" />}
                                  disabled={!podeEditar}
                                  onClick={() => abrirNovoItem(r.id_requisito)}
                                >
                                  Novo item
                                </Button>
                              </div>
                              {itensDoReq.length === 0 ? (
                                <div className="py-1 text-[10px] text-t3">
                                  Nenhum item cadastrado.
                                </div>
                              ) : (
                                <div className="flex flex-col gap-0.5">
                                  {itensDoReq.map((it) => (
                                    <div
                                      key={it.id_item}
                                      className="flex items-center gap-2 rounded px-1 py-0.5 text-[10px] hover:bg-bg1"
                                    >
                                      <span
                                        className={`w-[26px] shrink-0 rounded px-1 py-0.5 text-center font-bold ${
                                          NIVEL_COR[it.nivel] ??
                                          "bg-bg3 text-t3"
                                        }`}
                                      >
                                        {it.nivel}
                                      </span>
                                      <span className="min-w-0 flex-1">
                                        <span className="font-medium text-t1">
                                          {it.nome_item}
                                        </span>
                                        {it.descricao ? (
                                          <span className="text-t3">
                                            {" "}
                                            — {it.descricao}
                                          </span>
                                        ) : null}
                                      </span>
                                      <button
                                        type="button"
                                        title="Editar item"
                                        disabled={!podeEditar}
                                        onClick={() => abrirEditarItem(it)}
                                        className={ACOES}
                                      >
                                        <Pencil className="size-3" />
                                      </button>
                                      <button
                                        type="button"
                                        title="Excluir item"
                                        disabled={!podeEditar}
                                        onClick={() =>
                                          remover(
                                            `o item ${it.nome_item}`,
                                            () => removerItem(it.id_item),
                                          )
                                        }
                                        className={ACOES_RUIM}
                                      >
                                        <Trash2 className="size-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {modal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="animate-fade-in w-full max-w-[440px] overflow-hidden rounded-lg border border-brd bg-bg1 shadow-xl shadow-black/40">
            <div className="flex items-start justify-between border-b border-brd bg-bg2 px-4 py-3">
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-t1">
                  {modal.tipo === "requisito"
                    ? modal.registro
                      ? "Editar Requisito"
                      : "Novo Requisito"
                    : modal.registro
                      ? "Editar Item"
                      : "Novo Item"}
                  {modal.tipo === "item" ? (
                    <span className="ml-1 font-normal text-t3">
                      do requisito{" "}
                      <span className="font-mono font-bold text-t2">
                        {listaReqs.find((r) => r.id_requisito === Number(form.id_requisito))
                          ?.cod_requisito ?? "—"}
                      </span>
                    </span>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={fecharModal}
                className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                title="Fechar"
              >
                <span aria-hidden>×</span>
              </button>
            </div>

            <div className="space-y-3 p-4">
              {erro ? (
                <Alert variant="crit" title="Não foi possível salvar">
                  {erro}
                </Alert>
              ) : null}

              {modal.tipo === "requisito" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-[10px] font-semibold text-t2">
                      Código
                      <input
                        value={form.cod_requisito ?? ""}
                        onChange={(e) =>
                          alterar("cod_requisito", e.target.value)
                        }
                        placeholder="3.1.1"
                        className={`${campo} mt-1 font-mono`}
                      />
                    </label>
                    <label className="block text-[10px] font-semibold text-t2">
                      Dimensão
                      <select
                        value={form.id_dimensao ?? ""}
                        onChange={(e) => alterar("id_dimensao", e.target.value)}
                        className={`${campo} mt-1`}
                      >
                        {listaDims.map((d) => (
                          <option
                            key={d.id_dimensao}
                            value={String(d.id_dimensao)}
                          >
                            {d.nome_dimensao}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="block text-[10px] font-semibold text-t2">
                    Nome do requisito
                    <input
                      value={form.nome_requisito ?? ""}
                      onChange={(e) =>
                        alterar("nome_requisito", e.target.value)
                      }
                      className={`${campo} mt-1`}
                    />
                  </label>
                  <div className="rounded border border-brd bg-bg2 px-2 py-1.5 text-[10px] text-t3">
                    Manual:{" "}
                    <span className="font-semibold text-t2">
                      {manual
                        ? `${manual.nome_manual} v${manual.versao_manual}`
                        : idManual}
                    </span>
                    <span className="ml-1">(definido pela página)</span>
                  </div>
                </>
              ) : (
                <>
                  <label className="block text-[10px] font-semibold text-t2">
                    Nome do item
                    <input
                      value={form.nome_item ?? ""}
                      onChange={(e) => alterar("nome_item", e.target.value)}
                      className={`${campo} mt-1`}
                    />
                  </label>
                  <label className="block text-[10px] font-semibold text-t2">
                    Nível
                    <select
                      value={form.nivel ?? "I"}
                      onChange={(e) => alterar("nivel", e.target.value)}
                      className={`${campo} mt-1`}
                    >
                      {NIVEIS.map((n) => (
                        <option key={n} value={n}>
                          Nível {n}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-[10px] font-semibold text-t2">
                    Descrição (opcional)
                    <textarea
                      value={form.descricao ?? ""}
                      onChange={(e) => alterar("descricao", e.target.value)}
                      rows={3}
                      className={`${campo} mt-1 resize-none leading-relaxed`}
                    />
                  </label>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-brd bg-bg2 px-4 py-3">
              <button
                type="button"
                onClick={fecharModal}
                className="cursor-pointer rounded-md border border-brd2 bg-bg1 px-4 py-1.5 text-[11px] font-semibold text-t2 transition-colors hover:bg-bg3 hover:text-t1"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={salvar}
                disabled={salvando}
                className="cursor-pointer rounded-md bg-acc px-6 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-acc2 disabled:opacity-40"
              >
                {salvando ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
