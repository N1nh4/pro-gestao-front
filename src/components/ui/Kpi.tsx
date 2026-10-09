import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface KpiProps {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  icon?: ReactNode;
  /** Cor do valor/rótulo (ex.: "text-grn2"). */
  tone?: string;
  /** Cor do delta (ex.: "text-red2"). */
  deltaTone?: string;
  /** Percentual (0–100) para exibir barra de progresso. */
  bar?: number;
  className?: string;
  onClick?: () => void;
}

export function Kpi({ label, value, delta, icon, tone, deltaTone, bar, className, onClick }: KpiProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "rounded-md border border-brd bg-bg1 p-3 transition-colors",
        onClick && "cursor-pointer hover:border-brd2 hover:bg-bg2",
        className,
      )}
    >
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] text-t3">
        {icon}
        {label}
      </div>
      <div className={cn("mb-0.5 text-xl font-extrabold leading-none", tone ?? "text-t1")}>{value}</div>
      {delta ? <div className={cn("text-[10px] font-semibold text-t3", deltaTone)}>{delta}</div> : null}
      {typeof bar === "number" ? (
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-bg4">
          <div className="h-full rounded-full bg-acc" style={{ width: `${bar}%` }} />
        </div>
      ) : null}
    </div>
  );
}
