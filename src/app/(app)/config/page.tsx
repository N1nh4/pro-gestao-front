"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { ManuaisPanel } from "@/components/config/ManuaisPanel";
import { EnteForm } from "@/components/config/EnteForm";
import { UnidadesPanel } from "@/components/config/UnidadesPanel";
import { UsuariosPanel } from "@/components/config/UsuariosPanel";
import { cn } from "@/lib/cn";
import { PERFIS } from "@/lib/rbac";
import {
  listarCertificacoes,
  type CertificacaoDto,
} from "@/lib/api/certificacoes";
import { useApiResource } from "@/lib/useApiResource";
import type { PerfilId } from "@/lib/types";
import {
  BookOpen,
  CalendarClock,
  GraduationCap,
  Settings,
  ShieldCheck,
  Users,
  UserCheck,
} from "lucide-react";

const TABS: Record<string, string> = {
  manuais: "Manuais",
  perfis: "Perfis",
  ente: "Ente",
  unidades: "Unidades",
  certificacoes: "Certificações",
  usuarios: "Usuários",
  trilha: "Trilha de Capacitação",
};

const TAB_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  manuais: BookOpen,
  perfis: UserCheck,
  ente: Settings,
  unidades: Users,
  certificacoes: ShieldCheck,
  usuarios: Users,
  trilha: GraduationCap,
};

const ABAS: string[] = [
  "manuais",
  "perfis",
  "ente",
  "unidades",
  "certificacoes",
  "usuarios",
  "trilha",
];

const TRILHA = [
  { dt: "09/09 14:22", ev: "Login realizado", user: "admin@fumpres.ba.gov.br" },
  { dt: "09/09 14:20", ev: "AC-004 aprovada pelo Auditor", user: "auditor@fumpres.ba.gov.br" },
  { dt: "09/09 10:05", ev: "Diligência D-003 emitida", user: "auditor@fumpres.ba.gov.br" },
  { dt: "08/09 16:30", ev: "Documento enviado para AC-033", user: "operador@fumpres.ba.gov.br" },
];

function CertificacoesPanel() {
  const { data, loading, offline } = useApiResource<CertificacaoDto[]>(
    "config-certificacoes",
    listarCertificacoes,
    [],
  );

  return (
    <Card>
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="text-[12px] font-semibold text-t1">Certificações do Ente</div>
        <Link href="/certificacoes" className="text-[10px] font-semibold text-acc2 hover:underline">
          Gerenciar
        </Link>
      </div>
      {loading ? (
        <div className="py-4 text-center text-[11px] text-t3">Carregando certificações…</div>
      ) : offline ? (
        <div className="py-4 text-center text-[11px] text-t3">
          Não foi possível carregar as certificações.
        </div>
      ) : data.length ? (
        <div className="overflow-hidden rounded border border-brd">
          <div className="grid grid-cols-[1fr_140px_90px_100px_90px] border-b border-brd bg-bg2 text-[10px] text-t3">
            <div className="px-2 py-1.5">Certificação</div>
            <div className="px-2 py-1.5">Certificado</div>
            <div className="px-2 py-1.5">Status</div>
            <div className="px-2 py-1.5">Validade</div>
            <div className="px-2 py-1.5">Auditorias</div>
          </div>
          {data.map((c) => (
            <div
              key={c.id_certificacao}
              className="grid grid-cols-[1fr_140px_90px_100px_90px] border-b border-brd text-[11px] text-t2 last:border-b-0"
            >
              <div className="truncate px-2 py-1.5 font-medium text-t1">{c.nome_certificacao}</div>
              <div className="truncate px-2 py-1.5">{c.numero_certificado || "—"}</div>
              <div className="px-2 py-1.5">
                <span className="rounded bg-bg3 px-1.5 py-0.5 text-[10px] font-bold text-t3">
                  {c.status}
                </span>
              </div>
              <div className="px-2 py-1.5">{c.data_validade || "—"}</div>
              <div className="px-2 py-1.5">{c.auditorias_count}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-[11px] text-t3">
          Nenhuma certificação cadastrada.
        </div>
      )}
    </Card>
  );
}

export default function ConfigPage() {
  const { perfil } = useAuth();
  const isAdminEnte = perfil?.id === "ag" || perfil?.id === "sa";
  const podeEditar = isAdminEnte;
  const visiveis = (perfil?.cfgTabs ?? ABAS).filter((t) => TABS[t]);
  const [tab, setTab] = useState(visiveis[0] ?? "manuais");

  return (
    <div className="animate-fade-in">
      <div className="grid min-h-[520px] grid-cols-[175px_1fr] overflow-hidden rounded-md border border-brd bg-bg1">
        <aside className="border-r border-brd">
          <nav className="flex flex-col py-1">
            {visiveis.map((id) => {
              const Icon = TAB_ICON[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-[11px] transition-colors",
                    tab === id ? "bg-bg3 text-t1" : "text-t2 hover:bg-bg2 hover:text-t1",
                  )}
                >
                  {Icon ? <Icon className="size-3.5" /> : null}
                  {TABS[id]}
                </button>
              );
            })}
          </nav>
        </aside>
        <section className="p-4">
          {tab === "manuais" ? (
            <ManuaisPanel podeEditar={podeEditar} />
          ) : tab === "perfis" ? (
            <Card>
              <div className="mb-1 text-[12px] font-semibold text-t1">Perfis de Acesso</div>
              <div className="mb-2 text-[10px] text-t3">
                Definição de perfis e permissões (baseado em RBAC atual).
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {(Object.keys(PERFIS) as PerfilId[]).map((pid) => (
                  <div key={pid} className="rounded border border-brd bg-bg2 px-2 py-1.5">
                    <div className="font-semibold text-t1">{PERFIS[pid].label}</div>
                    <div className="text-t3">{PERFIS[pid].nav.join(", ")}</div>
                  </div>
                ))}
              </div>
            </Card>
          ) : tab === "ente" ? (
            <EnteForm podeEditar={isAdminEnte} />
          ) : tab === "unidades" ? (
            <UnidadesPanel podeEditar={podeEditar} />
          ) : tab === "certificacoes" ? (
            <CertificacoesPanel />
          ) : tab === "usuarios" ? (
            <UsuariosPanel podeEditar={podeEditar} />
          ) : tab === "trilha" ? (
            <Card>
              <div className="mb-1 text-[12px] font-semibold text-t1">Trilha de Auditoria</div>
              <div className="flex flex-col text-[11px]">
                {TRILHA.map((r, i) => (
                  <div key={i} className={cn("flex gap-3 border-b border-brd px-2 py-1.5 last:border-b-0", i % 2 === 0 ? "bg-bg2/40" : "")}>
                    <span className="w-[90px] shrink-0 text-t3">
                      <CalendarClock className="mr-1 inline size-3" />
                      {r.dt}
                    </span>
                    <span className="flex-1 text-t1">{r.ev}</span>
                    <span className="text-t3">{r.user}</span>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
        </section>
      </div>
    </div>
  );
}
