/** Identificadores dos perfis hierárquicos (mock, espelha o SPA original). */
export type PerfilId = "sa" | "ag" | "op" | "lv";

/** Identificadores das telas/rotas do sistema. */
export type NavId =
  | "painel"
  | "progestao"
  | "plano"
  | "diligencias"
  | "certificacao"
  | "bi"
  | "documentos"
  | "config";

export interface Perfil {
  id: PerfilId;
  nome: string;
  email: string;
  label: string;
  /** Classe de badge (cores) usada no rodapé do usuário. */
  badgeClass: string;
  setor: string | null;
  nav: NavId[];
  cfgTabs: string[];
}

export interface NavDef {
  label: string;
  /** Chave do ícone Lucide — resolvida em components/layout/Sidebar. */
  icon: string;
  badge?: number;
}

export interface Credencial {
  /** Emoji exibido no botão de quick-login. */
  emoji: string;
  label: string;
  email: string;
  perfil: PerfilId;
}

/** Usuário autenticado em memória/localStorage. */
export interface SessionUser {
  perfil: PerfilId;
  nome: string;
  email: string;
}
