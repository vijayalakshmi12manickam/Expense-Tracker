"use client";

import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import EditIcon from "./components/icons/edit.svg";
import DeleteIcon from "./components/icons/delete.svg";
import Add from "./add/page";
import Form from "./components/form";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [popup, setPopup] = useState(false);
  const [expId, setExpId] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const Category = [
    { name: "Utilities", value: "utilities", id: 10 },
    { name: "Groceries", value: "groceries", id: 11 },
    { name: "Food", value: "food", id: 12 },
    { name: "Travel", value: "travel", id: 13 },
    { name: "Clothing", value: "clothing", id: 14 },
    { name: "Entertainment", value: "entertainment", id: 15 },
    { name: "Others", value: "others", id: 16 },
  ];

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
        // setLoading(false);
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
    // const getResponse = fetch("/api/expense")
    // console.log(getResponse)
    getExpenses();
    summaryApi();
  }, []);

  // const editExpense = (id) => {
  //   console.log(id);
  //   fetch(`/api/expense/${id}`)
  //     .then((res) => res.json())
  //     .then((data) => console.log(data))
  //     .catch((err) => console.log(err));
  // };

  const onDelete = (id) => {
    fetch(`/api/expense/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
    // setPopup(true);

    fetch(`/api/expense/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("data id", data);
        setExpId(data);
        setPopup(true);
      })
      .catch((err) => console.log(err));
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-screen p-6 bg-slate-50">
      <div className="md:col-span-2 rounded-lg shadow-sm p-6">
        <div className="flex justify-between mt-3 mb-3 ">
          <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>
          {/* <Link
            className="bg-blue-300 px-8 font-semibold text-gray-800 rounded-md"
            href="/add"
          >
            {" "}
            <p>Add</p>
          </Link> */}
          <button
            className="bg-blue-300 px-8 font-semibold text-gray-800 rounded-md cursor-pointer"
            onClick={() => addClick()}
          >
            Add
          </button>
        </div>
        {popup ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
              <div className="sm:flex sm:items-start">
                {/* <Add /> */}
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
          )}
        </div>
      </div>
      <div className="md:col-span-1">
        <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
        {summary ? (
          <div className="shadow-md rounded-xl mt-3 p-4">
            <table className="w-full border-separate bg-white shadow-md rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="px-2 py-2">Category</th>
                  <th className="px-2 py-2">current</th>
                  <th className="px-2 py-2">Previous</th>
                </tr>
              </thead>
              <tbody>
                {/* £{parseFloat(el.total).toFixed(2)} */}
                {summary &&
                  summary.mergedCategories &&
                  summary.mergedCategories.map((cat) => (
                    <tr className="border-t hover:bg-gray-50 text-gray-700 text-sm transition">
                      <td className="px-2 py-2">{cat.category}</td>
                      <td className="px-2 py-2">
                        {parseFloat(cat.currentTotal).toFixed(2)}
                      </td>
                      <td className="px-2 py-2">
                        {parseFloat(cat.previousTotal).toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
