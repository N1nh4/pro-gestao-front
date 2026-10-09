"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

export type ToastKind = "ok" | "info" | "warn" | "err";

interface ToastItem {
  id: number;
  msg: string;
  kind: ToastKind;
}

interface ToastContextValue {
  toast: (msg: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const STYLES: Record<ToastKind, { border: string; icon: string; Icon: typeof Info }> = {
  ok: { border: "border-l-grn", icon: "text-grn2", Icon: CircleCheck },
  info: { border: "border-l-acc2", icon: "text-acc2", Icon: Info },
  warn: { border: "border-l-amb", icon: "text-amb2", Icon: TriangleAlert },
  err: { border: "border-l-red", icon: "text-red2", Icon: CircleX },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((msg: string, kind: ToastKind = "info") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, msg, kind }]);
    setTimeout(() => setItems((prev) => prev.filter((item) => item.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[300] flex w-80 flex-col gap-2">
        {items.map((item) => {
          const { border, icon, Icon } = STYLES[item.kind];
          return (
            <div
              key={item.id}
              className={cn(
                "animate-fade-in pointer-events-auto flex items-start gap-2 rounded-md border border-brd border-l-[3px] bg-bg1 px-3 py-2.5 text-xs text-t1 shadow-lg shadow-black/40",
                border,
              )}
            >
              <Icon className={cn("mt-0.5 size-4 shrink-0", icon)} />
              <span className="leading-relaxed">{item.msg}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider>");
  return ctx;
}
