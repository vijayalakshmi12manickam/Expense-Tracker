import React from "react";
import moment from "moment";
import EditIcon from "../icons/edit.svg";
import DeleteIcon from "../icons/delete.svg";
import Image from "next/image";

const ExpensesTable = ({
  getSortSymbol,
  expenses,
  editExpense,
  onDelete,
  sortData,
}) => {
  return (
    <table className="w-full border-separate bg-white shadow-md rounded-xl overflow-hidden">
      <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
        <tr>
          <th className="py-3 px-4 text-left">S.No</th>
          <th
            className="py-3 px-4 text-left cursor-pointer"
            onClick={() => sortData("item")}
          >
            Name {getSortSymbol("item")}
          </th>
          <th
            className="py-3 px-4 text-left cursor-pointer"
            onClick={() => sortData("bank")}
          >
            Bank {getSortSymbol("bank")}
          </th>
          <th
            className="py-3 px-4 text-left cursor-pointer"
            onClick={() => sortData("txnType")}
          >
            Transition Type {getSortSymbol("txnType")}
          </th>
          <th
            className="py-3 px-4 text-left cursor-pointer"
            onClick={() => sortData("category")}
          >
            Category {getSortSymbol("category")}
          </th>
          <th
            className="py-3 px-4 text-center cursor-pointer"
            onClick={() => sortData("date")}
          >
            Date {getSortSymbol("date")}
          </th>
          <th
            className="py-3 px-4 text-right cursor-pointer"
            onClick={() => sortData("amount")}
          >
            Amount {getSortSymbol("amount")}
          </th>
          <th className="py-3 px-4 text-left">Action</th>
        </tr>
      </thead>

      <tbody>
        {expenses.map((exp, index) => (
          <tr
            key={exp._id}
            className="border-t hover:bg-gray-50 text-gray-700 text-sm transition"
          >
            <td className="py-3 px-4">{index + 1}</td>
            <td className="py-3 px-4">{exp.item}</td>
            <td className="py-3 px-4">{exp.bank}</td>
            <td className="py-3 px-4">{exp.txnType}</td>
            <td className="py-3 px-4">{exp.category}</td>
            <td className="py-3 px-4 text-center">
              {moment(exp.date).format("DD-MM-yyyy")}
            </td>
            <td className="py-3 px-4 text-right font-medium text-green-700">
              £{exp.amount.toFixed(2)}
            </td>
            <td className="py-3 px-4">
              <div className="flex gap-4">
                <Image
                  src={EditIcon}
                  width="20"
                  alt="edit-icon"
                  className="cursor-pointer"
                  onClick={() => editExpense(exp._id)}
                />
                <Image
                  src={DeleteIcon}
                  width="20"
                  alt="delete-icon"
                  className="cursor-pointer"
                  onClick={() => onDelete(exp._id)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExpensesTable;
