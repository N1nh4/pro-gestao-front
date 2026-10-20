"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/context/ToastContext";
import { ApiError } from "@/lib/api/client";
import { useApiResource } from "@/lib/useApiResource";
import {
  atualizarDimensao,
  atualizarItem,
  atualizarManual,
  atualizarRequisito,
  criarDimensao,
  criarItem,
  criarManual,
  criarRequisito,
  listarDimensoes,
  listarItens,
  listarManuais,
  listarRequisitos,
  removerDimensao,
  removerItem,
  removerManual,
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

type ModalEstado =
  | { tipo: "manual"; registro: ManualDto | null }
  | { tipo: "dimensao"; registro: DimensaoDto | null }
  | { tipo: "requisito"; registro: RequisitoDto | null }
  | { tipo: "item"; registro: ItemDto | null };

export function CatalogoPanel({ podeEditar }: { podeEditar: boolean }) {
  const { toast } = useToast();
  const manuais = useApiResource<ManualDto[]>("cat-manuais", listarManuais, []);
  const dimensoes = useApiResource<DimensaoDto[]>("cat-dims", listarDimensoes, []);
  const requisitos = useApiResource<RequisitoDto[]>("cat-reqs", listarRequisitos, []);
  const itens = useApiResource<ItemDto[]>("cat-itens", listarItens, []);

  const [manualSel, setManualSel] = useState<number | null>(null);
  const [reqAberto, setReqAberto] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalEstado | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const listaManuais = manuais.data;
  const listaDims = dimensoes.data;
  const listaReqs = requisitos.data;
  const listaItens = itens.data;

  const idManualAtivo = manualSel ?? listaManuais[0]?.id_manual ?? null;
  const reqsVisiveis = listaReqs.filter((r) => r.id_manual === idManualAtivo);
  const itensVisiveis = reqAberto
    ? listaItens.filter((i) => i.id_requisito === reqAberto)
    : [];

  function recarregarTudo() {
    manuais.reload();
    dimensoes.reload();
    requisitos.reload();
    itens.reload();
  }

  function abrirModal(estado: ModalEstado, valores: Record<string, string>) {
    setErro(null);
    setModal(estado);
    setForm(valores);
  }

  function abrirNovoManual() {
    abrirModal({ tipo: "manual", registro: null }, { nome_manual: "", versao_manual: "" });
  }

  function abrirEditarManual(m: ManualDto) {
    abrirModal(
      { tipo: "manual", registro: m },
      { nome_manual: m.nome_manual, versao_manual: m.versao_manual },
    );
  }

  function abrirNovaDimensao() {
    abrirModal({ tipo: "dimensao", registro: null }, { nome_dimensao: "" });
  }

  function abrirEditarDimensao(d: DimensaoDto) {
    abrirModal({ tipo: "dimensao", registro: d }, { nome_dimensao: d.nome_dimensao });
  }

  function abrirNovoRequisito() {
    if (idManualAtivo == null || listaDims.length === 0) return;
    abrirModal(
      { tipo: "requisito", registro: null },
      {
        cod_requisito: "",
        nome_requisito: "",
        id_manual: String(idManualAtivo),
        id_dimensao: String(listaDims[0].id_dimensao),
      },
    );
  }

  function abrirEditarRequisito(r: RequisitoDto) {
    abrirModal(
      { tipo: "requisito", registro: r },
      {
        cod_requisito: r.cod_requisito,
        nome_requisito: r.nome_requisito,
        id_manual: String(r.id_manual),
        id_dimensao: String(r.id_dimensao),
      },
    );
  }

  function abrirNovoItem() {
    if (reqAberto == null) return;
    abrirModal(
      { tipo: "item", registro: null },
      { nome_item: "", nivel: "I", descricao: "", id_requisito: String(reqAberto) },
    );
  }

  function abrirEditarItem(i: ItemDto) {
    abrirModal(
      { tipo: "item", registro: i },
      {
        nome_item: i.nome_item,
        nivel: i.nivel,
        descricao: i.descricao ?? "",
        id_requisito: String(i.id_requisito),
      },
    );
  }

  function fecharModal() {
    setModal(null);
    setErro(null);
  }

  function alterar(nome: string, valor: string) {
    setForm((prev) => ({ ...prev, [nome]: valor }));
  }

  function salvar() {
    if (!modal) return;
    setSalvando(true);
    setErro(null);

    const edicao = modal.registro != null;
    let promessa: Promise<unknown>;

    if (modal.tipo === "manual") {
      const payload = {
        nome_manual: form.nome_manual.trim(),
        versao_manual: form.versao_manual.trim(),
      };
      promessa = modal.registro
        ? atualizarManual(modal.registro.id_manual, payload)
        : criarManual(payload);
    } else if (modal.tipo === "dimensao") {
      const payload = { nome_dimensao: form.nome_dimensao.trim() };
      promessa = modal.registro
        ? atualizarDimensao(modal.registro.id_dimensao, payload)
        : criarDimensao(payload);
    } else if (modal.tipo === "requisito") {
      const payload = {
        id_manual: Number(form.id_manual),
        id_dimensao: Number(form.id_dimensao),
        cod_requisito: form.cod_requisito.trim(),
        nome_requisito: form.nome_requisito.trim(),
      };
      promessa = modal.registro
        ? atualizarRequisito(modal.registro.id_requisito, payload)
        : criarRequisito(payload);
    } else {
      const payload = {
        id_requisito: Number(form.id_requisito),
        nome_item: form.nome_item.trim(),
        nivel: form.nivel as NivelItem,
        descricao: form.descricao.trim() || null,
      };
      promessa = modal.registro
        ? atualizarItem(modal.registro.id_item, payload)
        : criarItem(payload);
    }

    promessa
      .then(() => {
        toast(edicao ? "Registro atualizado." : "Registro criado.", "ok");
        fecharModal();
        recarregarTudo();
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
        recarregarTudo();
      })
      .catch((err: unknown) => {
        toast(err instanceof ApiError ? err.message : "Falha ao remover.", "err");
      });
  }

  const offline = manuais.offline || dimensoes.offline || requisitos.offline || itens.offline;
  const msgOffline =
    manuais.error || dimensoes.error || requisitos.error || itens.error || "API indisponível.";
  const carregando = manuais.loading || dimensoes.loading || requisitos.loading || itens.loading;

  return (
    <Card>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[12px] font-semibold text-t1">Catálogo do Manual</div>
          <div className="text-[10px] text-t3">
            Manual → dimensões → requisitos → itens por nível (I–IV).
          </div>
        </div>
        <Button
          variant="pri"
          icon={<Plus className="size-3.5" />}
          disabled={!podeEditar}
          onClick={abrirNovoManual}
        >
          Novo manual
        </Button>
      </div>

      {offline ? (
        <div className="mb-2">
          <Alert
            variant="warn"
            title="API indisponível"
            action={
              <button
                type="button"
                onClick={recarregarTudo}
                className="text-[10px] font-semibold text-acc2 hover:underline"
              >
                Recarregar
              </button>
            }
          >
            {msgOffline}
          </Alert>
        </div>
      ) : null}

      {listaManuais.length > 0 ? (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {listaManuais.map((m) => (
            <div key={m.id_manual} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setManualSel(m.id_manual);
                  setReqAberto(null);
                }}
                className={`cursor-pointer rounded-md border px-2.5 py-[5px] text-[11px] font-medium transition-colors ${
                  m.id_manual === idManualAtivo
                    ? "border-acc bg-acc text-white"
                    : "border-brd2 bg-bg2 text-t2 hover:bg-bg3 hover:text-t1"
                }`}
              >
                {m.nome_manual}
                <span className="ml-1.5 opacity-70">v{m.versao_manual}</span>
              </button>
              {podeEditar ? (
                <>
                  <button
                    type="button"
                    title="Editar manual"
                    onClick={() => abrirEditarManual(m)}
                    className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                  >
                    <Pencil className="size-3" />
                  </button>
                  <button
                    type="button"
                    title="Excluir manual"
                    onClick={() =>
                      remover(`o manual ${m.nome_manual} v${m.versao_manual}`, () =>
                        removerManual(m.id_manual),
                      )
                    }
                    className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-red/10 hover:text-red"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="mb-2 flex items-center justify-between border-t border-brd pt-2">
        <div className="text-[11px] font-semibold text-t1">Dimensões</div>
        <Button
          variant="ghost"
          icon={<Plus className="size-3.5" />}
          disabled={!podeEditar}
          onClick={abrirNovaDimensao}
        >
          Nova
        </Button>
      </div>
      {listaDims.length === 0 ? (
        <div className="mb-2 text-[11px] text-t3">Nenhuma dimensão cadastrada.</div>
      ) : (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {listaDims.map((d) => (
            <div key={d.id_dimensao} className="flex items-center gap-1">
              <span className="rounded-md border border-brd2 bg-bg2 px-2.5 py-[5px] text-[11px] text-t1">
                {d.nome_dimensao}
              </span>
              {podeEditar ? (
                <>
                  <button
                    type="button"
                    title="Editar dimensão"
                    onClick={() => abrirEditarDimensao(d)}
                    className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                  >
                    <Pencil className="size-3" />
                  </button>
                  <button
                    type="button"
                    title="Excluir dimensão"
                    onClick={() =>
                      remover(`a dimensão ${d.nome_dimensao}`, () => removerDimensao(d.id_dimensao))
                    }
                    className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-red/10 hover:text-red"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <div className="mb-2 flex items-center justify-between border-t border-brd pt-2">
        <div>
          <div className="text-[11px] font-semibold text-t1">Requisitos</div>
          <div className="text-[10px] text-t3">
            {reqsVisiveis.length} no manual ativo. Clique para ver os itens.
          </div>
        </div>
        <Button
          variant="ghost"
          icon={<Plus className="size-3.5" />}
          disabled={!podeEditar || idManualAtivo == null}
          onClick={abrirNovoRequisito}
        >
          Novo
        </Button>
      </div>

      {carregando ? (
        <div className="py-3 text-center text-[11px] text-t3">Carregando catálogo…</div>
      ) : reqsVisiveis.length === 0 ? (
        <div className="py-3 text-center text-[11px] text-t3">
          Nenhum requisito neste manual.
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {reqsVisiveis.map((r) => {
            const aberto = reqAberto === r.id_requisito;
            return (
              <div key={r.id_requisito} className="rounded border border-brd bg-bg2">
                <div className="flex items-center gap-2 px-2 py-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setReqAberto(aberto ? null : r.id_requisito)}
                    className="cursor-pointer rounded p-0.5 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                    title={aberto ? "Recolher itens" : "Expandir itens"}
                  >
                    {aberto ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                  </button>
                  <span className="w-[62px] shrink-0 font-mono text-[10px] font-bold text-t2">
                    {r.cod_requisito}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-t1">{r.nome_requisito}</div>
                  </div>
                  <span className="shrink-0 rounded bg-bg3 px-1.5 py-0.5 text-[10px] text-t3">
                    {r.nome_dimensao}
                  </span>
                  <span className="shrink-0 text-[10px] text-t3">{r.total_itens} itens</span>
                  {podeEditar ? (
                    <>
                      <button
                        type="button"
                        title="Editar requisito"
                        onClick={() => abrirEditarRequisito(r)}
                        className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Excluir requisito"
                        onClick={() =>
                          remover(`o requisito ${r.cod_requisito}`, () =>
                            removerRequisito(r.id_requisito),
                          )
                        }
                        className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-red/10 hover:text-red"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </>
                  ) : null}
                </div>

                {aberto ? (
                  <div className="border-t border-brd bg-bg1 px-2 py-1.5">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-t3">ITENS</span>
                      <Button
                        variant="ghost"
                        icon={<Plus className="size-3" />}
                        disabled={!podeEditar}
                        onClick={abrirNovoItem}
                      >
                        Novo item
                      </Button>
                    </div>
                    {itensVisiveis.length === 0 ? (
                      <div className="py-1 text-[10px] text-t3">Nenhum item cadastrado.</div>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        {itensVisiveis.map((it) => (
                          <div
                            key={it.id_item}
                            className="flex items-center gap-2 rounded px-1 py-0.5 text-[10px] hover:bg-bg2"
                          >
                            <span
                              className={`w-[26px] shrink-0 rounded px-1 py-0.5 text-center font-bold ${
                                NIVEL_COR[it.nivel] ?? "bg-bg3 text-t3"
                              }`}
                            >
                              {it.nivel}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="font-medium text-t1">{it.nome_item}</span>
                              {it.descricao ? (
                                <span className="text-t3"> — {it.descricao}</span>
                              ) : null}
                            </span>
                            {podeEditar ? (
                              <>
                                <button
                                  type="button"
                                  title="Editar item"
                                  onClick={() => abrirEditarItem(it)}
                                  className="cursor-pointer rounded p-0.5 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                                >
                                  <Pencil className="size-3" />
                                </button>
                                <button
                                  type="button"
                                  title="Excluir item"
                                  onClick={() =>
                                    remover(`o item ${it.nome_item}`, () => removerItem(it.id_item))
                                  }
                                  className="cursor-pointer rounded p-0.5 text-t3 transition-colors hover:bg-red/10 hover:text-red"
                                >
                                  <Trash2 className="size-3" />
                                </button>
                              </>
                            ) : null}
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

      {modal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="animate-fade-in w-full max-w-[440px] overflow-hidden rounded-lg border border-brd bg-bg1 shadow-xl shadow-black/40">
            <div className="flex items-start justify-between border-b border-brd bg-bg2 px-4 py-3">
              <div className="text-[13px] font-bold text-t1">
                {modal.tipo === "manual"
                  ? modal.registro
                    ? "Editar Manual"
                    : "Novo Manual"
                  : modal.tipo === "dimensao"
                    ? modal.registro
                      ? "Editar Dimensão"
                      : "Nova Dimensão"
                    : modal.tipo === "requisito"
                      ? modal.registro
                        ? "Editar Requisito"
                        : "Novo Requisito"
                      : modal.registro
                        ? "Editar Item"
                        : "Novo Item"}
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

              {modal.tipo === "manual" ? (
                <>
                  <label className="block text-[10px] font-semibold text-t2">
                    Nome do manual
                    <input
                      value={form.nome_manual ?? ""}
                      onChange={(e) => alterar("nome_manual", e.target.value)}
                      className={`${campo} mt-1`}
                    />
                  </label>
                  <label className="block text-[10px] font-semibold text-t2">
                    Versão
                    <input
                      value={form.versao_manual ?? ""}
                      onChange={(e) => alterar("versao_manual", e.target.value)}
                      placeholder="4.1"
                      className={`${campo} mt-1 font-mono`}
                    />
                  </label>
                </>
              ) : null}

              {modal.tipo === "dimensao" ? (
                <label className="block text-[10px] font-semibold text-t2">
                  Nome da dimensão
                  <input
                    value={form.nome_dimensao ?? ""}
                    onChange={(e) => alterar("nome_dimensao", e.target.value)}
                    className={`${campo} mt-1`}
                  />
                </label>
              ) : null}

              {modal.tipo === "requisito" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-[10px] font-semibold text-t2">
                      Código
                      <input
                        value={form.cod_requisito ?? ""}
                        onChange={(e) => alterar("cod_requisito", e.target.value)}
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
                          <option key={d.id_dimensao} value={String(d.id_dimensao)}>
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
                      onChange={(e) => alterar("nome_requisito", e.target.value)}
                      className={`${campo} mt-1`}
                    />
                  </label>
                  <label className="block text-[10px] font-semibold text-t2">
                    Manual
                    <select
                      value={form.id_manual ?? ""}
                      onChange={(e) => alterar("id_manual", e.target.value)}
                      className={`${campo} mt-1`}
                    >
                      {listaManuais.map((m) => (
                        <option key={m.id_manual} value={String(m.id_manual)}>
                          {m.nome_manual} v{m.versao_manual}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : null}

              {modal.tipo === "item" ? (
                <>
                  <label className="block text-[10px] font-semibold text-t2">
                    Nome do item
                    <input
                      value={form.nome_item ?? ""}
                      onChange={(e) => alterar("nome_item", e.target.value)}
                      className={`${campo} mt-1`}
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
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
                    <div className="flex items-end pb-1 text-[10px] text-t3">
                      Requisito&nbsp;
                      <span className="font-mono font-bold text-t2">
                        {listaReqs.find((r) => r.id_requisito === Number(form.id_requisito))
                          ?.cod_requisito ?? "—"}
                      </span>
                    </div>
                  </div>
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
              ) : null}
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
    </Card>
  );
}
