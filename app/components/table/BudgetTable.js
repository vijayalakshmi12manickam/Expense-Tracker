import moment from "moment";
import React from "react";

const BudgetTable = ({ data }) => {
  return (
    <table className="w-full border-separate bg-white shadow-md rounded-xl overflow-hidden">
      <thead className="bg-[#1e4846] text-[#fefcfd] text-sm uppercase">
        <tr>
          <th className="px-2 py-2">Type</th>
          <th className="px-2 py-2">Name</th>
          <th className="px-2 py-2">Limit</th>
          <th className="px-2 py-2">Start Date</th>
          <th className="px-2 py-2">End Date</th>
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
              <td className="px-2 py-2">
                {item.currency == "GBP" ? "£" : "₹"}
                {item.limit.toFixed(2)}
              </td>
              <td className="px-2 py-2">
                {moment(item.startDate).format("DD-MM-yyyy")}
              </td>
              <td className="px-2 py-2">
                {moment(item.endDate).format("DD-MM-yyyy")}
              </td>
              {/* <td className="px-2 py-2">{item.currency}</td> */}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default BudgetTable;
