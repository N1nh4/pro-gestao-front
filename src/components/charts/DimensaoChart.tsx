"use client";

import "./register";
import { Bar } from "react-chartjs-2";
import { useChartTheme } from "./useChartTheme";

export function DimensaoChart() {
  const { tick, grid } = useChartTheme();

  return (
    <div className="relative h-40">
      <Bar
        data={{
          labels: ["CI", "GC", "EP"],
          datasets: [
            {
              data: [80, 65, 75],
              backgroundColor: [
                "rgba(28,138,67,.8)",
                "rgba(26,86,196,.8)",
                "rgba(182,112,10,.8)",
              ],
              borderRadius: 4,
              barPercentage: 0.6,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              max: 100,
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
