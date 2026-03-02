"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

export default function LineChart() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [category, setCategory] = useState("all");
  const [chartData, setChartData] = useState(null);

  // Fetch data whenever year or category changes
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `/api/expense/yearly?year=${year}&category=${category}`,
      );
      const data = await res.json();

      const labels = data.map((m) =>
        new Date(0, m.month - 1).toLocaleString("default", { month: "short" }),
      );

      const datasetLabel =
        category === "all"
          ? `Total Expenses - ${year}`
          : `${category} - ${year}`;

      setChartData({
        labels,
        datasets: [
          {
            label: datasetLabel,
            data: data.map((m) => m.totalAmount),
            borderColor: "#1e4846",
            backgroundColor: "#1e4846",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.3,
          },
        ],
      });
    };

    fetchData();
  }, [year, category]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#374151" },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#4b5563" } },
      x: { ticks: { color: "#4b5563" } },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4  w-full">
      <div className="flex justify-between mb-4">
        <div>
          <label className="mr-2 text-sm font-medium text-gray-700">
            Year:
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border rounded-md px-2 py-1"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <h2 className="font-semibold">Monthly Trend</h2>
        <div>
          <label className="mr-2 text-sm font-medium text-gray-700">
            Category:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-md px-2 py-1"
          >
            <option value="all">All</option>
            <option value="Clothing">Clothing</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Food">Food</option>
            <option value="Groceries">Groceries</option>
            <option value="Travel">Travel</option>
            <option value="Utilities">Utilities</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      {chartData ? (
        <div className="relative w-full h-[150px]">
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Loading...</p>
      )}
    </div>
  );
}
