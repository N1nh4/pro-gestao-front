"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import type { ManualDto, NivelDto } from "@/lib/api/catalogo";
import {
  CONCLUSAO_OPCOES,
  MODALIDADE_OPCOES,
  TIPO_OPCOES,
  rotulo,
} from "@/lib/domain/auditorias";
import {
  type AuditoriaDto,
  type AuditoriaPayload,
  type CertificacaoDto,
} from "@/lib/api/certificacoes";

const campo =
  "w-full rounded border border-brd2 bg-bg2 px-2.5 py-[6px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none";

export function AuditoriaModal({
  idCertificacao,
  certificacoes,
  auditoria,
  manuais,
  niveis,
  onClose,
  onSalvar,
}: {
  idCertificacao?: number;
  certificacoes?: CertificacaoDto[];
  /** null = nova auditoria. */
  auditoria: AuditoriaDto | null;
  manuais: ManualDto[];
  niveis: NivelDto[];
  onClose: () => void;
  onSalvar: (payload: AuditoriaPayload) => Promise<void> | void;
}) {
  const { toast } = useToast();
  const escopoBloqueado = Boolean(auditoria && auditoria.acoes_count > 0);
  const [certificacaoSelecionada, setCertificacaoSelecionada] = useState(
    idCertificacao ? String(idCertificacao) : "",
  );
  const [idManual, setIdManual] = useState(auditoria ? String(auditoria.id_manual) : "");
  const [tipo, setTipo] = useState(auditoria?.tipo ?? "pre_auditoria");
  const [modalidade, setModalidade] = useState(auditoria?.modalidade ?? "presencial");
  const [data, setData] = useState(auditoria?.data_auditoria ?? "");
  const [duracao, setDuracao] = useState(
    auditoria?.duracao_horas != null ? String(auditoria.duracao_horas) : "",
  );
  const [auditor, setAuditor] = useState(auditoria?.auditor_nome ?? "");
  const [email, setEmail] = useState(auditoria?.auditor_email ?? "");
  const [conclusao, setConclusao] = useState(auditoria?.conclusao ?? "pendente");
  const [nivelRecomendado, setNivelRecomendado] = useState(auditoria?.nivel_recomendado ?? "");
  const [parecer, setParecer] = useState(auditoria?.parecer_geral ?? "");
  const [salvando, setSalvando] = useState(false);

  async function confirmar() {
    const idCertificacaoFinal = Number(certificacaoSelecionada);
    if (!Number.isSafeInteger(idCertificacaoFinal) || idCertificacaoFinal <= 0)
      return toast("Selecione a certificação", "warn");
    if (!idManual) return toast("Selecione o manual", "warn");
    if (!data) return toast("Informe a data da auditoria", "warn");

    setSalvando(true);
    try {
      await onSalvar({
        id_certificacao: idCertificacaoFinal,
        id_manual: Number(idManual),
        tipo,
        modalidade,
        data_auditoria: data,
        duracao_horas: duracao.trim() ? Number(duracao) : null,
        nivel_recomendado: nivelRecomendado || null,
        parecer_geral: parecer.trim() || null,
        conclusao,
        auditor_nome: auditor.trim() || null,
        auditor_email: email.trim() || null,
      });
      onClose();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Não foi possível salvar a auditoria", "err");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="animate-fade-in max-h-[92vh] w-full max-w-[640px] overflow-y-auto rounded-lg border border-brd bg-bg1 shadow-xl shadow-black/40">
        <div className="flex h-[51px] items-center justify-between border-b border-brd bg-bg2 px-4">
          <div>
            <div className="text-[13px] font-bold text-t1">
              {auditoria ? "Editar Auditoria" : "Nova Auditoria"}
            </div>
            <div className="mt-0.5 text-[10px] text-t3">
              Manual avaliado nesta auditoria; o plano de ação fica dentro dela
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
          {certificacoes ? (
            <label className="block text-[10px] font-semibold text-t2">
              Certificação
              <select
                value={certificacaoSelecionada}
                onChange={(e) => setCertificacaoSelecionada(e.target.value)}
                className={cn(campo, "mt-1")}
              >
                <option value="">— Selecione —</option>
                {certificacoes.map((certificacao) => (
                  <option key={certificacao.id_certificacao} value={certificacao.id_certificacao}>
                    {certificacao.nome_certificacao}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-[10px] font-semibold text-t2">
              Manual
              <select
                value={idManual}
                onChange={(e) => setIdManual(e.target.value)}
                disabled={escopoBloqueado}
                className={cn(campo, "mt-1 disabled:opacity-60")}
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
                value={nivelRecomendado}
                onChange={(e) => setNivelRecomendado(e.target.value)}
                className={cn(campo, "mt-1")}
              >
                <option value="">—</option>
                {niveis.map((n) => (
                  <option key={n.id_nivel} value={n.nome_nivel}>
                    {rotulo(n.nome_nivel)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {escopoBloqueado ? (
            <p className="text-[10px] text-t3">
              Esta auditoria já possui ações; o manual não pode ser alterado.
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="block text-[10px] font-semibold text-t2">
              Tipo
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className={cn(campo, "mt-1")}
              >
                {TIPO_OPCOES.map((t) => (
                  <option key={t.valor} value={t.valor}>
                    {t.rotulo}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              Modalidade
              <select
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value)}
                className={cn(campo, "mt-1")}
              >
                {MODALIDADE_OPCOES.map((m) => (
                  <option key={m.valor} value={m.valor}>
                    {m.rotulo}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              Data
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className={cn(campo, "mt-1")}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-[10px] font-semibold text-t2">
              Duração (h)
              <input
                type="number"
                min="0"
                step="0.5"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                className={cn(campo, "mt-1")}
              />
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              Conclusão
              <select
                value={conclusao}
                onChange={(e) => setConclusao(e.target.value)}
                className={cn(campo, "mt-1")}
              >
                {CONCLUSAO_OPCOES.map((c) => (
                  <option key={c.valor} value={c.valor}>
                    {c.rotulo}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-[10px] font-semibold text-t2">
              Auditor
              <input
                value={auditor}
                onChange={(e) => setAuditor(e.target.value)}
                placeholder="Nome do auditor"
                className={cn(campo, "mt-1")}
              />
            </label>
            <label className="block text-[10px] font-semibold text-t2">
              E-mail do auditor
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="auditor@entidade.org"
                className={cn(campo, "mt-1")}
              />
            </label>
          </div>

          <label className="block text-[10px] font-semibold text-t2">
            Parecer geral
            <textarea
              value={parecer}
              onChange={(e) => setParecer(e.target.value)}
              rows={3}
              placeholder="Parecer do auditor sobre a auditoria..."
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
            {salvando ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
