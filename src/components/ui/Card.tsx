import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-md border border-brd bg-bg1 p-[13px]", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-2.5 flex items-center justify-between text-[11px] font-bold text-t1", className)}
      {...props}
    />
  );
}
