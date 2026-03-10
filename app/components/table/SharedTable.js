import moment from "moment";
import React from "react";

const SharedTable = ({ expenses }) => {
  return (
    <table className="w-full border-separate bg-white shadow-md rounded-xl overflow-hidden">
      <thead className="bg-[#1e4846] text-[#fefcfd] text-sm uppercase">
        <tr>
          <th className="px-2 py-2">Item</th>
          <th className="px-2 py-2">Category</th>
          <th className="px-2 py-2">Date</th>
          <th className="px-2 py-2">Paid By</th>
          <th className="px-2 py-2">Split Type</th>
          <th className="px-2 py-2">Participants</th>
          <th className="px-2 py-2">Amount</th>
          <th className="px-2 py-2">settlement</th>
        </tr>
      </thead>
      <tbody>
        {expenses &&
          expenses?.map((el) => (
            <tr
              key={el._id}
              className="border-t hover:bg-gray-50 text-gray-700 text-sm transition"
            >
              <td className="px-2 py-2 capitalize">{el.item}</td>
              <td className="px-2 py-2 capitalize">{el.category}</td>
              <td className="px-2 py-2">
                {moment(el.date).format("DD-MM-YYYY")}
              </td>
              <td className="px-2 py-2 capitalize">{el.paidBy}</td>
              <td className="px-2 py-2 capitalize">{el.splitType}</td>
              <td className="px-2 py-2 capitalize">
                {el.participants.map((par, i) => (
                  <div key={`per-${i}`}>
                    {par.name}:{par.amount}
                  </div>
                ))}
              </td>
              <td className="px-2 py-2">{el.totalAmount}</td>
              <td className="px-2 py-2 ">
                {el.settlement.map((set, i) => (
                  <div key={`set-${i}`}>
                    {set.person} owes {set.owes} {set.amount}
                  </div>
                ))}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default SharedTable;
