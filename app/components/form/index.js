import React, { useState, useEffect } from "react";
import Input from "../input";
import Select from "../select";
import CloseIcon from "../icons/close.svg";
import Image from "next/image";
import moment from "moment";

const Form = ({ close, expData, setExpId }) => {
  const Bank = [
    { name: "Barclays", value: "barclays", id: 1 },
    { name: "Monzo", value: "monzo", id: 2 },
    { name: "Aqua", value: "aqua", id: 3 },
    { name: "Lloyds", value: "lloyds", id: 4 },
    { name: "Viji Monzo", value: "vijimonzo", id: 5 },
  ];
  const TxnType = [
    { name: "Card", value: "card", id: 6 },
    { name: "Direct Debit", value: "directdebit", id: 7 },
    { name: "Online", value: "online", id: 8 },
    { name: "Standing Order", value: "standingorder", id: 9 },
  ];
  const Category = [
    { name: "Utilities", value: "utilities", id: 10 },
    { name: "Groceries", value: "groceries", id: 11 },
    { name: "Food", value: "food", id: 12 },
    { name: "Travel", value: "travel", id: 13 },
    { name: "Clothing", value: "clothing", id: 14 },
    { name: "Entertainment", value: "entertainment", id: 15 },
    { name: "Others", value: "others", id: 16 },
  ];

  const [expense, setExpense] = useState({
    item: "",
    bank: "",
    txnType: "",
    category: "",
    date: moment().format("yyyy-MM-DD"),
    amount: 0,
  });

  const OnChange = (value, name) => {
    console.log("value", value);
    setExpense((ps) => {
      return {
        ...ps,
        [name]: value,
      };
    });
  };

  const onSubmit = async (e) => {
    console.log(expense);
    // e.preventDefault();

    if (expData && Object.keys(expData).includes("_id")) {
      const res = {
        ...expense,
        date: new Date(expense.date),
        amount: Number(expense.amount),
      };

      await fetch(`/api/expense/${expData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(res),
      });
      setExpense({
        item: "",
        bank: "",
        txnType: "",
        category: "",
        date: moment().format("yyyy-MM-DD"),
        amount: 0,
      });
      close();
      setExpId({});
    } else {
      const res = {
        ...expense,
        date: new Date(expense.date),
        amount: Number(expense.amount),
      };

      await fetch("/api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(res),
      });
      setExpense({
        item: "",
        bank: "",
        txnType: "",
        category: "",
        date: moment().format("yyyy-MM-DD"),
        amount: 0,
      });
    }
  };

  useEffect(() => {
    if (Object.keys(expData).includes("_id")) {
      console.log("inside", expData);
      setExpense({
        item: expData.item,
        bank: expData.bank,
        txnType: expData.txnType,
        category: expData.category,
        date: moment(expData.date).format("yyyy-MM-DD"),
        amount: expData.amount,
      });
    }
  }, [expData]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="font-semibold">
          {expData && Object.keys(expData).includes("_id")
            ? "Update Expense "
            : "Add expense"}
        </h1>
        <Image
          alt="closeicon"
          src={CloseIcon}
          width="20"
          onClick={close}
          className="cursor-pointer"
        />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Input
          label={"Name"}
          placeholder={"Enter shop name"}
          onChange={(e) => OnChange(e.target.value, "item")}
          value={expense.item}
        />
        <Select
          label={"Bank"}
          value={expense.bank}
          onChange={(e) => OnChange(e.target.value, "bank")}
          optionData={Bank}
        />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Select
          label={"Transition type"}
          value={expense.txnType}
          onChange={(e) => OnChange(e.target.value, "txnType")}
          optionData={TxnType}
        />
        <Select
          label={"Category"}
          value={expense.category}
          onChange={(e) => OnChange(e.target.value, "category")}
          optionData={Category}
        />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={expense.date}
            onChange={(e) => OnChange(e.target.value, "date")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={expense.amount}
            onChange={(e) => OnChange(e.target.value, "amount")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button
          className="text-sm font-semibold mr-auto ml-auto text-white-700 bg-blue-300 p-4 rounded-md cursor-pointer"
          onClick={() => onSubmit()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Form;
