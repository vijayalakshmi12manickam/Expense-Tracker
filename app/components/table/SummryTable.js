import React from "react";

const SummryTable = ({ summary, insights }) => {
  return (
    <table className="w-full border-separate bg-white shadow-md rounded-xl overflow-hidden">
      <thead className="bg-[#1e4846] text-[#fefcfd] text-sm uppercase">
        <tr>
          <th className="px-2 py-2">Category</th>
          <th className="px-2 py-2">current</th>
          <th className="px-2 py-2">Previous</th>
          {/* <th className="px-2 py-2">Change</th>
                  <th className="px-2 py-2">% Change</th> */}
          {insights ? <th className="px-2 py-2">Insights</th> : ""}
        </tr>
      </thead>
      <tbody>
        {summary &&
          summary.insights &&
          summary?.insights.map((item, i) => (
            <tr
              key={i}
              className="border-t hover:bg-gray-50 text-gray-700 text-sm transition"
            >
              <td className="px-2 py-2">{item.category}</td>
              <td className="px-2 py-2">{item.current.toFixed(2)}</td>
              <td className="px-2 py-2">{item.previous.toFixed(2)}</td>
              {insights ? (
                <td className="px-2 py-2">
                  {item.trend === "Increased"
                    ? `Inc. by ${item.percentageChange}%`
                    : item.trend === "Decreased"
                      ? `Dec. by ${item.percentageChange}%`
                      : "No change"}
                </td>
              ) : (
                ""
              )}
            </tr>
          ))}
        <tr className="border-t hover:bg-gray-50 text-gray-700 text-sm transition">
          <td className="px-2 py-2">Total</td>
          <td className="px-2 py-2">
            {summary?.summary?.currentMonthTotal.toFixed(2)}
          </td>
          <td className="px-2 py-2">
            {summary?.summary?.previousMonthTotal.toFixed(2)}
          </td>
          {insights ? (
            <td className="px-2 py-2">
              {summary?.summary?.overallTrend === "Increased"
                ? `You are spending more this month`
                : summary?.summary?.overallTrend === "Decreased"
                  ? `You are spending less this month`
                  : "No change"}
            </td>
          ) : (
            ""
          )}
        </tr>
      </tbody>
    </table>
  );
};

export default SummryTable;
