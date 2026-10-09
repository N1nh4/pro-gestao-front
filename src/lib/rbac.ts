import type { Credencial, NavDef, NavId, Perfil, PerfilId } from "./types";

/* ==========================================================================
   RBAC (mock) — fonte única de perfis, navegação e permissões.
   Substitui os dois modelos desconectados do SPA original
   (PERFIS.nav e PERFIS_ACESSO/PERFIL_PAGINAS).
   ========================================================================== */

export const PERFIS: Record<PerfilId, Perfil> = {
  sa: {
    id: "sa",
    nome: "Felipe Araújo",
    email: "admin@fumpres.ba.gov.br",
    label: "Admin Master",
    badgeClass: "bg-red/15 text-red2",
    setor: "TODOS",
    nav: [
      "painel",
      "progestao",
      "plano",
      "diligencias",
      "certificacao",
      "bi",
      "documentos",
      "config",
    ],
    cfgTabs: ["manuais", "perfis", "ente", "unidades", "certificacoes", "usuarios", "trilha"],
  },
  ag: {
    id: "ag",
    nome: "João Silva",
    email: "auditor@fumpres.ba.gov.br",
    label: "Admin do Ente",
    badgeClass: "bg-acc3 text-acc2",
    setor: "TODOS",
    nav: ["painel", "progestao", "plano", "diligencias", "certificacao", "bi", "documentos", "config"],
    cfgTabs: ["ente", "unidades", "certificacoes", "usuarios"],
  },
  op: {
    id: "op",
    nome: "Maria Costa",
    email: "operador@fumpres.ba.gov.br",
    label: "Operacional",
    badgeClass: "bg-amb3 text-amb2",
    setor: "GEFIN",
    nav: ["painel", "progestao", "plano", "diligencias", "documentos"],
    cfgTabs: [],
  },
  lv: {
    id: "lv",
    nome: "Pedro Lima",
    email: "viewer@previc.gov.br",
    label: "Leitura",
    badgeClass: "bg-bg3 text-t3",
    setor: null,
    nav: ["painel", "progestao", "diligencias", "certificacao", "bi", "documentos"],
    cfgTabs: [],
  },
};

/** Ordem canônica de exibição no sidebar. */
export const NAV_ORDER: NavId[] = [
  "painel",
  "progestao",
  "plano",
  "diligencias",
  "certificacao",
  "bi",
  "documentos",
  "config",
];

export const NAV_DEF: Record<NavId, NavDef> = {
  painel: { label: "Painel Executivo", icon: "layout-dashboard" },
  progestao: { label: "Diagnóstico", icon: "stethoscope" },
  plano: { label: "Plano de Ação", icon: "list-checks", badge: 5 },
  diligencias: { label: "Diligências", icon: "messages-square", badge: 2 },
  certificacao: { label: "Auditoria", icon: "shield-check" },
  bi: { label: "Painel Analítico", icon: "bar-chart-3" },
  documentos: { label: "Doc. Modelos", icon: "file-text" },
  config: { label: "Configurações", icon: "settings" },
};

/** Títulos usados na topbar (inclui telas ainda não migradas). */
export const TITLES: Record<string, string> = {
  painel: "Painel Executivo",
  progestao: "Diagnóstico",
  plano: "Plano de Ação",
  diligencias: "Diligências",
  certificacao: "Auditoria",
  bi: "Painel Analítico (BI)",
  documentos: "Documentos Modelos",
  config: "Configurações",
};

/** Rótulo do botão de ação primária por tela. */
export const PRIMARY_ACTIONS: Record<string, string> = {
  plano: "Nova ação",
};

const CRED_MAP: Record<string, { pwd: string; perfil: PerfilId }> = {
  "admin@fumpres.ba.gov.br": { pwd: "Demo@2026!", perfil: "sa" },
  "felipe.lisa": { pwd: "Demo@2026!", perfil: "sa" },
  "auditor@fumpres.ba.gov.br": { pwd: "Demo@2026!", perfil: "ag" },
  "joao.silva": { pwd: "Demo@2026!", perfil: "ag" },
  "operador@fumpres.ba.gov.br": { pwd: "Demo@2026!", perfil: "op" },
  "maria.costa": { pwd: "Demo@2026!", perfil: "op" },
  "viewer@previc.gov.br": { pwd: "Demo@2026!", perfil: "lv" },
  "pedro.lima": { pwd: "Demo@2026!", perfil: "lv" },
};

/** Atalhos exibidos no card de credenciais demo da tela de login. */
export const DEMO_CREDENTIALS: Credencial[] = [
  { emoji: "👑", label: "Admin Master", email: "admin@fumpres.ba.gov.br", perfil: "sa" },
  { emoji: "⚙️", label: "Admin do Ente", email: "auditor@fumpres.ba.gov.br", perfil: "ag" },
  { emoji: "📁", label: "Operacional", email: "operador@fumpres.ba.gov.br", perfil: "op" },
  { emoji: "👁", label: "Leitura", email: "viewer@previc.gov.br", perfil: "lv" },
];

export const SENHA_DEMO = "Demo@2026!";

/** Autenticação mock: valida usuário/senha contra CRED_MAP. */
export function autenticar(
  email: string,
  senha: string,
): Perfil | null {
  const cred = CRED_MAP[email.trim().toLowerCase()];
  if (!cred || cred.pwd !== senha) return null;
  return PERFIS[cred.perfil];
}

export function getPerfil(id: PerfilId): Perfil {
  return PERFIS[id];
}

export function pathForNav(id: NavId): string {
  return `/${id}`;
}

export function podeAcessar(perfil: Perfil, nav: string): boolean {
  return perfil.nav.includes(nav as NavId);
}
