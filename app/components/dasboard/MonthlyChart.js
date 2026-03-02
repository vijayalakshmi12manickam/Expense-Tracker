"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

export default function MonthlyChart({ data }) {
  const labels = data.map((item) => `${item.month}/${item.year}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Monthly Spending",
        data: data.map((item) => item.total),
      },
    ],
  };

  return (
    <div className="bg-white p-6 shadow rounded-xl">
      <h3 className="mb-4 font-semibold">Monthly Trend</h3>
      <Line data={chartData} />
    </div>
  );
}
