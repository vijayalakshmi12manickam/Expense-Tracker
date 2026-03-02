import React, { useState } from "react";
import moment from "moment";
import EditIcon from "../icons/edit.svg";
import DeleteIcon from "../icons/delete.svg";
import TagIcon from "../icons/tag.svg";
import Image from "next/image";
import TagCard from "../TagCard";

const ExpensesTable = ({
  getSortSymbol,
  expenses,
  editExpense,
  onDelete,
  sortData,
  display,
}) => {
  // const [showTag, setShowTag] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [tagPopup, setTagPopup] = useState(false);
  const [tag, setTag] = useState("");

  // const tagOnClick = () => {
  //   setShowTag((ps) => !ps);
  // };

  const toggleTags = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const tagPopupOnclick = (tagValue) => {
    if (tagPopup) {
      setTagPopup(false);
      setTag("");
    } else {
      setTagPopup(true);
      setTag(tagValue);
    }
  };

  return (
    <div className="w-full overflow-x-auto shadow-xl/20 rounded-xl mb-3">
      <table className="min-w-max w-full border-separate bg-white">
        <thead className="bg-[#1e4846] text-[#fefcfd] text-sm uppercase">
          <tr>
            <th className="py-3 px-4 text-left">S.No</th>
            <th
              className="py-3 px-4 text-left cursor-pointer"
              onClick={() => sortData("item")}
            >
              Name {display ? "" : getSortSymbol("item")}
            </th>
            <th
              className="py-3 px-4 text-left cursor-pointer"
              onClick={() => sortData("bank")}
            >
              Bank {display ? "" : getSortSymbol("bank")}
            </th>
            <th
              className="py-3 px-4 text-left cursor-pointer"
              onClick={() => sortData("txnType")}
            >
              Txn Type {display ? "" : getSortSymbol("txnType")}
            </th>
            <th
              className="py-3 px-4 text-left cursor-pointer"
              onClick={() => sortData("category")}
            >
              Category {display ? "" : getSortSymbol("category")}
            </th>
            <th
              className="py-3 px-4 text-center cursor-pointer"
              onClick={() => sortData("date")}
            >
              Date {display ? "" : getSortSymbol("date")}
            </th>
            <th
              className="py-3 px-4 text-right cursor-pointer"
              onClick={() => sortData("amount")}
            >
              Amount {display ? "" : getSortSymbol("amount")}
            </th>
            <th
              className="py-3 px-4 text-left"
              // onClick={() => sortData("amount")}
            >
              Tags
            </th>
            {display ? "" : <th className="py-3 px-4 text-left">Action</th>}
          </tr>
        </thead>

        <tbody>
          {expenses.map((exp, index) => (
            <tr
              key={exp._id}
              className="border-t hover:bg-gray-50 text-gray-700 text-sm transition"
            >
              <td className={display ? "px-2 py-2" : "py-3 px-4"}>
                {index + 1}
              </td>
              <td className={display ? "px-2 py-2" : "py-3 px-4"}>
                {exp.item}
              </td>
              <td
                className={
                  display ? "px-2 py-2 capitalize" : "py-3 px-4 capitalize"
                }
              >
                {exp.bank}
              </td>
              <td
                className={
                  display ? "px-2 py-2 capitalize" : "py-3 px-4 capitalize"
                }
              >
                {exp.txnType}
              </td>
              <td
                className={
                  display ? "px-2 py-2 capitalize" : "py-3 px-4 capitalize"
                }
              >
                {exp.category}
              </td>
              <td
                className={
                  display ? "py-2 px-2 text-center" : "py-3 px-4 text-center"
                }
              >
                {moment(exp.date).format("DD-MM-yyyy")}
              </td>
              <td
                className={
                  display
                    ? "py- px-2 text-right font-medium text-green-700"
                    : "py-3 px-4 text-right font-medium text-green-700"
                }
              >
                £{exp.amount.toFixed(2)}
              </td>
              <td className="pl-1">
                {exp.tags.length ? (
                  expandedId === exp._id ? (
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-[#239b6f] text-white rounded-lg p-2 cursor-pointer "
                          onClick={() => tagPopupOnclick(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="flex cursor-pointer"
                      onClick={() => toggleTags(exp._id)}
                    >
                      <Image
                        src={TagIcon}
                        width="16"
                        height="auto"
                        alt="tag-icon"
                      />
                      {exp.tags.length}
                    </div>
                  )
                ) : (
                  <div>No tag</div>
                )}
              </td>
              {display ? (
                ""
              ) : (
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
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {tagPopup ? (
        <div>
          <TagCard tag={tag} tagClose={tagPopupOnclick} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ExpensesTable;
