"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.total),
      },
    ],
  };

  return (
    <div className="bg-white p-6 shadow rounded-xl">
      <h3 className="mb-4 font-semibold">Category Breakdown</h3>
      <Pie data={chartData} />
    </div>
  );
}
