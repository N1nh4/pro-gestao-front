"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { ManuaisPanel } from "@/components/config/ManuaisPanel";
import { EnteForm } from "@/components/config/EnteForm";
import { UnidadesPanel } from "@/components/config/UnidadesPanel";
import { UsuariosPanel } from "@/components/config/UsuariosPanel";
import { CertificacaoModal } from "@/components/certificacoes/CertificacaoModal";
import { cn } from "@/lib/cn";
import { PERFIS } from "@/lib/rbac";
import {
  atualizarCertificacao,
  criarCertificacao,
  listarCertificacoes,
  removerCertificacao,
  type CertificacaoPayload,
  type CertificacaoDto,
} from "@/lib/api/certificacoes";
import { useApiResource } from "@/lib/useApiResource";
import type { PerfilId } from "@/lib/types";
import { useToast } from "@/context/ToastContext";
import {
  BookOpen,
  CalendarClock,
  GraduationCap,
  Pencil,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
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

const STATUS_CERTIFICACAO: Record<string, string> = {
  VIGENTE: "bg-grn3 text-grn2",
  VENCIDA: "bg-red3 text-red2",
  REVOGADA: "bg-red3 text-red2",
  PENDENTE: "bg-amb3 text-amb2",
};

function formatarData(data: string | null) {
  if (!data) return "—";
  const parsed = new Date(`${data}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? data : parsed.toLocaleDateString("pt-BR");
}

function CertificacoesPanel({ podeEditar }: { podeEditar: boolean }) {
  const { toast } = useToast();
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<CertificacaoDto | null>(null);
  const resource = useApiResource<CertificacaoDto[]>(
    "config-certificacoes",
    listarCertificacoes,
    [],
  );
  const certificacoesOrdenadas = [...resource.data].sort((a, b) => {
    const dataA = a.criado_em ? Date.parse(a.criado_em) : 0;
    const dataB = b.criado_em ? Date.parse(b.criado_em) : 0;
    const diferenca =
      (Number.isNaN(dataB) ? 0 : dataB) - (Number.isNaN(dataA) ? 0 : dataA);
    return diferenca || b.id_certificacao - a.id_certificacao;
  });

  async function salvar(payload: CertificacaoPayload) {
    if (editando) {
      const salva = await atualizarCertificacao(editando.id_certificacao, payload);
      resource.setData((atuais) =>
        atuais.map((item) => (item.id_certificacao === salva.id_certificacao ? salva : item)),
      );
      toast("Certificação atualizada", "ok");
    } else {
      const criada = await criarCertificacao(payload);
      resource.setData((atuais) =>
        [criada, ...atuais.filter((item) => item.id_certificacao !== criada.id_certificacao)].sort(
          (a, b) =>
            (Date.parse(b.criado_em ?? "") || b.id_certificacao) -
            (Date.parse(a.criado_em ?? "") || a.id_certificacao),
        ),
      );
      toast("Certificação criada", "ok");
    }
  }

  async function remover(certificacao: CertificacaoDto) {
    if (!window.confirm(`Excluir a certificação "${certificacao.nome_certificacao}"?`)) return;
    try {
      await removerCertificacao(certificacao.id_certificacao);
      resource.reload();
      toast("Certificação removida", "ok");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Não foi possível remover a certificação",
        "err",
      );
    }
  }

  return (
    <>
      <Card>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-[12px] font-semibold text-t1">Certificações do Ente</div>
            <div className="text-[10px] text-t3">Gerencie certificados e acompanhe auditorias.</div>
          </div>
          {podeEditar ? (
            <button
              type="button"
              onClick={() => {
                setEditando(null);
                setModalAberto(true);
              }}
              className="inline-flex cursor-pointer items-center gap-1 rounded bg-acc px-2.5 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-acc2"
            >
              <Plus className="size-3" />
              Nova certificação
            </button>
          ) : null}
        </div>
        {resource.offline ? (
          <div className="mb-2 rounded border border-amb/20 bg-amb3 px-2 py-1.5 text-[10px] text-amb2">
            {resource.error ?? "Não foi possível carregar as certificações."}
          </div>
        ) : null}
        {resource.loading ? (
          <div className="py-4 text-center text-[11px] text-t3">Carregando certificações…</div>
        ) : certificacoesOrdenadas.length ? (
          <div className="overflow-x-auto rounded border border-brd">
            <div className="min-w-[670px]">
              <div className="grid grid-cols-[minmax(180px,1fr)_140px_100px_110px_90px_80px] border-b border-brd bg-bg2 text-[10px] text-t3">
                <div className="px-2 py-1.5">Certificação</div>
                <div className="px-2 py-1.5">Certificado</div>
                <div className="px-2 py-1.5">Status</div>
                <div className="px-2 py-1.5">Validade</div>
                <div className="px-2 py-1.5">Auditorias</div>
                <div className="px-2 py-1.5 text-right">Ações</div>
              </div>
              {certificacoesOrdenadas.map((certificacao) => (
                <div
                  key={certificacao.id_certificacao}
                  className="grid grid-cols-[minmax(180px,1fr)_140px_100px_110px_90px_80px] items-center border-b border-brd text-[11px] text-t2 last:border-b-0"
                >
                  <div className="truncate px-2 py-1.5 font-medium text-t1">
                    {certificacao.nome_certificacao}
                  </div>
                  <div className="truncate px-2 py-1.5">
                    {certificacao.numero_certificado || "—"}
                  </div>
                  <div className="px-2 py-1.5">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-bold",
                        STATUS_CERTIFICACAO[certificacao.status] ?? "bg-bg3 text-t3",
                      )}
                    >
                      {certificacao.status}
                    </span>
                  </div>
                  <div className="px-2 py-1.5">{formatarData(certificacao.data_validade)}</div>
                  <div className="px-2 py-1.5">{certificacao.auditorias_count}</div>
                  <div className="flex items-center justify-end gap-1 px-2 py-1">
                    {podeEditar ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setEditando(certificacao);
                            setModalAberto(true);
                          }}
                          title="Editar certificação"
                          aria-label={`Editar certificação ${certificacao.nome_certificacao}`}
                          className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remover(certificacao)}
                          title="Excluir certificação"
                          aria-label={`Excluir certificação ${certificacao.nome_certificacao}`}
                          className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-red3 hover:text-red2"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-[11px] text-t3">
            Nenhuma certificação cadastrada.
          </div>
        )}
      </Card>
      {modalAberto ? (
        <CertificacaoModal
          certificacao={editando}
          onClose={() => setModalAberto(false)}
          onSalvar={salvar}
        />
      ) : null}
    </>
  );
}

export default function ConfigPageClient({ requestedTab }: { requestedTab?: string }) {
  const { perfil } = useAuth();
  const isAdminEnte = perfil?.id === "ag" || perfil?.id === "sa";
  const podeEditar = isAdminEnte;
  const visiveis = (perfil?.cfgTabs ?? ABAS).filter((t) => TABS[t]);
  const [tab, setTab] = useState(
    requestedTab && visiveis.includes(requestedTab) ? requestedTab : (visiveis[0] ?? "manuais"),
  );

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
            <CertificacoesPanel podeEditar={podeEditar} />
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
