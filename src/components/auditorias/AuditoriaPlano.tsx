"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Upload } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Kpi } from "@/components/ui/Kpi";
import { AcoesTable } from "@/components/plano/AcoesTable";
import { EditarAcaoModal } from "@/components/plano/EditarAcaoModal";
import { NovaAcaoModal } from "@/components/plano/NovaAcaoModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  atualizarAcao,
  atualizarStatusAcao,
  criarAcao,
  enviarDocumentoAcao,
  listarAcoes,
  removerAcao,
} from "@/lib/api/plano";
import { criarDiligencia, listarDiligencias } from "@/lib/api/diligencias";
import type { Criticidade } from "@/lib/domain/diligencias";
import { listarUnidades } from "@/lib/api/admin";
import {
  listarManuais,
  listarRequisitos,
  type ManualDto,
  type RequisitoDto,
  type RequisitoOpcao,
} from "@/lib/api/catalogo";
import { obterAuditoria, type AuditoriaDto } from "@/lib/api/certificacoes";
import { rotulo } from "@/lib/domain/auditorias";
import { type AcaoPlano, type AcaoStatus, type NovaAcaoInput } from "@/lib/domain/plano";
import { setPrimaryAction } from "@/lib/primaryAction";
import { useApiResource } from "@/lib/useApiResource";

