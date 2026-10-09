import {
  ChartColumn,
  FileText,
  LayoutDashboard,
  ListChecks,
  MessagesSquare,
  Settings,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

/** Mapeia a chave definida em rbac.NAV_DEF para o ícone Lucide correspondente. */
export const NAV_ICONS: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  stethoscope: Stethoscope,
  "list-checks": ListChecks,
  "messages-square": MessagesSquare,
  "shield-check": ShieldCheck,
  "bar-chart-3": ChartColumn,
  "file-text": FileText,
  settings: Settings,
};
