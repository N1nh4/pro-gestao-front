import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AlertVariant = "info" | "ok" | "warn" | "crit";

interface AlertProps {
  variant?: AlertVariant;
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const VARIANT: Record<AlertVariant, { box: string; dot: string }> = {
  info: { box: "bg-[rgba(26,86,196,0.05)] border-[rgba(26,86,196,0.2)]", dot: "bg-acc" },
  ok: { box: "bg-[rgba(28,138,67,0.05)] border-[rgba(28,138,67,0.2)]", dot: "bg-grn" },
  warn: { box: "bg-[rgba(182,112,10,0.05)] border-[rgba(182,112,10,0.2)]", dot: "bg-amb" },
  crit: { box: "bg-[rgba(184,44,44,0.05)] border-[rgba(184,44,44,0.2)]", dot: "bg-red" },
};

export function Alert({ variant = "info", title, children, action, className }: AlertProps) {
  const v = VARIANT[variant];
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border px-3 py-[9px]",
        v.box,
        className,
      )}
    >
      <span className={cn("mt-1 size-1.5 shrink-0 rounded-full", v.dot)} />
      <div className="min-w-0 flex-1">
        {title ? <div className="text-[11px] font-semibold text-t1">{title}</div> : null}
        {children ? <div className="mt-px text-[10px] text-t3">{children}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
