"use client";

import { useEffect, useState } from "react";
import SummaryCards from "../components/dasboard/SummaryCards";
import CategoryChart from "../components/dasboard/CategoryChart";
import MonthlyChart from "../components/dasboard/MonthlyChart";
import RecentTransactions from "../components/dasboard/RecentTransactions";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const userId = "YOUR_USER_ID_HERE"; // replace or make dynamic

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await fetch(`/api/dashboard`);
      const json = await res.json();
      setData(json.data);
    };

    fetchDashboard();
  }, []);

  if (!data) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-8 space-y-8">
      <SummaryCards total={data.totalAmount?.[0]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryChart data={data.categoryBreakdown} />
        <MonthlyChart data={data.monthlyTrend} />
      </div>

      <RecentTransactions data={data.recentTransactions} />
    </div>
  );
}
