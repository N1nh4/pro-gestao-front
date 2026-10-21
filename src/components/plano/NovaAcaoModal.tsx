"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { listarItens, type ItemDto, type NivelItem, type RequisitoOpcao } from "@/lib/api/catalogo";
import type { UnidadeDto } from "@/lib/api/admin";
import { type NovaAcaoInput } from "@/lib/domain/plano";

const campo =
  "w-full rounded border border-brd2 bg-bg2 px-2.5 py-[6px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none";

export function NovaAcaoModal({
  requisitos,
  unidades,
  nivel,
  onClose,
  onCriar,
}: {
  requisitos: RequisitoOpcao[];
  unidades: UnidadeDto[];
  nivel?: NivelItem;
  onClose: () => void;
  onCriar: (input: NovaAcaoInput) => Promise<void> | void;
}) {
  const { toast } = useToast();
  const [idRequisito, setIdRequisito] = useState<string>("");
  const [prazo, setPrazo] = useState("");
  const [idItem, setIdItem] = useState<string>("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [unidadesSel, setUnidadesSel] = useState<string[]>([]);
  const [itensPorReq, setItensPorReq] = useState<{ id: number; itens: ItemDto[] } | null>(null);
  const [salvando, setSalvando] = useState(false);

  const requisito = requisitos.find((r) => String(r.id_requisito) === idRequisito);
  const itens = itensPorReq?.id === Number(idRequisito) ? itensPorReq.itens : [];

  // Itens reais do requisito selecionado (catálogo, por ID).
  useEffect(() => {
    const id = Number(idRequisito);
    if (!id) return;
    let ativo = true;
    listarItens({ id_requisito: id, nivel })
      .then((lista) => {
        if (ativo) setItensPorReq({ id, itens: lista });
      })
      .catch(() => {
        if (ativo) setItensPorReq({ id, itens: [] });
      });
    return () => {
      ativo = false;
    };
  }, [idRequisito, nivel]);

  function toggleUnidade(id: string, on: boolean) {
    setUnidadesSel((prev) => (on ? [...prev, id] : prev.filter((u) => u !== id)));
  }

  async function confirmar() {
    if (!requisito) return toast("Selecione o requisito", "warn");
    if (!idItem) return toast("Selecione o item", "warn");
    if (!nome.trim()) return toast("Informe o nome da ação", "warn");
    if (!descricao.trim()) return toast("Descreva a ação", "warn");
    if (!prazo) return toast("Informe o prazo", "warn");
    if (!unidadesSel.length) return toast("Selecione ao menos uma unidade responsável", "warn");

    setSalvando(true);
    try {
      await onCriar({
        idRequisito: requisito.id_requisito,
        idItem: Number(idItem),
        prazo,
        nome: nome.trim(),
        descricao: descricao.trim(),
        unidadeIds: unidadesSel,
      });
      onClose();
    } catch {
      toast("Não foi possível criar a ação", "err");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="animate-fade-in w-full max-w-[640px] overflow-hidden rounded-lg border border-brd bg-bg1 shadow-xl shadow-black/40">
        <div className="flex items-start justify-between border-b border-brd bg-bg2 px-4 py-3">
          <div>
            <div className="text-[13px] font-bold text-t1">Nova Ação no Plano</div>
            <div className="mt-0.5 text-[10px] text-t3">
              Ação multissetorial — uma ação por unidade responsável selecionada
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
            title="Fechar"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-[10px] font-semibold text-t2">
              Requisito
              <select
                value={idRequisito}
                onChange={(e) => {
                  setIdRequisito(e.target.value);
                  setIdItem("");
                }}
                className={cn(campo, "mt-1")}
              >
                <option value="">— Selecione —</option>
                {requisitos.map((r) => (
                  <option key={r.id_requisito} value={r.id_requisito}>
                    {r.rotulo}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              Item do requisito
              <select
                value={idItem}
                onChange={(e) => setIdItem(e.target.value)}
                disabled={!idRequisito}
                className={cn(campo, "mt-1")}
              >
                <option value="">
                  {idRequisito ? "— Selecione o item —" : "— Selecione o requisito primeiro —"}
                </option>
                {itens.map((i) => (
                  <option key={i.id_item} value={i.id_item}>
                    {i.nivel} · {i.nome_item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-[10px] font-semibold text-t2">
              Prazo
              <input
                type="date"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                className={cn(campo, "mt-1")}
              />
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              Nome da ação
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como a ação é chamada no plano"
                className={cn(campo, "mt-1")}
              />
            </label>
          </div>

          <label className="block text-[10px] font-semibold text-t2">
            Descrição
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="Descreva o que deve ser comprovado ou executado..."
              className={cn(campo, "mt-1 resize-none leading-relaxed")}
            />
          </label>

          <div>
            <div className="text-[10px] font-semibold text-t2">
              Unidades responsáveis{" "}
              <span className="font-normal text-t3">
                ({unidadesSel.length} selecionada(s))
              </span>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
              {unidades.map((u) => {
                const on = unidadesSel.includes(u.id);
                return (
                  <label
                    key={u.id}
                    title={u.nome}
                    className={cn(
                      "flex cursor-pointer items-center gap-1.5 rounded border px-2 py-1.5 text-[10px] font-semibold transition-colors",
                      on
                        ? "border-acc/40 bg-acc3 text-t1"
                        : "border-brd bg-bg2 text-t2 hover:bg-bg3",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={(e) => toggleUnidade(u.id, e.target.checked)}
                      className="size-3 accent-acc"
                    />
                    <span className="truncate">{u.sigla}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-brd bg-bg2 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md border border-brd2 bg-bg1 px-4 py-1.5 text-[11px] font-semibold text-t2 transition-colors hover:bg-bg3 hover:text-t1"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={salvando}
            className="cursor-pointer rounded-md bg-acc px-6 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-acc2 disabled:opacity-60"
          >
            {salvando ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
