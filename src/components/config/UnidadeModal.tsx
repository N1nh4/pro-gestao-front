"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { ApiError } from "@/lib/api/client";
import {
  atualizarUnidade,
  criarUnidade,
  type UnidadeDto,
} from "@/lib/api/admin";

const campo =
  "w-full rounded border border-brd2 bg-bg2 px-2.5 py-[6px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none";

export function UnidadeModal({
  unidade,
  onClose,
  onSaved,
}: {
  unidade?: UnidadeDto | null;
  onClose: () => void;
  onSaved: (u: UnidadeDto) => void;
}) {
  const { toast } = useToast();
  const edicao = Boolean(unidade);
  const [sigla, setSigla] = useState(unidade?.sigla ?? "");
  const [nome, setNome] = useState(unidade?.nome ?? "");
  const [descricao, setDescricao] = useState(unidade?.descricao ?? "");
  const [salvando, setSalvando] = useState(false);

  function confirmar() {
    if (!sigla.trim()) return toast("Informe a sigla", "warn");
    if (!nome.trim()) return toast("Informe o nome da unidade", "warn");
    setSalvando(true);
    const payload = { sigla: sigla.trim(), nome: nome.trim(), descricao: descricao.trim() || null };
    const acao = unidade
      ? atualizarUnidade(unidade.id, payload)
      : criarUnidade(payload);
    acao
      .then((salvo) => {
        toast(edicao ? "Unidade atualizada." : "Unidade criada.", "ok");
        onSaved(salvo);
        onClose();
      })
      .catch((err: unknown) => {
        toast(err instanceof ApiError ? err.message : "Falha ao salvar unidade.", "err");
      })
      .finally(() => setSalvando(false));
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="animate-fade-in w-full max-w-[440px] overflow-hidden rounded-lg border border-brd bg-bg1 shadow-xl shadow-black/40">
        <div className="flex items-start justify-between border-b border-brd bg-bg2 px-4 py-3">
          <div className="text-[13px] font-bold text-t1">
            {edicao ? "Editar Unidade" : "Nova Unidade"}
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
          <div className="grid grid-cols-[110px_1fr] gap-3">
            <label className="block text-[10px] font-semibold text-t2">
              Sigla
              <input
                value={sigla}
                onChange={(e) => setSigla(e.target.value)}
                maxLength={20}
                className={cn(campo, "mt-1 font-mono uppercase")}
              />
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              Nome
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={cn(campo, "mt-1")}
              />
            </label>
          </div>
          <label className="block text-[10px] font-semibold text-t2">
            Descrição (opcional)
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
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
            className="cursor-pointer rounded-md bg-acc px-6 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-acc2 disabled:opacity-40"
          >
            {salvando ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
