"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { ManuaisPanel } from "@/components/config/ManuaisPanel";
import { EnteForm } from "@/components/config/EnteForm";
import { UnidadesPanel } from "@/components/config/UnidadesPanel";
import { UsuariosPanel } from "@/components/config/UsuariosPanel";
import { cn } from "@/lib/cn";
import { PERFIS } from "@/lib/rbac";
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

const CERTS = [
  { nivel: "III", data: "01/06/2024", empresa: "IEPREV", status: "Expirada", validade: "01/06/2026" },
];

const TRILHA = [
  { dt: "09/09 14:22", ev: "Login realizado", user: "admin@fumpres.ba.gov.br" },
  { dt: "09/09 14:20", ev: "AC-004 aprovada pelo Auditor", user: "auditor@fumpres.ba.gov.br" },
  { dt: "09/09 10:05", ev: "Diligência D-003 emitida", user: "auditor@fumpres.ba.gov.br" },
  { dt: "08/09 16:30", ev: "Documento enviado para AC-033", user: "operador@fumpres.ba.gov.br" },
];

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
            <Card>
              <div className="mb-1 text-[12px] font-semibold text-t1">Histórico de Certificações</div>
              <div className="overflow-hidden rounded border border-brd">
                <div className="grid grid-cols-[80px_80px_1fr_100px_100px] border-b border-brd bg-bg2 text-[10px] text-t3">
                  <div className="px-2 py-1.5">Nível</div>
                  <div className="px-2 py-1.5">Data</div>
                  <div className="px-2 py-1.5">Empresa</div>
                  <div className="px-2 py-1.5">Status</div>
                  <div className="px-2 py-1.5">Validade</div>
                </div>
                {CERTS.map((c, i) => (
                  <div key={i} className="grid grid-cols-[80px_80px_1fr_100px_100px] border-b border-brd last:border-b-0 text-[11px] text-t2">
                    <div className="px-2 py-1.5">
                      <span className="rounded bg-grn3 px-1.5 py-0.5 text-[10px] font-bold text-grn2">{c.nivel}</span>
                    </div>
                    <div className="px-2 py-1.5">{c.data}</div>
                    <div className="px-2 py-1.5">{c.empresa}</div>
                    <div className="px-2 py-1.5">
                      <span className="rounded bg-bg3 px-1.5 py-0.5 text-[10px] font-bold text-t3">{c.status}</span>
                    </div>
                    <div className="px-2 py-1.5">{c.validade}</div>
                  </div>
                ))}
              </div>
            </Card>
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
