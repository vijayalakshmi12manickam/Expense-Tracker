"use client";
import React, { useEffect, useState } from "react";
import BudgetForm from "../components/form/BudgetForm";
import PopupLayout from "../components/PopupLayout";
import BudgetTable from "../components/table/BudgetTable";

const Budget = () => {
  const [budgetData, setBudgetData] = useState([]);
  const [addPopup, setAddPopup] = useState(false);

  const categorizeBudgets = (budgets) => {
    const today = new Date();
    const categories = { Active: [], Expired: [], Future: [] };

    budgets &&
      budgets.forEach((b) => {
        const start = new Date(b.startDate);
        const end = new Date(b.endDate);

        if (today < start) categories.Future.push(b);
        else if (today > end) categories.Expired.push(b);
        else categories.Active.push(b);
      });

    return categories;
  };

  useEffect(() => {
    // fetch("/api/budget")
    //   .then((res) => res.json())
    //   .then((res) => {
    //     console.log(categorizeBudgets(res?.budgets));
    //     setBudgetData(categorizeBudgets(res?.budgets));
    //   })
    //   .catch((err) => console.log(err));

    fetch("/api/budget/summary")
      .then((res) => res.json())
      .then((res) => {
        setBudgetData(categorizeBudgets(res));
      })
      .catch((err) => console.log(err));
  }, []);

  const handleClose = () => {
    setAddPopup(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 mt-8 overflow-hidden">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Budgets</h2>
        <button
          style={{ backgroundColor: "#1e4846" }}
          className="px-8 font-semibold text-[#fefcfd] rounded-md cursor-pointer"
          onClick={() => setAddPopup(true)}
        >
          Add Budget
        </button>
        {addPopup ? (
          <PopupLayout>
            <div className="bg-white w-full max-w-md p-6 relative">
              <BudgetForm close={() => handleClose()} />
            </div>
          </PopupLayout>
        ) : (
          ""
        )}
      </div>
      <div>
        {budgetData.Active && budgetData.Active.length ? (
          <>
            <h2 className="mt-3 mb-2">Active Budget</h2>
            <BudgetTable data={budgetData.Active} />
          </>
        ) : (
          ""
        )}

        {budgetData.Future && budgetData.Future.length ? (
          <>
            <h2 className="mt-3 mb-2">Future Budget</h2>
            <BudgetTable data={budgetData.Future} />
          </>
        ) : (
          ""
        )}

        {budgetData.Expired && budgetData.Expired.length ? (
          <>
            <h2 className="mt-3 mb-2">Past Budget</h2>
            <BudgetTable data={budgetData.Expired} />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Budget;
