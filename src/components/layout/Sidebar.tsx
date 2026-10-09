"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/cn";
import { NAV_DEF, pathForNav } from "@/lib/rbac";
import { NAV_ICONS } from "./nav-icons";

function initials(nome: string): string {
  return nome
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Sidebar() {
  const { perfil, logout } = useAuth();
  const pathname = usePathname();
  if (!perfil) return null;

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col overflow-hidden border-r border-brd bg-bg1">
      <div className="flex items-center gap-2 border-b border-brd px-3 pb-2.5 pt-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded bg-acc text-[10px] font-bold text-white">
          SAC
        </div>
        <div className="min-w-0">
          <strong className="block text-[11px] font-bold text-t1">Pró-Gestão RPPS</strong>
          <span className="text-[9px] text-t3">v4.1 · Enterprise</span>
        </div>
      </div>

      <div className="mx-[9px] mt-2 flex items-center gap-1.5 rounded border border-brd bg-bg2 px-2.5 py-1.5">
        <span className="size-1.5 shrink-0 rounded-full bg-grn" />
        <div>
          <div className="text-[11px] font-semibold text-t1">FUMPRES</div>
          <div className="text-[9px] text-t3">Salvador · BA · Nível IV</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-1">
        {perfil.nav.map((id) => {
          const def = NAV_DEF[id];
          const Icon = NAV_ICONS[def.icon];
          const href = pathForNav(id);
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={id}
              href={href}
              className={cn(
                "mx-[5px] my-px flex items-center gap-[7px] rounded border border-transparent px-2 py-1.5 text-[11px] font-medium text-t2 transition-colors hover:bg-bg3 hover:text-t1",
                active && "border-acc/20 bg-acc3 text-acc2",
              )}
            >
              {Icon ? <Icon className="size-[14px] shrink-0" /> : null}
              {def.label}
              {def.badge ? (
                <span
                  className={cn(
                    "ml-auto rounded px-1.5 py-px text-[8px] font-bold",
                    id === "diligencias" ? "bg-red text-white" : "bg-red text-white",
                  )}
                >
                  {def.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brd p-2">
        <div className="flex items-center gap-1.5 rounded px-1.5 py-1.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-acc text-[9px] font-bold text-white">
            {initials(perfil.nome)}
          </div>
          <div className="min-w-0 flex-1">
            <strong className="block truncate text-[11px] text-t1">{perfil.nome}</strong>
            <span className="block truncate text-[9px] text-t3">{perfil.label}</span>
          </div>
          <button
            type="button"
            onClick={logout}
            title="Sair"
            className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-bg3 hover:text-red2"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
