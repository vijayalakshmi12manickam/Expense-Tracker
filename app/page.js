"use client";

import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import EditIcon from "./components/icons/edit.svg";
import DeleteIcon from "./components/icons/delete.svg";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});

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
        setSummary({ ...data[0] });
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

    // try {
    //   const res = await fetch(`/api/expense/${id}`, {
    //     method: "DELETE",
    //   });

    //   const data = await res.json();
    //   if (!res.ok) throw new Error(data.message || "Delete failed");

    // } catch (err) {
    //   console.error(err);
    //   alert("❌ Failed to delete expense");
    // } finally {
    //   console.log("finall block");
    // }
  };

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
            <table className="w-full border-separate bg-white shadow-md rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Bank</th>
                  <th className="py-3 px-4 text-left">Transition Type</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-center">Date</th>
                  <th className="py-3 px-4 text-right">Amount (£)</th>
                  <th className="py-3 px-4 text-left">Action</th>
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
                          // onClick={() => editExpense(exp._id)}
                        />
                        <Image
                          src={DeleteIcon}
                          width="20"
                          alt="delete-icon"
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
      <div className="md:col-span-1 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
        {summary ? (
          <div className="shadow-md rounded-xl mt-3 p-4">
            {/* <p>Total: {summary.totalAmount}</p>
            {summary &&
              summary.categories &&
              summary.categories.map((el) => (
                <p key={el.category}>
                  {el.category}: {el.total}
                </p>
              ))} */}
            <table>
              <tbody>
                <tr>
                  <td className="py-1 px-4">Total</td>
                  <td className="py-1 px-4">£{summary.totalAmount}</td>
                </tr>
                {summary &&
                  summary.categories &&
                  summary.categories.map((el) => (
                    <tr key={el.category}>
                      <td className="py-1 px-4">{el.category}</td>
                      <td className="py-1 px-4">£{el.total}</td>
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
