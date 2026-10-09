import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "default" | "pri" | "suc" | "dan" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  default: "border-brd2 bg-bg2 text-t2 hover:bg-bg3 hover:text-t1",
  pri: "border-acc bg-acc text-white hover:bg-acc2",
  suc: "border-grn bg-grn text-white hover:opacity-90",
  dan: "border-red bg-red text-white hover:opacity-90",
  ghost: "border-transparent bg-transparent text-t2 hover:bg-bg3 hover:text-t1",
};

export function Button({ variant = "default", icon, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-[5px] text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
