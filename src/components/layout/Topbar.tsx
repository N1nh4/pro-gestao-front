"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Moon, Plus, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "./notifications";
import { cn } from "@/lib/cn";

interface TopbarProps {
  title: string;
  primaryLabel?: string;
}

function initials(nome: string): string {
  return nome
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Topbar({ title, primaryLabel }: TopbarProps) {
  const { perfil } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const openNotifications = useNotifications();
  const [userOpen, setUserOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!cardRef.current?.contains(event.target as Node)) setUserOpen(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <header className="flex shrink-0 items-center gap-2 border-b border-brd bg-bg1 px-4 py-[7px]">
      <div className="flex-1 text-[13px] font-bold text-t1">{title}</div>

      <div className="flex gap-0.5 rounded border border-brd2 bg-bg2 p-0.5">
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={cn(
            "flex cursor-pointer items-center gap-1 rounded-sm px-[7px] py-[3px] text-[10px] font-medium transition-colors",
            theme === "dark" ? "bg-bg4 text-t1" : "text-t3 hover:text-t1",
          )}
        >
          <Moon className="size-3" /> Escuro
        </button>
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={cn(
            "flex cursor-pointer items-center gap-1 rounded-sm px-[7px] py-[3px] text-[10px] font-medium transition-colors",
            theme === "light" ? "bg-bg4 text-t1" : "text-t3 hover:text-t1",
          )}
        >
          <Sun className="size-3" /> Claro
        </button>
      </div>

      <button
        type="button"
        onClick={openNotifications}
        className="relative cursor-pointer rounded-md border border-brd2 bg-bg2 p-[5px] text-t2 transition-colors hover:bg-bg3 hover:text-t1"
        title="Notificações"
      >
        <Bell className="size-4" />
        <span className="absolute -right-[3px] -top-[3px] flex size-[13px] items-center justify-center rounded-full bg-red text-[8px] font-bold text-white">
          5
        </span>
      </button>

      {perfil ? (
        <div ref={cardRef} className="relative">
          <button
            type="button"
            onClick={() => setUserOpen((open) => !open)}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-brd2 bg-bg2 py-[3px] pl-[3px] pr-2 transition-colors hover:bg-bg3"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-acc text-[9px] font-bold text-white">
              {initials(perfil.nome)}
            </span>
            <span className="text-left leading-tight">
              <span className="block text-[10px] font-semibold text-t1">{perfil.nome}</span>
              <span className="block text-[9px] text-t3">{perfil.setor ?? perfil.label}</span>
            </span>
            <ChevronDown className="size-3 text-t3" />
          </button>

          {userOpen ? (
            <div className="animate-fade-in absolute right-0 top-[calc(100%+6px)] z-50 w-60 rounded-md border border-brd bg-bg1 p-0 shadow-xl shadow-black/40">
              <div className="border-b border-brd px-3 py-2">
                <div className="text-[11px] font-bold text-t1">{perfil.nome}</div>
                <div className="text-[9px] text-t3">{perfil.email}</div>
              </div>
              <div className="p-2 text-[10px]">
                <Row label="Acessos hoje" value="1" />
                <Row label="Perfil ativo" value={perfil.label} />
                <Row label="Unidade" value={perfil.setor ?? "—"} />
                <Row label="Último acesso" value="Hoje, 09:12" />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {primaryLabel ? (
        <Button
          variant="pri"
          icon={<Plus className="size-3.5" />}
          onClick={() => toast(`${primaryLabel} — em breve.`, "info")}
        >
          {primaryLabel}
        </Button>
      ) : null}
    </header>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-brd/60 py-1.5 last:border-0">
      <span className="text-t3">{label}</span>
      <strong className="font-semibold text-t1">{value}</strong>
    </div>
  );
}
