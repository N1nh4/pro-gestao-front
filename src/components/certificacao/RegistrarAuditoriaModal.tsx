"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import {
  CONCLUSOES,
  MODALIDADES,
  NIVEIS,
  TIPOS_AUDITORIA,
  type Conclusao,
  type Modalidade,
  type NovaAuditoriaInput,
  type TipoAuditoria,
} from "@/lib/domain/auditorias";

const campo =
  "w-full rounded border border-brd2 bg-bg2 px-2.5 py-[7px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none";

function Label({
  children,
  required,
  className,
}: {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block text-[10px] font-semibold text-t2", className)}>
      {children}
      {required ? <span className="text-red2"> *</span> : null}
    </label>
  );
}

export function RegistrarAuditoriaModal({
  onClose,
  onSalvar,
}: {
  onClose: () => void;
  onSalvar: (input: NovaAuditoriaInput) => void;
}) {
  const { toast } = useToast();
  const [tipo, setTipo] = useState<TipoAuditoria | "">("");
  const [data, setData] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [auditor, setAuditor] = useState("");
  const [modalidade, setModalidade] = useState<Modalidade>("Presencial");
  const [duracao, setDuracao] = useState("");
  const [nivelAuditado, setNivelAuditado] = useState<"I" | "II" | "III" | "IV">("III");
  const [nivelRecomendado, setNivelRecomendado] = useState<"I" | "II" | "III" | "IV">("III");
  const [conclusao, setConclusao] = useState<Conclusao | "">("");
  const [criticidades, setCriticidades] = useState("0");
  const [parecer, setParecer] = useState("");
  const [obs, setObs] = useState("");

  function salvar() {
    if (!tipo || !data || !empresa.trim() || !auditor.trim() || !parecer.trim() || !conclusao) {
      toast("Preencha todos os campos obrigatórios", "warn");
      return;
    }
    onSalvar({
      tipo,
      data,
      empresa: empresa.trim(),
      auditor: auditor.trim(),
      modalidade,
      duracao: duracao.trim(),
      nivelAuditado,
      nivelRecomendado,
      conclusao,
      criticidades: Number.parseInt(criticidades, 10) || 0,
      parecer: parecer.trim(),
      obs: obs.trim(),
    });
    toast("Auditoria registrada com sucesso!", "ok");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="animate-fade-in max-h-[92vh] w-full max-w-[640px] overflow-hidden rounded-lg border border-brd bg-bg1 shadow-xl shadow-black/40">
        <div className="flex h-[51px] items-center justify-between border-b border-brd bg-bg2 px-4">
          <div>
            <div className="text-[13px] font-bold text-t1">Registrar Auditoria</div>
            <div className="mt-0.5 text-[10px] text-t3">Preencha os dados da auditoria realizada</div>
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

        <div className="max-h-[calc(92vh-110px)] space-y-3 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Label required>
              Tipo
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoAuditoria | "")}
                className={cn(campo, "mt-1")}
              >
                <option value="">Selecione...</option>
                {TIPOS_AUDITORIA.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Label>
            <Label required>
              Data
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className={cn(campo, "mt-1")}
              />
            </Label>
            <Label required>
              Empresa Certificadora
              <input
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Ex: IEPREV"
                className={cn(campo, "mt-1")}
              />
            </Label>
            <Label required>
              Auditor Responsável
              <input
                value={auditor}
                onChange={(e) => setAuditor(e.target.value)}
                placeholder="Nome completo"
                className={cn(campo, "mt-1")}
              />
            </Label>
            <Label>
              Modalidade
              <select
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value as Modalidade)}
                className={cn(campo, "mt-1")}
              >
                {MODALIDADES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Label>
            <Label>
              Duração
              <input
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                placeholder="Ex: 3 dias"
                className={cn(campo, "mt-1")}
              />
            </Label>
            <Label>
              Nível Auditado
              <select
                value={nivelAuditado}
                onChange={(e) => setNivelAuditado(e.target.value as typeof nivelAuditado)}
                className={cn(campo, "mt-1")}
              >
                {NIVEIS.map((n) => (
                  <option key={n} value={n}>Nível {n}</option>
                ))}
              </select>
            </Label>
            <Label>
              Nível Recomendado
              <select
                value={nivelRecomendado}
                onChange={(e) => setNivelRecomendado(e.target.value as typeof nivelRecomendado)}
                className={cn(campo, "mt-1")}
              >
                {NIVEIS.map((n) => (
                  <option key={n} value={n}>Nível {n}</option>
                ))}
              </select>
            </Label>
            <Label required>
              Conclusão
              <select
                value={conclusao}
                onChange={(e) => setConclusao(e.target.value as Conclusao | "")}
                className={cn(campo, "mt-1")}
              >
                <option value="">Selecione...</option>
                {CONCLUSOES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Label>
            <Label>
              Qtd. Pendências
              <input
                type="number"
                min={0}
                value={criticidades}
                onChange={(e) => setCriticidades(e.target.value)}
                className={cn(campo, "mt-1")}
              />
            </Label>
            <Label required className="sm:col-span-2">
              Parecer do Auditor
              <textarea
                value={parecer}
                onChange={(e) => setParecer(e.target.value)}
                rows={4}
                placeholder="Descreva o parecer técnico..."
                className={cn(campo, "mt-1 resize-none leading-relaxed")}
              />
            </Label>
            <Label className="sm:col-span-2">
              Observações
              <input
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Próximas etapas, observações adicionais..."
                className={cn(campo, "mt-1")}
              />
            </Label>
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
            onClick={salvar}
            className="cursor-pointer rounded-md bg-acc px-6 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-acc2"
          >
            Salvar Auditoria
          </button>
        </div>
      </div>
    </div>
  );
}
