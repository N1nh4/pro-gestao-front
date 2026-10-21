import {
  Award,
  ChartColumn,
  FileText,
  ListChecks,
  MessagesSquare,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

/** Mapeia a chave definida em rbac.NAV_DEF para o ícone Lucide correspondente. */
export const NAV_ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  "list-checks": ListChecks,
  "messages-square": MessagesSquare,
  "shield-check": ShieldCheck,
  award: Award,
  "bar-chart-3": ChartColumn,
  "file-text": FileText,
  settings: Settings,
  "sliders-horizontal": SlidersHorizontal,
};
