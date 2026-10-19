"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Kpi } from "@/components/ui/Kpi";
import { AcoesTable } from "@/components/plano/AcoesTable";
import { NovaAcaoModal } from "@/components/plano/NovaAcaoModal";
import {
  montarAcoes,
  unidadePorSetor,
  type AcaoPlano,
  type AcaoStatus,
  type NovaAcaoInput,
} from "@/lib/domain/plano";
import { listarAcoes, criarAcao } from "@/lib/api/plano";
import { listarDiligencias } from "@/lib/api/diligencias";
import { listarUnidades } from "@/lib/api/admin";
import { useApiResource } from "@/lib/useApiResource";
import { setPrimaryAction } from "@/lib/primaryAction";
import { useRouter } from "next/navigation";
import { FileText, Upload } from "lucide-react";

export default function PlanoPage() {
  const { perfil } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dim, setDim] = useState("");
  const [st, setSt] = useState<AcaoStatus | "">("");
  const [mes, setMes] = useState("");
  const [setor, setSetor] = useState("");
  const [novaAberta, setNovaAberta] = useState(false);

  const acoesResource = useApiResource<AcaoPlano[]>("acoes", listarAcoes, []);
  const dilResource = useApiResource("diligencias", listarDiligencias, []);
  const unidadesResource = useApiResource("unidades", listarUnidades, []);
  const acoes = acoesResource.data;

  const isAdmin = perfil?.id === "ag" || perfil?.id === "sa";
  const isOp = perfil?.id === "op";

  useEffect(() => {
    if (!isAdmin) return;
    return setPrimaryAction(() => setNovaAberta(true));
  }, [isAdmin]);

  const setores = Array.from(new Set(acoes.map((a) => a.setor).filter(Boolean))).sort();
  const meses = Array.from(
    new Set(acoes.map((a) => a.prazo).filter((p) => p && p.length >= 7).map((p) => p.slice(5, 7))),
  ).sort();

  function criarAcoes(input: NovaAcaoInput): number {
    const unidades = unidadesResource.data;
    const unidadeIds = input.setores.map((s) => unidadePorSetor(s, unidades));
    criarAcao({
      requisito_cod: input.req,
      item: input.item,
      descricao_acao: input.objetivo,
      prazo: input.prazo,
      unidade_ids: unidadeIds,
    })
      .then(() => acoesResource.reload())
      .catch(() => {
        acoesResource.setData((prev) => [...prev, ...montarAcoes(input, prev, unidades)]);
        toast("API offline — ação adicionada localmente.", "warn");
      });
    return input.setores.length;
  }

  // unidade atual aproximada (usa mock)
  const unidadeAtual = isOp ? "un04" : null;

  const data = acoes.filter((a) => {
    if (isOp && unidadeAtual && a.unidadeId !== unidadeAtual) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!(a.req.toLowerCase().includes(s) || a.item.toLowerCase().includes(s) || a.acao.toLowerCase().includes(s) || a.idAcao.toLowerCase().includes(s))) return false;
    }
    if (dim) {
      const map: Record<string, string> = { CI: "3.1", GC: "3.2", EP: "3.3" };
      if (!a.req.startsWith(map[dim])) return false;
    }
    if (st) if (a.status !== st) return false;
    if (mes) if (!a.prazo || a.prazo.slice(5, 7) !== mes) return false;
    if (setor) if (a.setor !== setor) return false;
    return true;
  });

  const base = acoes.filter((a) => (isOp && unidadeAtual ? a.unidadeId === unidadeAtual : true));
  const k = {
    pend: base.filter((a) => a.status === "PENDENTE").length,
    env: base.filter((a) => a.status === "ENVIADO").length,
    dil: base.filter((a) => a.status === "DILIGÊNCIA").length,
    apr: base.filter((a) => a.status === "APROVADO").length,
  };
  const tot = base.length;
  const pct = tot ? Math.round((k.apr / tot) * 100) : 0;

  return (
    <div className="animate-fade-in">
      {acoesResource.offline ? (
        <Alert variant="warn" title="API indisponível — exibindo dados locais">
          Não foi possível conectar à API. As ações são exibidas do repositório local.
        </Alert>
      ) : null}

      <Alert
        variant="info"
        title={isOp ? "Exibindo apenas ações da sua unidade" : "Plano de Ação — Gestão integrada das comprovações"}
        action={
          isAdmin ? (
            <Button onClick={() => router.push("/progestao")} className="h-6 px-2 text-[10px]">
              <FileText className="size-3" />
              Diagnóstico
            </Button>
          ) : undefined
        }
      >
        Operador envia comprovações; Admin do Ente/Auditor avalia, aprova ou emite diligência.
      </Alert>

      <div className="mb-3 mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Kpi label="Pendentes/Vencidas" value={k.pend} tone="text-t2" delta={`${tot} ações`} />
        <Kpi label="Enviados/Em análise" value={k.env} tone="text-amb2" delta="aguardando análise" />
        <Kpi label="Diligências abertas" value={k.dil} tone="text-red2" />
        <Kpi label="Aprovados/Concluídos" value={k.apr} tone="text-grn2" delta={`${pct}% aprovado`} />
      </div>

      <Card className="mb-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar requisito, item ou ação..."
            className="w-64 rounded border border-brd2 bg-bg2 px-2.5 py-[5px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none"
          />
          <select value={dim} onChange={(e) => setDim(e.target.value)} className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none">
            <option value="">Todas as dimensões</option>
            <option value="CI">3.1 Controles Internos</option>
            <option value="GC">3.2 Governança Corporativa</option>
            <option value="EP">3.3 Educação Previdenciária</option>
          </select>
          <select value={st} onChange={(e) => setSt(e.target.value as AcaoStatus | "")} className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none">
            <option value="">Todos os status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="ENVIADO">Enviado</option>
            <option value="APROVADO">Aprovado</option>
            <option value="DILIGÊNCIA">Diligência</option>
          </select>
          <select value={mes} onChange={(e) => setMes(e.target.value)} className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none">
            <option value="">Todos os meses</option>
            {meses.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select value={setor} onChange={(e) => setSetor(e.target.value)} className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none">
            <option value="">Todos os setores</option>
            {setores.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="flex-1" />
          <Button variant="ghost">
            <Upload className="size-3.5" />
            Exportar
          </Button>
        </div>
      </Card>

      <AcoesTable acoes={data} isOp={isOp} unidadeAtual={unidadeAtual} diligencias={dilResource.data} />

      {novaAberta && isAdmin ? (
        <NovaAcaoModal
          onClose={() => setNovaAberta(false)}
          onCriar={criarAcoes}
        />
      ) : null}
    </div>
  );
}
