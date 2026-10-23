"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/context/ToastContext";
import { ApiError } from "@/lib/api/client";
import { useApiResource } from "@/lib/useApiResource";
import {
  atualizarManual,
  criarManual,
  listarManuais,
  listarRequisitos,
  removerManual,
  type ManualDto,
  type RequisitoDto,
} from "@/lib/api/catalogo";

const campo =
  "w-full rounded border border-brd2 bg-bg2 px-2.5 py-[6px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none";

type ModalEstado = { registro: ManualDto | null };

const BOTOES = "cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-bg3 hover:text-t1";
const BOTOES_RUIM =
  "cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-red/10 hover:text-red";

export function ManuaisPanel({ podeEditar }: { podeEditar: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const manuais = useApiResource<ManualDto[]>("cfg-manuais", listarManuais, []);
  const requisitos = useApiResource<RequisitoDto[]>("cfg-reqs", listarRequisitos, []);

  const [modal, setModal] = useState<ModalEstado | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const listaManuais = [...manuais.data].sort((a, b) => b.id_manual - a.id_manual);
  const listaReqs = requisitos.data;

  const porManual = new Map<number, { requisitos: number; itens: number }>();
  for (const r of listaReqs) {
    const atual = porManual.get(r.id_manual) ?? { requisitos: 0, itens: 0 };
    atual.requisitos += 1;
    atual.itens += r.total_itens;
    porManual.set(r.id_manual, atual);
  }

  function recarregar() {
    manuais.reload();
    requisitos.reload();
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

  function salvar() {
    if (!modal) return;
    setSalvando(true);
    setErro(null);

    const edicao = modal.registro != null;

    const payload = {
      nome_manual: (form.nome_manual ?? "").trim(),
      versao_manual: (form.versao_manual ?? "").trim(),
    };
    if (!payload.nome_manual) {
      setSalvando(false);
      setErro("Informe o nome do manual.");
      return;
    }
    const salvamento = modal.registro
      ? atualizarManual(modal.registro.id_manual, payload).then((salvo) => ({
          salvo,
          criado: false,
        }))
      : criarManual(payload).then((salvo) => ({ salvo, criado: true }));

    salvamento
      .then(({ salvo, criado }) => {
        manuais.setData((atuais) =>
          [
            salvo,
            ...atuais.filter((manual) => manual.id_manual !== salvo.id_manual),
          ].sort((a, b) => b.id_manual - a.id_manual),
        );
        toast(edicao ? "Registro atualizado." : "Registro criado.", "ok");
        fecharModal();
        requisitos.reload();
        if (!criado) manuais.reload();
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
        toast(err instanceof ApiError ? err.message : "Falha ao remover.", "err");
      });
  }

  const offline = manuais.offline || requisitos.offline;
  const msgOffline = manuais.error || requisitos.error || "API indisponível.";
  const carregando = manuais.loading || requisitos.loading;

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <div className="text-[12px] font-semibold text-t1">Manuais</div>
            <div className="text-[10px] text-t3">
              Todos os manuais cadastrados. Use o ícone de visualização para abrir os
              requisitos de um manual.
            </div>
          </div>
          <Button
            variant="pri"
            icon={<Plus className="size-3.5" />}
            disabled={!podeEditar}
            onClick={() => abrir({ registro: null }, { nome_manual: "", versao_manual: "" })}
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
                  onClick={recarregar}
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

        {carregando ? (
          <div className="py-4 text-center text-[11px] text-t3">Carregando manuais…</div>
        ) : listaManuais.length === 0 ? (
          <div className="py-4 text-center text-[11px] text-t3">Nenhum manual cadastrado.</div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {listaManuais.map((m) => {
              const stat = porManual.get(m.id_manual) ?? { requisitos: 0, itens: 0 };
              return (
                <div
                  key={m.id_manual}
                  className="flex flex-col rounded-md border border-brd bg-bg2 p-2.5 transition-colors hover:border-brd2"
                >
                  <div className="flex items-start gap-2">
                    <span className="rounded bg-bg3 p-1.5 text-t3">
                      <BookOpen className="size-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12px] font-semibold text-t1">
                        {m.nome_manual}
                      </div>
                      <div className="font-mono text-[10px] text-t3">v{m.versao_manual}</div>
                    </div>
                  </div>

                  <div className="mt-2 text-[10px] text-t3">
                    {stat.requisitos} requisito{stat.requisitos === 1 ? "" : "s"} ·{" "}
                    {stat.itens} item{stat.itens === 1 ? "" : "s"}
                  </div>

                  <div className="mt-2 flex items-center justify-end gap-1 border-t border-brd pt-1.5">
                    <button
                      type="button"
                      title="Visualizar requisitos"
                      onClick={() => router.push(`/manual/${m.id_manual}`)}
                      className="cursor-pointer rounded p-1 text-acc2 transition-colors hover:bg-acc3/40 hover:text-acc"
                    >
                      <Eye className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Editar manual"
                      disabled={!podeEditar}
                      onClick={() =>
                        abrir(
                          { registro: m },
                          { nome_manual: m.nome_manual, versao_manual: m.versao_manual },
                        )
                      }
                      className={BOTOES}
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Excluir manual"
                      disabled={!podeEditar}
                      onClick={() =>
                        remover(`o manual ${m.nome_manual} v${m.versao_manual}`, () =>
                          removerManual(m.id_manual),
                        )
                      }
                      className={BOTOES_RUIM}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {modal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="animate-fade-in w-full max-w-[440px] overflow-hidden rounded-lg border border-brd bg-bg1 shadow-xl shadow-black/40">
            <div className="flex h-[51px] items-center justify-between border-b border-brd bg-bg2 px-4">
              <div className="text-[13px] font-bold text-t1">
                {modal.registro ? "Editar Manual" : "Novo Manual"}
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
