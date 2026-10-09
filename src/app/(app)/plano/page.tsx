"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Kpi } from "@/components/ui/Kpi";
import { AcoesTable } from "@/components/plano/AcoesTable";
import { ACOES, setoresUnicos, mesesUnicosPrazo, contarPorStatus, type AcaoStatus } from "@/lib/mock/plano";
import { useRouter } from "next/navigation";
import { FileText, Upload } from "lucide-react";

export default function PlanoPage() {
  const { perfil } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dim, setDim] = useState("");
  const [st, setSt] = useState<AcaoStatus | "">("");
  const [mes, setMes] = useState("");
  const [setor, setSetor] = useState("");

  const isAdmin = perfil?.id === "ag" || perfil?.id === "sa";
  const isOp = perfil?.id === "op";

  // unidade atual aproximada (usa mock)
  const unidadeAtual = isOp ? (perfil?.id === "op" ? "un04" : null) : null;

  const data = ACOES.filter((a) => {
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

  const k = contarPorStatus((a) => (isOp && unidadeAtual ? a.unidadeId === unidadeAtual : true));
  const tot = (isOp && unidadeAtual ? ACOES.filter((a) => a.unidadeId === unidadeAtual).length : ACOES.length);
  const pct = tot ? Math.round((k.apr / tot) * 100) : 0;

  return (
    <div className="animate-fade-in">
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
            {mesesUnicosPrazo().map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select value={setor} onChange={(e) => setSetor(e.target.value)} className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none">
            <option value="">Todos os setores</option>
            {setoresUnicos().map((s) => (
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

      <AcoesTable acoes={data} isOp={isOp} unidadeAtual={unidadeAtual} />
    </div>
  );
}
