"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { listarManuais, listarNiveis, type ManualDto, type NivelDto } from "@/lib/api/catalogo";
import { type CertificacaoDto } from "@/lib/api/certificacoes";

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
  onSalvar: (payload: {
    id_manual: number;
    id_nivel: number;
    nome_certificacao: string;
    status: string;
    numero_certificado: string | null;
    data_certificacao: string | null;
    data_validade: string | null;
    entidade_certificadora: string | null;
  }) => Promise<void> | void;
}) {
  const { toast } = useToast();
  const [manuais, setManuais] = useState<ManualDto[]>([]);
  const [niveis, setNiveis] = useState<NivelDto[]>([]);
  const [idManual, setIdManual] = useState<string>(
    certificacao ? String(certificacao.id_manual) : "",
  );
  const [idNivel, setIdNivel] = useState<string>(
    certificacao ? String(certificacao.id_nivel) : "",
  );
  const [nome, setNome] = useState(certificacao?.nome_certificacao ?? "");
  const [status, setStatus] = useState(certificacao?.status ?? "PENDENTE");
  const [numero, setNumero] = useState(certificacao?.numero_certificado ?? "");
  const [dataCert, setDataCert] = useState(certificacao?.data_certificacao ?? "");
  const [dataVal, setDataVal] = useState(certificacao?.data_validade ?? "");
  const [entidade, setEntidade] = useState(certificacao?.entidade_certificadora ?? "");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;
    Promise.all([listarManuais(), listarNiveis()])
      .then(([listaManuais, listaNiveis]) => {
        if (!ativo) return;
        setManuais(listaManuais);
        setNiveis(listaNiveis);
      })
      .catch((error: unknown) => {
        if (!ativo) return;
        setManuais([]);
        setNiveis([]);
        toast(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar manuais e níveis",
          "err",
        );
      });
    return () => {
      ativo = false;
    };
  }, [toast]);

  async function confirmar() {
    if (!idManual) return toast("Selecione o manual", "warn");
    if (!idNivel) return toast("Selecione o nível", "warn");
    if (!nome.trim()) return toast("Informe o nome da certificação", "warn");

    setSalvando(true);
    try {
      await onSalvar({
        id_manual: Number(idManual),
        id_nivel: Number(idNivel),
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
        <div className="flex items-start justify-between border-b border-brd bg-bg2 px-4 py-3">
          <div>
            <div className="text-[13px] font-bold text-t1">
              {certificacao ? "Editar Certificação" : "Nova Certificação"}
            </div>
            <div className="mt-0.5 text-[10px] text-t3">
              Certificação do ente em um nível de um manual do Pró-Gestão
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
              Manual
              <select
                value={idManual}
                onChange={(e) => setIdManual(e.target.value)}
                disabled={Boolean(certificacao)}
                className={cn(campo, "mt-1")}
              >
                <option value="">— Selecione —</option>
                {manuais.map((m) => (
                  <option key={m.id_manual} value={m.id_manual}>
                    {m.nome_manual} (v{m.versao_manual})
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              Nível
              <select
                value={idNivel}
                onChange={(e) => setIdNivel(e.target.value)}
                className={cn(campo, "mt-1")}
              >
                <option value="">— Selecione —</option>
                {niveis.map((n) => (
                  <option key={n.id_nivel} value={n.id_nivel}>
                    Nível {n.nome_nivel}
                  </option>
                ))}
              </select>
            </label>
          </div>

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
