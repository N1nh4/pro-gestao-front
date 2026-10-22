"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { type AcaoPlano } from "@/lib/domain/plano";

const campo =
  "w-full rounded border border-brd2 bg-bg2 px-2.5 py-[6px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none";

export function EditarAcaoModal({
  acao,
  onClose,
  onSalvar,
}: {
  acao: AcaoPlano;
  onClose: () => void;
  onSalvar: (payload: {
    nome: string;
    descricao: string;
    prazo: string;
  }) => Promise<void> | void;
}) {
  const { toast } = useToast();
  const [nome, setNome] = useState(acao.nome || acao.acao);
  const [descricao, setDescricao] = useState(acao.acao);
  const [prazo, setPrazo] = useState(acao.prazo);
  const [salvando, setSalvando] = useState(false);

  async function confirmar() {
    if (!nome.trim()) return toast("Informe o nome da ação", "warn");
    if (!descricao.trim()) return toast("Descreva a ação", "warn");
    if (!prazo) return toast("Informe o prazo", "warn");

    setSalvando(true);
    try {
      await onSalvar({ nome: nome.trim(), descricao: descricao.trim(), prazo });
      onClose();
    } catch {
      toast("Não foi possível salvar a ação", "err");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="animate-fade-in w-full max-w-[560px] overflow-hidden rounded-lg border border-brd bg-bg1 shadow-xl shadow-black/40">
        <div className="flex h-[51px] items-center justify-between border-b border-brd bg-bg2 px-4">
          <div>
            <div className="text-[13px] font-bold text-t1">Editar Ação #{acao.idAcao}</div>
            <div className="mt-0.5 text-[10px] text-t3">
              {acao.req} · {acao.item} · {acao.setor}
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
              Nome da ação
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={cn(campo, "mt-1")}
              />
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
            Descrição
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              className={cn(campo, "mt-1 resize-none leading-relaxed")}
            />
          </label>
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
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
