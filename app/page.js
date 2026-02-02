"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Form from "./components/form";
import StarIcon from "./components/icons/star.svg";
import ExpensesTable from "./components/table/ExpenseTable";
import SummryTable from "./components/table/SummryTable";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [popup, setPopup] = useState(false);
  const [expId, setExpId] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [insights, setInsight] = useState(false);

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

  const summaryApi = () => {
    fetch("/api/summary")
      .then((res) => res.json())
      .then((data) => {
        console.log("summary", data);
        setSummary(data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    getExpenses();
    summaryApi();
  }, []);

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

  const addClick = () => {
    setPopup(true);
  };

  const closePopup = () => {
    setPopup(false);
    getExpenses();
    summaryApi();
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

  const getSortSymbol = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const onClickInsight = () => {
    setInsight((ps) => !ps);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-screen p-6 bg-slate-50">
      <div className="md:col-span-2 rounded-lg shadow-sm p-6">
        <div className="flex justify-between mt-3 mb-3 ">
          <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>
          <button
            style={{ backgroundColor: "#1e4846" }}
            className="px-8 font-semibold text-[#fefcfd] rounded-md cursor-pointer"
            onClick={() => addClick()}
          >
            Add
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
        <div className="w-full mt-8 overflow-x-auto shadow-xl">
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
      <div className="md:col-span-1">
        <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
        {summary ? (
          <div className="shadow-md rounded-xl mt-3 p-4">
            <SummryTable summary={summary} insights={insights} />
            <div className="flex justify-end">
              <button
                className="bg-[#1e4846] px-8 font-semibold text-[#fefcfd] rounded-md cursor-pointer mt-4 py-1 flex"
                onClick={() => onClickInsight()}
              >
                {insights ? (
                  "Hide Insights"
                ) : (
                  <>
                    <Image
                      src={StarIcon}
                      alt="staricon"
                      width="20"
                      className="mr-1"
                    />
                    Insights
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
