"use client";

import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { Kpi } from "@/components/ui/Kpi";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { useChartTheme } from "@/components/charts/useChartTheme";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { biConsolidado, type BiConsolidado } from "@/lib/api/bi";
import { useApiResource } from "@/lib/useApiResource";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

const STATUS_COLORS = [
  { bg: "#F59E0B", border: "#F59E0B" },
  { bg: "#1A56C4", border: "#1A56C4" },
  { bg: "#059669", border: "#059669" },
  { bg: "#DC2626", border: "#DC2626" },
];

const BI_FALLBACK: BiConsolidado = {
  total_acoes: 125,
  aprovadas: 88,
  enviadas: 12,
  pendentes: 18,
  diligencias: 7,
  pct_completude: 60,
  nivel_estimado: "III",
  por_requisito: [],
  por_dimensao: {
    CI: { total: 10, aprovadas: 8 },
    GC: { total: 20, aprovadas: 13 },
    EP: { total: 8, aprovadas: 6 },
  },
};

const EVOL = {
  labels: ["2020", "2021", "2022", "2023", "2024", "2026"],
  data: [35, 52, 68, 70, 72, 74],
};

function pctDim(bi: BiConsolidado, dim: string): number {
  const d = bi.por_dimensao[dim];
  if (!d || !d.total) return 0;
  return Math.round((d.aprovadas / d.total) * 100);
}

export default function BiPage() {
  const { tick, grid } = useChartTheme();
  const { toast } = useToast();
  const { data: bi, offline } = useApiResource("bi-consolidado", biConsolidado, BI_FALLBACK);

  return (
    <div className="animate-fade-in">
      {offline ? (
        <Alert variant="warn" title="API indisponível — exibindo dados locais" className="mb-2">
          Não foi possível conectar à API. Os indicadores são exibidos do repositório local.
        </Alert>
      ) : null}

      <div className="mb-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Kpi label="Conformidade geral" value={`${bi.pct_completude}%`} delta={`${bi.aprovadas} / ${bi.total_acoes} itens`} />
        <Kpi label="Dimensão CI" value={`${pctDim(bi, "CI")}%`} tone="text-grn2" delta="Controles Internos" deltaTone="text-grn2" />
        <Kpi label="Dimensão GC" value={`${pctDim(bi, "GC")}%`} tone="text-amb2" delta="Governança Corp." deltaTone="text-amb2" />
        <Kpi label="Dimensão EP" value={`${pctDim(bi, "EP")}%`} tone="text-acc2" delta="Ed. Previdenciária" deltaTone="text-acc2" />
      </div>

      <div className="grid gap-2.5 lg:grid-cols-2">
        <Card>
          <div className="mb-2 text-[11px] font-bold text-t1">Status do Plano de Ação</div>
          <div className="relative h-48">
            <Doughnut
              data={{
                labels: ["Pendente", "Enviado", "Aprovado", "Diligência"],
                datasets: [
                  {
                    data: [bi.pendentes, bi.enviadas, bi.aprovadas, bi.diligencias],
                    backgroundColor: STATUS_COLORS.map((c) => c.bg),
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                    labels: { color: tick, font: { size: 9 }, usePointStyle: true, padding: 10 },
                  },
                },
              }}
            />
          </div>
        </Card>
        <Card>
          <div className="mb-2 text-[11px] font-bold text-t1">
            Evolução Score <span className="text-[9px] text-t3">2020–2026</span>
          </div>
          <div className="relative h-48">
            <Line
              data={{
                labels: EVOL.labels,
                datasets: [
                  {
                    data: EVOL.data,
                    borderColor: "#1A56C4",
                    backgroundColor: "rgba(26,86,196,.15)",
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: "#1A56C4",
                    pointRadius: 3,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    min: 20,
                    max: 90,
                    ticks: { color: tick, font: { size: 9 }, callback: (v) => `${v}%` },
                    grid: { color: grid },
                  },
                  x: { ticks: { color: tick, font: { size: 9 } }, grid: { display: false } },
                },
              }}
            />
          </div>
        </Card>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button onClick={() => toast("Exportando relatório gerencial PDF...", "info")}>
          <FileDown className="size-3.5" />
          Relatório PDF
        </Button>
        <Button onClick={() => toast("Exportando dados Excel...", "info")}>
          <FileDown className="size-3.5" />
          Excel
        </Button>
      </div>
    </div>
  );
}
