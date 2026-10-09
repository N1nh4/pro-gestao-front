"use client";

import { useTheme } from "@/context/ThemeContext";

/** Cores dos eixos/grade adaptadas ao tema (portado do initCharts original). */
export function useChartTheme() {
  const { theme } = useTheme();
  const light = theme === "light";
  return {
    tick: light ? "#64748B" : "#9AA3B4",
    grid: light ? "rgba(0,0,0,.05)" : "rgba(255,255,255,.05)",
  };
}