export function AuditoriaPlano({ idAuditoria }: { idAuditoria: string }) {
  const { perfil } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dim, setDim] = useState("");
  const [st, setSt] = useState<AcaoStatus | "">("");
  const [mes, setMes] = useState("");
  const [unidade, setUnidade] = useState("");
  const [novaAberta, setNovaAberta] = useState(false);
  const [editando, setEditando] = useState<AcaoPlano | null>(null);

  const auditoriaResource = useApiResource<AuditoriaDto | null>(
    `auditoria-${idAuditoria}`,
    () => (idAuditoria ? obterAuditoria(idAuditoria) : Promise.resolve(null)),
    null,
  );
  const acoesResource = useApiResource<AcaoPlano[]>(
    `acoes-auditoria-${idAuditoria}`,
    () => (idAuditoria ? listarAcoes({ id_auditoria: idAuditoria }) : Promise.resolve([])),
    [],
  );
  const dilResource = useApiResource("diligencias", listarDiligencias, []);
  const unidadesResource = useApiResource("unidades", listarUnidades, []);
  const reqsResource = useApiResource<RequisitoDto[]>("requisitos", listarRequisitos, []);
  const manuaisResource = useApiResource<ManualDto[]>("manuais", listarManuais, []);
  const acoes = acoesResource.data;
  const unidades = unidadesResource.data;
  const requisitos = reqsResource.data;
  const auditoria = auditoriaResource.data;

  // Select de requisito: apenas os do manual da auditoria (código + nome + versão).
  const versaoPorManual = useMemo(
    () => new Map(manuaisResource.data.map((m) => [m.id_manual, m.versao_manual])),
    [manuaisResource.data],
  );
  const requisitosOpcoes: RequisitoOpcao[] = requisitos
    .map((r) => {
      if (auditoria && r.id_manual !== auditoria.id_manual) return null;
      const versao = versaoPorManual.get(r.id_manual);
      return {
        id_requisito: r.id_requisito,
        cod_requisito: r.cod_requisito,
        nome_requisito: r.nome_requisito,
        rotulo: `${r.cod_requisito} — ${r.nome_requisito}${versao ? ` (v${versao})` : ""}`,
      };
    })
    .filter((requisito): requisito is RequisitoOpcao => requisito !== null);

  const isAdmin = perfil?.id === "ag" || perfil?.id === "sa";
  const isOperacional = perfil?.id === "op";

  useEffect(() => {
    if (!isAdmin) return;
    return setPrimaryAction(() => {
      if (!auditoria) {
        toast("A auditoria ainda não foi carregada.", "warn");
        return;
      }
      setNovaAberta(true);
    });
  }, [isAdmin, auditoria, toast]);

  const unidadesPlano = useMemo(
    () => Array.from(new Set(acoes.map((a) => a.setor).filter(Boolean))).sort(),
    [acoes],
  );
  const meses = useMemo(
    () =>
      Array.from(
        new Set(
          acoes
            .map((a) => a.prazo)
            .filter((p) => p && p.length >= 7)
            .map((p) => p.slice(5, 7)),
        ),
      ).sort(),
    [acoes],
  );

  const data = acoes.filter((a) => {
    if (search) {
      const s = search.toLowerCase();
      const alvo =
        `${a.idAcao} ${a.req} ${a.reqNome} ${a.item} ${a.nome} ${a.acao} ${a.setor}`.toLowerCase();
      if (!alvo.includes(s)) return false;
    }
    if (dim) {
      const map: Record<string, string> = { CI: "3.1", GC: "3.2", EP: "3.3" };
      if (!a.req.startsWith(map[dim])) return false;
    }
    if (st) if (a.status !== st) return false;
    if (mes) if (!a.prazo || a.prazo.slice(5, 7) !== mes) return false;
    if (unidade) if (a.setor !== unidade) return false;
    return true;
  });

  const k = {
    pend: data.filter((a) => a.status === "PENDENTE").length,
    env: data.filter((a) => a.status === "ENVIADO").length,
    dil: data.filter((a) => a.status === "DILIGÊNCIA").length,
    apr: data.filter((a) => a.status === "APROVADO").length,
  };
  const tot = data.length;
  const pct = tot ? Math.round((k.apr / tot) * 100) : 0;

  async function criarAcaoNova(input: NovaAcaoInput) {
    await criarAcao({
      id_auditoria: idAuditoria,
      id_requisito: input.idRequisito,
      id_item: input.idItem,
      nome: input.nome,
      descricao: input.descricao,
      prazo: input.prazo,
      unidade_ids: input.unidadeIds,
    });
    acoesResource.reload();
    toast("Ação criada", "ok");
  }

  async function salvarAcao(payload: { nome: string; descricao: string; prazo: string }) {
    if (!editando) return;
    await atualizarAcao(editando.idAcao, payload);
    acoesResource.reload();
    toast("Ação atualizada", "ok");
  }

  async function aprovarAcao(acao: AcaoPlano) {
    await atualizarStatusAcao(acao.idAcao, "APROVADO");
    acoesResource.reload();
    toast("Ação aprovada", "ok");
  }

  async function enviarDocumento(acao: AcaoPlano, arquivo: File) {
    await enviarDocumentoAcao(acao.idAcao, arquivo);
    acoesResource.reload();
    dilResource.reload();
    toast("Comprovação enviada para análise", "ok");
  }

  async function emitirDiligencia(
    acao: AcaoPlano,
    payload: { situacao_detectada: string; criticidade: Criticidade; prazo_resposta: string },
  ) {
    await criarDiligencia({ acao_id: acao.idAcao, ...payload });
    acoesResource.reload();
    dilResource.reload();
    toast("Diligência emitida", "ok");
  }

  async function remover(acao: AcaoPlano) {
    if (!window.confirm(`Remover a ação #${acao.idAcao} (${acao.nome || acao.acao})?`)) return;
    try {
      await removerAcao(acao.idAcao);
      acoesResource.reload();
      toast("Ação removida", "ok");
    } catch {
      toast("Não foi possível remover a ação", "err");
    }
  }

  return (
    <div className="animate-fade-in">
      {acoesResource.offline ? (
        <Alert variant="warn" title="API indisponível">
          Não foi possível carregar as ações desta auditoria.
        </Alert>
      ) : null}
      {auditoriaResource.offline ? (
        <Alert variant="warn" title="Auditoria indisponível" className="mb-2">
          Não foi possível carregar os dados da auditoria. Tente novamente mais tarde.
        </Alert>
      ) : null}

      <Alert
        variant="info"
        title={
          auditoria
            ? `${auditoria.nome_certificacao} — ${rotulo(auditoria.tipo)}`
            : "Plano de Ação da Auditoria"
        }
        action={
          <div className="flex gap-1">
            <Button
              onClick={() =>
                router.push(
                  auditoria ? `/certificacoes/${auditoria.id_certificacao}` : "/certificacoes",
                )
              }
              className="h-6 px-2 text-[10px]"
            >
              <ArrowLeft className="size-3" />
              Auditorias
            </Button>
            {isAdmin ? (
              <Button onClick={() => router.push("/progestao")} className="h-6 px-2 text-[10px]">
                <FileText className="size-3" />
                Diagnóstico
              </Button>
            ) : null}
          </div>
        }
      >
        {auditoriaResource.loading
          ? "Carregando auditoria…"
          : auditoria
            ? `${auditoria.nome_manual} · v${auditoria.versao_manual} · ${rotulo(auditoria.modalidade)} · ${auditoria.data_auditoria}. As ações abaixo pertencem a esta auditoria.`
            : "A auditoria solicitada não foi encontrada."}
      </Alert>

      {!auditoriaResource.loading && !auditoria ? (
        <Alert variant="warn" title="Auditoria indisponível" className="mt-2">
          Verifique o endereço ou selecione uma auditoria cadastrada.
        </Alert>
      ) : null}

      {auditoria ? (
        <>
          <div className="mb-3 mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <Kpi label="Pendentes/Vencidas" value={k.pend} tone="text-t2" delta={`${tot} ações`} />
            <Kpi
              label="Enviados/Em análise"
              value={k.env}
              tone="text-amb2"
              delta="aguardando análise"
            />
            <Kpi label="Diligências abertas" value={k.dil} tone="text-red2" />
            <Kpi
              label="Aprovados/Concluídos"
              value={k.apr}
              tone="text-grn2"
              delta={`${pct}% aprovado`}
            />
          </div>

          <Card className="mb-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar requisito, item ou ação..."
                className="w-64 rounded border border-brd2 bg-bg2 px-2.5 py-[5px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none"
              />
              <select
                value={dim}
                onChange={(e) => setDim(e.target.value)}
                className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none"
              >
                <option value="">Todas as dimensões</option>
                <option value="CI">3.1 Controles Internos</option>
                <option value="GC">3.2 Governança Corporativa</option>
                <option value="EP">3.3 Educação Previdenciária</option>
              </select>
              <select
                value={st}
                onChange={(e) => setSt(e.target.value as AcaoStatus | "")}
                className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none"
              >
                <option value="">Todos os status</option>
                <option value="PENDENTE">Pendente</option>
                <option value="ENVIADO">Enviado</option>
                <option value="APROVADO">Aprovado</option>
                <option value="DILIGÊNCIA">Diligência</option>
              </select>
              <select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none"
              >
                <option value="">Todos os meses</option>
                {meses.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none"
              >
                <option value="">Todas as unidades</option>
                {unidadesPlano.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <div className="flex-1" />
              <Button variant="ghost">
                <Upload className="size-3.5" />
                Exportar
              </Button>
            </div>
          </Card>

          <AcoesTable
            acoes={data}
            unidades={unidades}
            diligencias={dilResource.data}
            requisitos={requisitosOpcoes}
            podeEditar={isAdmin}
            podeAuditar={isAdmin}
            podeEnviar={isOperacional}
            onEditar={(a) => setEditando(a)}
            onRemover={remover}
            onAprovar={aprovarAcao}
            onEnviarDocumento={enviarDocumento}
            onEmitirDiligencia={emitirDiligencia}
          />

          {novaAberta && isAdmin ? (
            <NovaAcaoModal
              requisitos={requisitosOpcoes}
              unidades={unidades}
              onClose={() => setNovaAberta(false)}
              onCriar={criarAcaoNova}
            />
          ) : null}

          {editando ? (
            <EditarAcaoModal
              acao={editando}
              onClose={() => setEditando(null)}
              onSalvar={salvarAcao}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
