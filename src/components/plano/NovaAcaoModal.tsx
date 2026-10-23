"use client";

import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import { listarItens, type ItemDto, type NivelItem, type RequisitoOpcao } from "@/lib/api/catalogo";
import type { AuditoriaDto } from "@/lib/api/certificacoes";
import type { UnidadeDto } from "@/lib/api/admin";
import { type NovaAcaoInput } from "@/lib/domain/plano";

const campo =
  "w-full rounded border border-brd2 bg-bg2 px-2.5 py-[6px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none";

export function NovaAcaoModal({
  requisitos,
  requisitosPorManual,
  unidades,
  auditorias,
  idAuditoriaInicial,
  nivel,
  onClose,
  onCriar,
}: {
  requisitos: RequisitoOpcao[];
  requisitosPorManual?: ReadonlyMap<number, RequisitoOpcao[]>;
  unidades: UnidadeDto[];
  auditorias?: AuditoriaDto[];
  idAuditoriaInicial?: string;
  nivel?: NivelItem;
  onClose: () => void;
  onCriar: (input: NovaAcaoInput, idAuditoria: string) => Promise<void> | void;
}) {
  const { toast } = useToast();
  const [idCertificacao, setIdCertificacao] = useState("");
  const [idAuditoria, setIdAuditoria] = useState(idAuditoriaInicial ?? "");
  const [idRequisito, setIdRequisito] = useState<string>("");
  const [requisitoAberto, setRequisitoAberto] = useState(false);
  const [prazo, setPrazo] = useState("");
  const [idItem, setIdItem] = useState<string>("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [unidadesSel, setUnidadesSel] = useState<string[]>([]);
  const [itensPorReq, setItensPorReq] = useState<{ id: number; itens: ItemDto[] } | null>(null);
  const [salvando, setSalvando] = useState(false);

  const certificacoesDisponiveis = auditorias
    ? Array.from(
        new Map(
          auditorias.map((item) => [item.id_certificacao, item.nome_certificacao]),
        ),
      ).sort((a, b) => a[1].localeCompare(b[1]))
    : [];
  const auditoriasDaCertificacao =
    auditorias?.filter((item) => String(item.id_certificacao) === idCertificacao) ?? [];
  const auditoria = auditorias?.find((item) => item.id === idAuditoria);
  const requisitosDisponiveis = auditorias
    ? (auditoria && requisitosPorManual?.get(auditoria.id_manual)) ?? []
    : requisitos;
  const requisito = requisitosDisponiveis.find((r) => String(r.id_requisito) === idRequisito);
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
    if (!idAuditoria) return toast("Selecione a auditoria", "warn");
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
      }, idAuditoria);
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
        <div className="flex h-[51px] items-center justify-between border-b border-brd bg-bg2 px-4">
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

        <div className="max-h-[calc(100vh-8rem)] space-y-3 overflow-y-auto p-4">
          {auditorias ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block text-[10px] font-semibold text-t2">
                Certificação
                <select
                  value={idCertificacao}
                  onChange={(e) => {
                    setIdCertificacao(e.target.value);
                    setIdAuditoria("");
                    setIdRequisito("");
                    setIdItem("");
                  }}
                  className={cn(campo, "mt-1")}
                >
                  <option value="">— Selecione a certificação —</option>
                  {certificacoesDisponiveis.map(([id, nome]) => (
                    <option key={id} value={id}>
                      {nome}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[10px] font-semibold text-t2">
                Auditoria
                <select
                  value={idAuditoria}
                  disabled={!idCertificacao}
                  onChange={(e) => {
                    setIdAuditoria(e.target.value);
                    setIdRequisito("");
                    setIdItem("");
                  }}
                  className={cn(campo, "mt-1")}
                >
                  <option value="">
                    {idCertificacao ? "— Selecione a auditoria —" : "— Selecione a certificação primeiro —"}
                  </option>
                  {auditoriasDaCertificacao.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome_manual} · {item.data_auditoria}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-[10px] font-semibold text-t2">
              Requisito
              <div className="relative mt-1">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={requisitoAberto}
                  onClick={() => setRequisitoAberto((aberto) => !aberto)}
                  className={cn(campo, "flex min-w-0 items-center justify-between gap-2 text-left")}
                >
                  <span className="min-w-0 break-words whitespace-normal">
                    {requisitosDisponiveis.find((r) => String(r.id_requisito) === idRequisito)
                      ?.rotulo ?? "— Selecione —"}
                  </span>
                  <ChevronDown className="size-3 shrink-0 text-t3" aria-hidden="true" />
                </button>
                {requisitoAberto ? (
                  <div
                    role="listbox"
                    aria-label="Requisitos"
                    className="absolute inset-x-0 top-full z-30 mt-1 max-h-48 overflow-y-auto rounded border border-brd2 bg-bg1 shadow-lg"
                  >
                    {requisitosDisponiveis.length ? (
                      requisitosDisponiveis.map((r) => (
                        <button
                          key={r.id_requisito}
                          type="button"
                          role="option"
                          aria-selected={String(r.id_requisito) === idRequisito}
                          onClick={() => {
                            setIdRequisito(String(r.id_requisito));
                            setIdItem("");
                            setRequisitoAberto(false);
                          }}
                          className="block w-full cursor-pointer px-2.5 py-2 text-left text-[11px] leading-relaxed text-t1 whitespace-normal break-words hover:bg-bg3"
                        >
                          {r.rotulo}
                        </button>
                      ))
                    ) : (
                      <div className="px-2.5 py-2 text-[11px] text-t3">
                        {auditorias && !idAuditoria
                          ? "Selecione uma auditoria primeiro."
                          : "Nenhum requisito disponível."}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
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
              Ação
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
