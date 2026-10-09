"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface DrawerConfig {
  title: string;
  sub?: string;
  /** Conteúdo do corpo (geralmente um componente). */
  body: ReactNode;
  /** Ações fixas no rodapé. */
  footer?: ReactNode;
}

interface DrawerContextValue {
  openDrawer: (config: DrawerConfig) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<DrawerConfig | null>(null);
  const [open, setOpen] = useState(false);

  const openDrawer = useCallback((next: DrawerConfig) => {
    setConfig(next);
    setOpen(true);
  }, []);

  const closeDrawer = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      <div
        className={cn(
          "fixed inset-0 z-[250] transition-opacity duration-200",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-black/55" onClick={closeDrawer} />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label={config?.title}
          className={cn(
            "absolute right-0 top-0 flex h-full w-[460px] max-w-[92vw] flex-col border-l border-brd bg-bg1 shadow-2xl shadow-black/50 transition-transform duration-200",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <header className="flex items-start gap-2 border-b border-brd px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-bold text-t1">{config?.title}</div>
              {config?.sub ? (
                <div className="mt-0.5 truncate text-[10px] text-t3">{config.sub}</div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              title="Fechar"
              className="cursor-pointer rounded p-1 text-t3 transition-colors hover:bg-bg3 hover:text-t1"
            >
              <X className="size-4" />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto px-4 py-3">{config?.body}</div>
          {config?.footer ? (
            <footer className="flex justify-end gap-2 border-t border-brd px-4 py-3">
              {config.footer}
            </footer>
          ) : null}
        </aside>
      </div>
    </DrawerContext.Provider>
  );
}

export function useDrawer(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer deve ser usado dentro de <DrawerProvider>");
  return ctx;
}
