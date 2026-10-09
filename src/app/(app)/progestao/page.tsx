"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Download, FileText } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Kpi } from "@/components/ui/Kpi";
import { RequisitoRow } from "@/components/progestao/RequisitoRow";
import { useAuth } from "@/context/AuthContext";
import { ACOES, acoesAprovadas } from "@/lib/mock/acoes";
import { temDiligenciaAberta } from "@/lib/mock/diligencias";
import { REQUISITOS, nivelEstimado, type DimensaoId, type NivelPG } from "@/lib/mock/progestao";

export default function ProgestaoPage() {
  const { perfil } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dim, setDim] = useState<"" | DimensaoId>("");
  const [status, setStatus] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const isAdmin = perfil?.id === "ag" || perfil?.id === "sa";
  const nivelPret: NivelPG = "IV";

  const data = REQUISITOS.filter((r) => {
    if (dim && r.dim !== dim) return false;
    if (status) {
      const acoes = ACOES.filter((a) => a.req === r.cod);
      const apr = acoes.filter((a) => a.status === "APROVADO").length;
      const tot = acoes.length;
      const pct = tot ? Math.round((apr / tot) * 100) : 0;
      if (status === "ok" && pct !== 100) return false;
      if (status === "parcial" && !(pct > 0 && pct < 100)) return false;
      if (status === "nao" && pct !== 0) return false;
      if (status === "dil") {
        const ids = acoes.map((a) => a.idAcao);
        if (!temDiligenciaAberta(ids)) return false;
      }
    }
    if (search) {
      const s = search.toLowerCase();
      if (!(r.cod.toLowerCase().includes(s) || r.desc.toLowerCase().includes(s) || r.resp.toLowerCase().includes(s))) {
        return false;
      }
    }
    return true;
  });

  const tot = REQUISITOS.length;
  const ok = dataOk(100).length;
  const parc = dataOkRange(1, 99).length;
  const zero = dataOk(0).length;

  const totAcoes = ACOES.length;
  const totApr = acoesAprovadas();
  const pctGeral = totAcoes ? Math.round((totApr / totAcoes) * 100) : 0;
  const nivelEst = nivelEstimado(totApr);

  function dataOk(p: number) {
    return REQUISITOS.filter((r) => {
      const acoes = ACOES.filter((a) => a.req === r.cod);
      const apr = acoes.filter((a) => a.status === "APROVADO").length;
      const pct = acoes.length ? Math.round((apr / acoes.length) * 100) : 0;
      return pct === p;
    });
  }

  function dataOkRange(min: number, max: number) {
    return REQUISITOS.filter((r) => {
      const acoes = ACOES.filter((a) => a.req === r.cod);
      const apr = acoes.filter((a) => a.status === "APROVADO").length;
      const pct = acoes.length ? Math.round((apr / acoes.length) * 100) : 0;
      return pct > min && pct < max;
    });
  }

  function toggle(cod: string) {
    setExpanded((e) => ({ ...e, [cod]: !e[cod] }));
  }

  return (
    <div className="animate-fade-in">
      <Alert
        variant="info"
        title={`Diagnóstico — Alimentado pelo Plano de Ação · Nível pretendido: ${nivelPret}`}
        action={
          isAdmin ? (
            <Button onClick={() => router.push("/plano")} className="h-6 px-2 text-[10px]">
              <FileText className="size-3" />
              Plano de Ação
            </Button>
          ) : undefined
        }
      >
        Clique em qualquer requisito para ver os itens exigidos e o status das comprovações. Para enviar comprovações acesse o{" "}
        <strong className="text-t1">Plano de Ação</strong>.
      </Alert>

      <div className="mb-3 mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Kpi
          label="Concluídos"
          value={ok}
          tone="text-grn2"
          delta={`de ${tot} requisitos`}
          icon={<Building2 className="size-3.5 text-grn2" />}
          onClick={() => setStatus((prev) => (prev === "ok" ? "" : "ok"))}
        />
        <Kpi
          label="Em andamento"
          value={parc}
          tone="text-amb2"
          delta="parcialmente"
          icon={<Building2 className="size-3.5 text-amb2" />}
          onClick={() => setStatus((prev) => (prev === "parcial" ? "" : "parcial"))}
        />
        <Kpi
          label="Não iniciados"
          value={zero}
          tone="text-red2"
          delta="requisitos"
          icon={<Building2 className="size-3.5 text-red2" />}
          onClick={() => setStatus((prev) => (prev === "nao" ? "" : "nao"))}
        />
        <Kpi
          label="Nível Estimado"
          value={nivelEst}
          tone="text-prp2"
          delta={`${totApr}/${totAcoes} ações · ${pctGeral}%`}
          icon={<Building2 className="size-3.5 text-prp2" />}
        />
      </div>

      <Card className="mb-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar requisito..."
            className="w-56 rounded border border-brd2 bg-bg2 px-2.5 py-[5px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none"
          />
          <select
            value={dim}
            onChange={(e) => setDim(e.target.value as "" | DimensaoId)}
            className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none"
          >
            <option value="">Todas as dimensões</option>
            <option value="CI">3.1 Controles Internos</option>
            <option value="GC">3.2 Governança Corporativa</option>
            <option value="EP">3.3 Educação Previdenciária</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none"
          >
            <option value="">Todos os status</option>
            <option value="atendido">Atendido</option>
            <option value="parcial">Parcial</option>
            <option value="nao">Não atendido</option>
            <option value="dil">Com diligências</option>
          </select>
          <div className="flex-1" />
          <Button variant="ghost" onClick={() => toast("Exportando diagnóstico PDF...")}>
            <Download className="size-3.5" />
            PDF
          </Button>
        </div>
      </Card>

      <div>
        {data.map((r) => (
          <RequisitoRow
            key={r.cod}
            requisito={r}
            nivelPret={nivelPret}
            isAdmin={isAdmin}
            expanded={!!expanded[r.cod]}
            onToggle={() => toggle(r.cod)}
          />
        ))}
      </div>
    </div>
  );
}

/** Pequena util para manter compatibilidade com o botão "PDF" simples. */
function toast(msg: string) {
  if (typeof window !== "undefined") {
    try {
      const w = window as unknown as { toast?: (m: string, t?: string) => void };
      w.toast?.(msg, "info");
    } catch {
      // ignora
    }
  }
}
