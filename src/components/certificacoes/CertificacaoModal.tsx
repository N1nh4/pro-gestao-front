"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { type CertificacaoDto, type CertificacaoPayload } from "@/lib/api/certificacoes";

const campo =
  "w-full rounded border border-brd2 bg-bg2 px-2.5 py-[6px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none";

const STATUS_OPCOES = [
  { valor: "PENDENTE", rotulo: "Pendente" },
  { valor: "VIGENTE", rotulo: "Vigente" },
  { valor: "VENCIDA", rotulo: "Vencida" },
  { valor: "REVOGADA", rotulo: "Revogada" },
];

export function CertificacaoModal({
  certificacao,
  onClose,
  onSalvar,
}: {
  /** null = nova certificação. */
  certificacao: CertificacaoDto | null;
  onClose: () => void;
  onSalvar: (payload: CertificacaoPayload) => Promise<void> | void;
}) {
  const { toast } = useToast();
  const [nome, setNome] = useState(certificacao?.nome_certificacao ?? "");
  const [status, setStatus] = useState(certificacao?.status ?? "PENDENTE");
  const [numero, setNumero] = useState(certificacao?.numero_certificado ?? "");
  const [dataCert, setDataCert] = useState(certificacao?.data_certificacao ?? "");
  const [dataVal, setDataVal] = useState(certificacao?.data_validade ?? "");
  const [entidade, setEntidade] = useState(certificacao?.entidade_certificadora ?? "");
  const [salvando, setSalvando] = useState(false);

  async function confirmar() {
    if (!nome.trim()) return toast("Informe o nome da certificação", "warn");

    setSalvando(true);
    try {
      await onSalvar({
        nome_certificacao: nome.trim(),
        status,
        numero_certificado: numero.trim() || null,
        data_certificacao: dataCert || null,
        data_validade: dataVal || null,
        entidade_certificadora: entidade.trim() || null,
      });
      onClose();
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Não foi possível salvar a certificação",
        "err",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="animate-fade-in w-full max-w-[560px] overflow-hidden rounded-lg border border-brd bg-bg1 shadow-xl shadow-black/40">
        <div className="flex h-[51px] items-center justify-between border-b border-brd bg-bg2 px-4">
          <div>
            <div className="text-[13px] font-bold text-t1">
              {certificacao ? "Editar Certificação" : "Nova Certificação"}
            </div>
            <div className="mt-0.5 text-[10px] text-t3">
              Certificado do ente — as auditorias (manual + nível) ficam dentro dele
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
          <label className="block text-[10px] font-semibold text-t2">
            Nome da certificação
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como a certificação é chamada"
              className={cn(campo, "mt-1")}
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-[10px] font-semibold text-t2">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={cn(campo, "mt-1")}
              >
                {STATUS_OPCOES.map((s) => (
                  <option key={s.valor} value={s.valor}>
                    {s.rotulo}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              Número do certificado
              <input
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ex.: CERT-III-2024-0042"
                className={cn(campo, "mt-1")}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-[10px] font-semibold text-t2">
              Data da certificação
              <input
                type="date"
                value={dataCert}
                onChange={(e) => setDataCert(e.target.value)}
                className={cn(campo, "mt-1")}
              />
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              Validade
              <input
                type="date"
                value={dataVal}
                onChange={(e) => setDataVal(e.target.value)}
                className={cn(campo, "mt-1")}
              />
            </label>
          </div>

          <label className="block text-[10px] font-semibold text-t2">
            Entidade certificadora
            <input
              value={entidade}
              onChange={(e) => setEntidade(e.target.value)}
              placeholder="Ex.: IEPREV"
              className={cn(campo, "mt-1")}
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
            {salvando ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
