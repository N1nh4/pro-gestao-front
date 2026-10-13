"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { DOCS, DIM_LABEL, TIPO_TONE } from "@/lib/mock/docs";
import { Download, FileText, Filter, Upload } from "lucide-react";

function tipoIcon() {
  return <FileText className="size-4 text-t3" />;
}

export default function DocumentosPage() {
  const { perfil } = useAuth();
  const [search, setSearch] = useState("");
  const [dim, setDim] = useState<"CI" | "GC" | "EP" | "">("");
  const [req, setReq] = useState<string>("");

  const isAdmin = perfil?.id === "ag" || perfil?.id === "sa";

  const data = useMemo(() => {
    return DOCS.filter((d) => {
      if (dim && d.dim !== dim) return false;
      if (req && d.req !== req) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !d.titulo.toLowerCase().includes(s) &&
          !d.req.toLowerCase().includes(s) &&
          !d.reqNome.toLowerCase().includes(s) &&
          !d.acao.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [dim, req, search]);

  const reqs = useMemo(() => {
    const set = new Set<string>();
    DOCS.forEach((d) => set.add(d.req));
    return Array.from(set).sort();
  }, []);

  function limpar() {
    setSearch("");
    setDim("");
    setReq("");
  }

  return (
    <div className="animate-fade-in">
      <Alert
        variant="info"
        title="Biblioteca de Documentos Modelos — FUMPRES · Pró-Gestão v4.1"
        action={
          isAdmin ? (
            <Button variant="pri" className="h-6 px-2 text-[10px]">
              <Upload className="size-3" />
              Novo modelo
            </Button>
          ) : undefined
        }
      >
        Modelos padronizados por requisito. Filtre por dimensão/requisito e faça download (mock).
      </Alert>

      <Card className="mb-2.5 mt-2">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar documento, requisito ou ação..."
            className="min-w-64 flex-1 rounded border border-brd2 bg-bg2 px-2.5 py-[5px] text-[11px] text-t1 placeholder:text-t4 focus:outline-none"
          />
          <select
            value={dim}
            onChange={(e) => setDim(e.target.value as "CI" | "GC" | "EP" | "")}
            className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none"
          >
            <option value="">Todas as dimensões</option>
            <option value="CI">{DIM_LABEL.CI}</option>
            <option value="GC">{DIM_LABEL.GC}</option>
            <option value="EP">{DIM_LABEL.EP}</option>
          </select>
          <select
            value={req}
            onChange={(e) => setReq(e.target.value)}
            className="rounded border border-brd2 bg-bg2 px-2 py-[5px] text-[11px] text-t1 focus:outline-none"
          >
            <option value="">Todos os requisitos</option>
            {reqs.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <Button variant="ghost" onClick={limpar}>
            <Filter className="size-3.5" />
            Limpar
          </Button>
          <div className="flex-1" />
          <span className="text-[10px] text-t3">{data.length} modelo(s)</span>
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.id} className="rounded-md border border-brd bg-bg1 px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              {tipoIcon()}
              <span className="text-[12px] font-semibold text-t1">{d.titulo}</span>
              <span className={cn("rounded px-2 py-0.5 text-[9px] font-bold", TIPO_TONE[d.tipo])}>
                {d.tipo}
              </span>
              <span className="text-[9px] font-semibold text-t3">{d.versao}</span>
              <span className="text-[9px] text-t3">{d.req}</span>
              <div className="flex-1" />
              <Button variant="ghost" className="h-6 px-2 text-[10px]">
                <Download className="size-3" />
                Baixar
              </Button>
            </div>
            <div className="mt-1.5 text-[11px] leading-relaxed text-t2">{d.descricao}</div>
            <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] text-t3">
              <span>{DIM_LABEL[d.dim]}</span>
              <span>· {d.reqNome}</span>
              <span>· {d.acao}</span>
              <span>· Tags: {d.tags.join(", ")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
