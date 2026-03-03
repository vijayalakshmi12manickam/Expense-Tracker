"use client";

import React from "react";
import moment from "moment";

const TagTable = ({ tagData }) => {
  return (
    <div className="w-full overflow-x-auto shadow-xl/10 rounded-xl mb-3">
      <table className="w-full border-separate bg-white">
        <thead className="bg-[#1e4846] text-[#fefcfd] text-sm uppercase">
          <tr>
            <th className="py-3 px-4 text-left">S.No</th>
            <th className="py-3 px-4 text-left cursor-pointer">Name</th>
            <th className="py-3 px-4 text-left cursor-pointer">Category</th>
            <th className="py-3 px-4 text-center cursor-pointer">Date</th>
            <th className="py-3 px-4 text-right cursor-pointer">Amount</th>
          </tr>
        </thead>

        <tbody>
          {tagData.map((exp, index) => (
            <tr
              key={exp._id}
              className="border-t hover:bg-gray-50 text-gray-700 text-sm transition"
            >
              <td className={"py-3 px-4"}>{index + 1}</td>
              <td className={"py-3 px-4"}>{exp.item}</td>
              <td className={"py-3 px-4"}>{exp.category}</td>
              <td className={"py-3 px-4 text-center"}>
                {moment(exp.date).format("DD-MM-yyyy")}
              </td>
              <td className={"py-3 px-4 text-right font-medium text-green-700"}>
                £{exp.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TagTable;
