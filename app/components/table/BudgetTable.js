import moment from "moment";
import React from "react";

const BudgetTable = ({ data }) => {
  const colorClass = (percent) => {
    if (percent > 85) return "bg-red-500";
    if (percent > 60) return "bg-orange-400";
    return "bg-green-500";
  };
  return (
    <div className="w-full overflow-x-auto shadow-xl/20 rounded-xl mb-3">
      <table className="w-full border-separate bg-white shadow-md rounded-xl">
        <thead className="bg-[#1e4846] text-[#fefcfd] text-sm uppercase">
          <tr>
            <th className="px-2 py-2">Type</th>
            <th className="px-2 py-2">Name</th>
            <th className="px-2 py-2 whitespace-nowrap">Start Date</th>
            <th className="px-2 py-2 whitespace-nowrap">End Date</th>
            <th className="px-2 py-2">Limit</th>
            <th className="px-2 py-2">Spent</th>
            {/* <th className="px-2 py-2">Percent</th> */}
            <th className="px-2 py-2">Progress Bar</th>
            {/* <th className="px-2 py-2">Currency</th> */}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item, i) => (
              <tr
                key={i}
                className="border-t hover:bg-gray-50 text-gray-700 text-sm transition"
              >
                <td className="px-2 py-2 capitalize">{item.type}</td>
                <td className="px-2 py-2">{item.name}</td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {moment(item.startDate).format("DD-MM-yyyy")}
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  {moment(item.endDate).format("DD-MM-yyyy")}
                </td>
                <td className="px-2 py-2">
                  {item.currency == "GBP" ? "£" : "₹"}
                  {item.limit.toFixed(2)}
                </td>
                <td className="px-2 py-2">
                  {item.currency == "GBP" ? "£" : "₹"}
                  {item.spent.toFixed(2)}
                </td>
                {/* <td className="px-2 py-2">{item.percentUsed.toFixed(2)}%</td> */}
                <td className="px-2 py-2 w-50">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${colorClass(item.percentUsed)}`}
                      style={{ width: `${item.percentUsed}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.percentUsed.toFixed(2)}%
                  </p>
                </td>
                {/* <td className="px-2 py-2">{item.currency}</td> */}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetTable;
