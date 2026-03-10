"use client";

import React, { useEffect, useState } from "react";
import SharedExpensesForm from "../components/form/SharedExpensesForm";
import PopupLayout from "../components/PopupLayout";
import SharedTable from "../components/table/SharedTable";
import Avatar from "../components/avatar";

const Shared = () => {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [userBalances, setUserBalances] = useState({});
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

  const getUserBalances = () => {
    fetch("/api/expense/shared/userBalances")
      .then((res) => res.json())
      .then((res) => setUserBalances(res))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getExpenses();
    getSharedBalances();
    getUserBalances();
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
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 order-2 lg:order-1 overflow-x-auto">
          <SharedTable expenses={expenses.expenses} />
        </div>
        <div className="lg:col-span-2 order-1 lg:order-2">
          {userBalances && userBalances?.summary ? (
            <div className="grid grid-cols-3 gap-6 mt-3 mb-3 ">
              <div className="bg-white rounded-xl p-4 shadow">
                <h3 className="font-semibold">{"Net Balance"}</h3>
                {userBalances.summary.totalBalance.toFixed(2)}
              </div>
              <div className="bg-white rounded-xl p-4 shadow text-green-600">
                <h3 className="font-semibold">{"You are Owed"}</h3>
                {userBalances.summary.youAreOwed.toFixed(2)}
              </div>
              <div className="bg-white rounded-xl p-4 shadow text-red-600">
                <h3 className="font-semibold">{"You Owe"}</h3>
                {userBalances.summary.youOwe.toFixed(2)}
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="grid md:grid-cols-2 md:divide-x-2 border-gray-600 bg-white rounded-lg p-4">
            <div>
              <h2 className="mb-2 font-semibold ml-2">You are Owed</h2>
              {userBalances && userBalances?.youAreOwed ? (
                userBalances.youAreOwed.map((el, i) => (
                  <div
                    className="hover:bg-gray-100 cursor-pointer pl-2 flex justify-between pr-4 py-2 items-center"
                    key={i}
                  >
                    <div className="flex gap-2 items-center ">
                      <Avatar name={el.person} />
                      <p>{el.person}</p>
                    </div>
                    <div className="items.center">
                      <p>{el.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div>No one owe you</div>
              )}
            </div>
            <div className="">
              <h2 className="mb-2 font-semibold ml-2">You Owe</h2>
              {userBalances && userBalances?.youOwe ? (
                userBalances.youOwe.map((el, i) => (
                  <div
                    className="hover:bg-gray-100 cursor-pointer pl-2 flex justify-between pr-4 py-2 items-center"
                    key={i}
                  >
                    <div className="flex gap-2 items-center ">
                      <Avatar name={el.person} />
                      <p>{el.person}</p>
                    </div>
                    <div className="items.center">
                      <p>{el.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div>You owe nothing</div>
              )}
            </div>
          </div>
          <div>
            <div>
              <table className="w-full border-separate bg-white shadow-md rounded-xl overflow-x-auto mt-4">
                <thead className="bg-[#1e4846] text-[#fefcfd] text-sm uppercase">
                  <tr>
                    <th className="px-2 py-2">Person</th>
                    <th className="px-2 py-2">Owes</th>
                    <th className="px-2 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {balances &&
                    balances?.settlements &&
                    balances?.settlements.map((bal, i) => (
                      <tr
                        key={i}
                        className="border-t hover:bg-gray-50 text-gray-700 text-sm transition"
                      >
                        <td className="px-2 py-2 capitalize">{bal.from}</td>
                        <td className="px-2 py-2 capitalize">{bal.to}</td>
                        <td className="px-2 py-2 ">{bal.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shared;
