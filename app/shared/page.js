"use client";

import React, { useEffect, useState } from "react";
import SharedExpensesForm from "../components/form/SharedExpensesForm";
import PopupLayout from "../components/PopupLayout";
import SharedTable from "../components/table/SharedTable";

const Shared = () => {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [addExpensePopup, setAddExpensePopup] = useState(false);

  const getExpenses = () => {
    fetch("/api/expense/shared")
      .then((res) => res.json())
      .then((res) => setExpenses(res))
      .catch((err) => console.log(err));
  };

  const getSharedBalances = () => {
    fetch("/api/expense/shared/balances")
      .then((res) => res.json())
      .then((res) => setBalances(res))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getExpenses();
    getSharedBalances();
  }, []);

  console.log(balances);

  const handlePopup = () => {
    setAddExpensePopup(false);
    getExpenses();
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 mt-8 overflow-hidden">
      <div className="flex justify-between mt-3 mb-3 ">
        <h2 className="text-xl font-semibold text-gray-800">Shared Expenses</h2>
        <button
          style={{ backgroundColor: "#1e4846" }}
          className="px-8 font-semibold text-[#fefcfd] rounded-md cursor-pointer"
          onClick={() => setAddExpensePopup(true)}
        >
          Add Shared Expense
        </button>
      </div>
      {addExpensePopup ? (
        <PopupLayout>
          <div className="p-6">
            <SharedExpensesForm closeOnClick={() => handlePopup()} />
          </div>
        </PopupLayout>
      ) : (
        ""
      )}
      {balances && balances?.summary ? (
        <div className="grid md:grid-cols-3 gap-6 mt-3 mb-3">
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-semibold">{"Net Balance"}</h3>
            {balances.summary.netBalance.toFixed(2)}
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-green-600">
            <h3 className="font-semibold">{"You are owed"}</h3>
            {balances.summary.owedToYou.toFixed(2)}
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-red-600">
            <h3 className="font-semibold">{"You owe"}</h3>
            {balances.summary.youOwe.toFixed(2)}
          </div>
        </div>
      ) : (
        ""
      )}
      {balances &&
        balances?.settlements &&
        balances?.settlements.map((bal, i) => (
          <div key={`bal-${i}`}>
            {bal.from}
            {" owes "}
            {bal.to} {bal.amount}
          </div>
        ))}
      <SharedTable expenses={expenses.expenses} />
    </div>
  );
};

export default Shared;
