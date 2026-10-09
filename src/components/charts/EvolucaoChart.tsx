"use client";

import "./register";
import { Line } from "react-chartjs-2";
import { useChartTheme } from "./useChartTheme";

const LABELS = ["2020", "2021", "2022", "2023", "2024", "2026"];
const DATA = [35, 52, 68, 70, 72, 74];

export function EvolucaoChart() {
  const { tick, grid } = useChartTheme();

  return (
    <div className="relative h-40">
      <Line
        data={{
          labels: LABELS,
          datasets: [
            {
              data: DATA,
              borderColor: "#1A56C4",
              backgroundColor: "rgba(26,86,196,.1)",
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#1A56C4",
              pointRadius: 4,
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
              ticks: {
                color: tick,
                font: { size: 10 },
                callback: (value) => `${value}%`,
              },
              grid: { color: grid },
            },
            x: {
              ticks: { color: tick, font: { size: 10 } },
              grid: { display: false },
            },
          },
        }}
      />
    </div>
  );
}
