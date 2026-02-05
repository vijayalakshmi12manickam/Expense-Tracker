"use client";

import React, { useState, useEffect } from "react";
import ExpensesTable from "../components/table/ExpenseTable";
import Form from "../components/form";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [popup, setPopup] = useState(false);
  const [expId, setExpId] = useState({});

  const addClick = () => {
    setPopup(true);
  };

  const closePopup = () => {
    setPopup(false);
    getExpenses();
    setExpId({});
  };

  const editExpense = (id) => {
    fetch(`/api/expense/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setExpId(data);
        setPopup(true);
      })
      .catch((err) => console.log(err));
  };

  const onDelete = (id) => {
    fetch(`/api/expense/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        getExpenses();
        summaryApi();
      })
      .catch((err) => console.log(err));
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...expenses].sort((a, b) => {
      if (typeof a[key] === "number") {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      } else {
        return direction === "asc"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
    });
    setExpenses(sorted);
    setSortConfig({ key, direction });
  };

  const getExpenses = () => {
    fetch("/api/expense")
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        setExpenses(data);
      })
      .catch((err) => {
        console.error("❌ Error fetching expenses:", err);
      });
  };

  useEffect(() => {
    getExpenses();
  }, []);

  return (
    <div className=" w-full mx-20 mt-8">
      <div className="flex justify-between mt-3 mb-3 ">
        <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>
        <button
          style={{ backgroundColor: "#1e4846" }}
          className="px-8 font-semibold text-[#fefcfd] rounded-md cursor-pointer"
          onClick={() => addClick()}
        >
          Add Expense
        </button>
      </div>
      {popup ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <div className="sm:flex sm:items-start">
              <Form
                close={() => closePopup()}
                expData={expId}
                setExpId={setExpId}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="w-full mt-5 overflow-x-auto ">
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center text-sm p-5">
            Expenses are yet to be added for this month.
          </p>
        ) : (
          <ExpensesTable
            expenses={expenses}
            editExpense={editExpense}
            onDelete={onDelete}
            getSortSymbol={getSortSymbol}
            sortData={sortData}
          />
        )}
      </div>
    </div>
  );
};

export default Expenses;
