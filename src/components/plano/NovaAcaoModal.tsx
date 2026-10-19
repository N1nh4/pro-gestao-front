"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import {
  ITEM_POR_REQ,
  REQS_OPCOES,
  SETORES_ALL,
  type NovaAcaoInput,
} from "@/lib/domain/plano";

const OUTRO = "__outro__";

const campo =
  "w-full rounded border border-brd2 bg-bg2 px-2.5 py-[6px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none";

export function NovaAcaoModal({
  onClose,
  onCriar,
}: {
  onClose: () => void;
  onCriar: (input: NovaAcaoInput) => number;
}) {
  const { toast } = useToast();
  const [req, setReq] = useState("");
  const [prazo, setPrazo] = useState("");
  const [item, setItem] = useState("");
  const [itemOutro, setItemOutro] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [setores, setSetores] = useState<string[]>([]);

  const itens = req ? ITEM_POR_REQ[req] ?? [] : [];
  const itemFinal = item === OUTRO ? itemOutro.trim() : item;

  function toggleSetor(setor: string, on: boolean) {
    setSetores((prev) => (on ? [...prev, setor] : prev.filter((s) => s !== setor)));
  }

  function confirmar() {
    if (!req) return toast("Selecione o requisito", "warn");
    if (!prazo) return toast("Informe o prazo", "warn");
    if (!itemFinal) return toast("Selecione o item", "warn");
    if (!objetivo.trim()) return toast("Descreva a ação", "warn");
    if (!setores.length) return toast("Selecione ao menos um Setor responsável", "warn");

    const input: NovaAcaoInput = {
      req,
      prazo,
      item: itemFinal,
      objetivo: objetivo.trim(),
      setores,
    };
    const n = onCriar(input);
    toast(
      n > 1 ? `${n} ação(ões) criada(s) com sucesso!` : "Ação criada com sucesso!",
      "ok",
    );
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="animate-fade-in w-full max-w-[640px] overflow-hidden rounded-lg border border-brd bg-bg1 shadow-xl shadow-black/40">
        <div className="flex items-start justify-between border-b border-brd bg-bg2 px-4 py-3">
          <div>
            <div className="text-[13px] font-bold text-t1">Nova Ação no Plano</div>
            <div className="mt-0.5 text-[10px] text-t3">
              Ação multissetorial — uma ação por responsável selecionado
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
                value={req}
                onChange={(e) => {
                  setReq(e.target.value);
                  setItem("");
                  setItemOutro("");
                }}
                className={cn(campo, "mt-1 font-mono")}
              >
                <option value="">— Selecione —</option>
                {REQS_OPCOES.map((r) => (
                  <option key={r.cod} value={r.cod}>{r.nome}</option>
                ))}
              </select>
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              Prazo
              <input
                type="date"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                className={cn(campo, "mt-1")}
              />
            </label>
          </div>

          <label className="block text-[10px] font-semibold text-t2">
            Item
            <select
              value={item}
              onChange={(e) => setItem(e.target.value)}
              disabled={!req}
              className={cn(campo, "mt-1")}
            >
              <option value="">
                {req ? "— Selecione o item —" : "— Selecione o requisito primeiro —"}
              </option>
              {itens.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
              {req ? <option value={OUTRO}>Outro (personalizado)...</option> : null}
            </select>
          </label>

          {item === OUTRO ? (
            <label className="block text-[10px] font-semibold text-t2">
              Item personalizado
              <input
                value={itemOutro}
                onChange={(e) => setItemOutro(e.target.value)}
                placeholder="Descrição do item"
                className={cn(campo, "mt-1")}
              />
            </label>
          ) : null}

          <label className="block text-[10px] font-semibold text-t2">
            Ação / Objetivo
            <textarea
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              rows={3}
              placeholder="Descreva o que deve ser comprovado ou executado..."
              className={cn(campo, "mt-1 resize-none leading-relaxed")}
            />
          </label>

          <div>
            <div className="text-[10px] font-semibold text-t2">
              Setores responsáveis{" "}
              <span className="font-normal text-t3">
                ({setores.length} selecionado(s))
              </span>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
              {SETORES_ALL.map((s) => {
                const on = setores.includes(s);
                return (
                  <label
                    key={s}
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
                      onChange={(e) => toggleSetor(s, e.target.checked)}
                      className="size-3 accent-acc"
                    />
                    <span className="truncate">{s}</span>
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
            className="cursor-pointer rounded-md bg-acc px-6 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-acc2"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
