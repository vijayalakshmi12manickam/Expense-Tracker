"use client";

import React, { useState } from "react";
import Select from "../select";
import Input from "../input";
import moment from "moment";
import CloseIcon from "../icons/close.svg";
import Image from "next/image";
import { categories } from "../../constant/constant";

const BudgetForm = ({ close }) => {
  const [budget, setBudget] = useState({
    type: "",
    limit: 0,
    name: "",
    startDate: moment().format("yyyy-MM-DD"),
    endDate: moment().format("yyyy-MM-DD"),
    currency: "",
  });

  const typeData = [
    { name: "Category", value: "category", id: 56 },
    { name: "Tag", value: "tag", id: 57 },
  ];

  const currencyData = [
    { name: "British Pound(£)", value: "GBP", id: 58 },
    { name: "Indian Rupees(₹)", value: "INR", id: 59 },
  ];

  const OnChange = (value, name) => {
    console.log("value", value);
    setBudget((ps) => {
      return {
        ...ps,
        [name]: value,
      };
    });
  };

  const handleSumbit = async () => {
    try {
      // console.log("data", budget);
      const res = await fetch("/api/budget", {
        method: "POST",
        body: JSON.stringify(budget),
      });
      const data = await res.json();

      if (data) {
        console.log("data", data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={() => handleSumbit()}>
      <div className="mb-3 flex justify-between">
        <h2 className="font-semibold">Add Budget</h2>
        <Image
          src={CloseIcon}
          alt="close"
          width="20"
          onClick={close}
          className="cursor-pointer"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <Select
          label={"Type"}
          value={budget.type}
          optionData={typeData}
          onChange={(e) => OnChange(e.target.value, "type")}
        />
        {budget.type === "tag" ? (
          <Input
            label={"Name"}
            placeholder={"Enter Name"}
            value={budget.name}
            onChange={(e) => OnChange(e.target.value, "name")}
          />
        ) : (
          <Select
            label={"Name"}
            value={budget.name}
            optionData={categories}
            onChange={(e) => OnChange(e.target.value, "name")}
          />
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Budget Limit
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={budget.limit}
            onChange={(e) => OnChange(e.target.value, "limit")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Select
          label={"Currency"}
          value={budget.currency}
          optionData={currencyData}
          onChange={(e) => OnChange(e.target.value, "currency")}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={budget.startDate}
            onChange={(e) => OnChange(e.target.value, "startDate")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={budget.endDate}
            onChange={(e) => OnChange(e.target.value, "endDate")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="text-sm font-semibold mr-auto ml-auto text-white-700 bg-blue-300 p-4 rounded-md cursor-pointer"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;
