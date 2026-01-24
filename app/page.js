"use client";

import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    // const getResponse = fetch("/api/expense")
    // console.log(getResponse)

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

    fetch("/api/summary")
      .then((res) => res.json())
      .then((data) => {
        console.log("summary", data);
        setSummary({ ...data[0] });
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-screen p-6 bg-slate-50">
      <div className="md:col-span-2 rounded-lg shadow-sm p-6">
        <div className="flex justify-between mt-3 mb-3 ">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Expenses
          </h2>
          <Link
            className="bg-blue-300 px-8 font-semibold text-gray-800 rounded-md"
            href="/add"
          >
            {" "}
            <p>Add</p>
          </Link>
        </div>
        <div className="w-full mt-8 overflow-x-auto shadow-xl">
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-sm">No expenses yet.</p>
          ) : (
            <table className="w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Bank</th>
                  <th className="py-3 px-4 text-left">Transition Type</th>
                  <th className="py-3 px-4 text-center">Category</th>
                  <th className="py-3 px-4 text-center">Date</th>
                  <th className="py-3 px-4 text-right">Amount ($)</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((exp) => (
                  <tr
                    key={exp._id}
                    className="border-t hover:bg-gray-50 text-gray-700 text-sm transition"
                  >
                    <td className="py-3 px-4">{exp.item}</td>
                    <td className="py-3 px-4">{exp.bank}</td>
                    <td className="py-3 px-4">{exp.txnType}</td>
                    <td className="py-3 px-4 text-center">{exp.category}</td>
                    <td className="py-3 px-4 text-center">
                      {moment(exp.date).format("DD-MM-yyyy")}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-green-700">
                      ${exp.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="md:col-span-1 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
        {summary ? (
          <div className="shadow-md rounded-xl mt-3 p-4">
            <p>Total: {summary.totalAmount}</p>
            {summary &&
              summary.categories &&
              summary.categories.map((el) => (
                <p key={el.category}>
                  {el.category}: {el.total}
                </p>
              ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
