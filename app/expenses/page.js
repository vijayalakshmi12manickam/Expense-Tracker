"use client";

import React, { useState, useEffect } from "react";
import ExpensesTable from "../components/table/ExpenseTable";
import Form from "../components/form/AddForm";
import moment from "moment";
import ResetIcon from "../components/icons/reset.svg";
import Image from "next/image";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [popup, setPopup] = useState(false);
  const [expId, setExpId] = useState({});
  const [monthValue, setMonthValue] = useState("");
  const [filterValue, setFilterValue] = useState({
    item: "",
    bank: "",
    category: "",
  });
  const [filterExpenseValue, setFilterExpensesValue] = useState({});

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

    const expensesData = expenses?.expenses;

    const sorted = [...expensesData].sort((a, b) => {
      if (typeof a[key] === "number") {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      } else {
        return direction === "asc"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
    });
    setExpenses({ ...expenses, expenses: sorted });
    setSortConfig({ key, direction });
  };

  const getExpenses = () => {
    if (monthValue) {
      fetch(`/api/expense/search?month=${monthValue}`)
        .then((res) => res.json())
        .then((res) => setExpenses(res))
        .catch((err) => console.log(err));
    } else {
      fetch("/api/expense")
        .then((res) => res.json())
        .then((data) => {
          console.log("data", data);
          setExpenses(data);
        })
        .catch((err) => {
          console.error("❌ Error fetching expenses:", err);
        });
    }
  };

  useEffect(() => {
    getExpenses();
  }, []);

  useEffect(() => {
    if (monthValue) {
      setFilterValue({
        item: "",
        bank: "",
        category: "",
      });
      fetch(`/api/expense/search?month=${monthValue}`)
        .then((res) => res.json())
        .then((res) => setExpenses(res))
        .catch((err) => console.log(err));
    }
  }, [monthValue]);

  const filteredExpenses = () =>
    (expenses.expenses || []).filter((exp) => {
      const bankMatch = filterValue.bank ? exp.bank === filterValue.bank : true;
      const categoryMatch = filterValue.category
        ? exp.category === filterValue.category
        : true;
      const searchMatch = filterValue.item
        ? exp.item?.toLowerCase().includes(filterValue.item) ||
          exp.category?.toLowerCase().includes(filterValue.item)
        : true;
      return bankMatch && categoryMatch && searchMatch;
    });

  const filterData = (key, value) => {
    setFilterValue((ps) => {
      return {
        ...ps,
        [key]: value,
      };
    });
  };

  useEffect(() => {
    if (
      filterValue.bank.length > 1 ||
      filterValue.category.length > 1 ||
      filterValue.item.length > 1
    ) {
      console.log(filteredExpenses());
      // setExpenses({ ...expenses, expenses: filteredExpenses() });
    }
  }, [filterValue]);

  const checkfilter = () => {
    if (
      filterValue.bank.length > 1 ||
      filterValue.category.length > 1 ||
      filterValue.item.length > 1
    ) {
      return { ...expenses, expenses: filteredExpenses() };
    } else {
      return expenses;
    }
  };

  const resetOnclick = () => {
    setFilterValue({
      item: "",
      bank: "",
      category: "",
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 mt-8 overflow-hidden">
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
      <div className="flex w-full justify-between items-center flex-wrap gap-3">
        <div className="flex gap-3 flex-wrap items-center">
          <div>
            <input
              type="month"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setMonthValue(e.target.value)}
              value={monthValue ? monthValue : moment().format("yyyy-MM")}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Search item"
              value={filterValue.item}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
              onChange={(e) => filterData("item", e.target.value)}
            />
          </div>
          <div>
            <select
              onChange={(e) => filterData("bank", e.target.value)}
              value={filterValue.bank}
              className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-10 capitalize"
            >
              <option value="">All Bank</option>
              {[
                ...new Set(
                  expenses?.expenses && expenses?.expenses.map((e) => e.bank),
                ),
              ].map((bank) => (
                <option className="capitalize" key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              onChange={(e) => filterData("category", e.target.value)}
              value={filterValue.category}
              className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-10 capitalize"
            >
              <option value={""}>All Category</option>
              {[
                ...new Set(
                  expenses?.expenses &&
                    expenses?.expenses.map((e) => e.category),
                ),
              ].map((cat) => (
                <option className="capitalize" key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              className="flex gap-2 cursor-pointer"
              onClick={() => resetOnclick()}
            >
              <Image src={ResetIcon} alt="reset" width={"15"} /> Reset
            </button>
          </div>
        </div>
        {expenses && expenses.total ? (
          <div>
            <h2>
              Total: <b>{expenses.total.toFixed(2)}</b>
            </h2>
          </div>
        ) : (
          ""
        )}
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
      <div className="mt-3">
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center text-sm p-5">
            Expenses are yet to be added for this month.
          </p>
        ) : (
          <ExpensesTable
            expenses={checkfilter()?.expenses}
            editExpense={editExpense}
            onDelete={onDelete}
            getSortSymbol={getSortSymbol}
            sortData={sortData}
            total={expenses.total}
          />
        )}
      </div>
    </div>
  );
};

export default Expenses;
