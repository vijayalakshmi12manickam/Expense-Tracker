"use client";
import React, { useState } from "react";
import moment from "moment";
import Input from "../input";
import Image from "next/image";
import CloseICon from "../icons/close.svg";

const SettlementForm = ({ closeOnClick }) => {
  const [settlement, setSettlement] = useState({
    from: "",
    to: "",
    amount: 0,
    date: moment().format("yyyy-MM-DD"),
    note: "",
  });

  const OnChange = (value, name) => {
    console.log("value", value);
    setSettlement((ps) => {
      return {
        ...ps,
        [name]: value,
      };
    });
  };

  const onSubmit = async () => {
    try {
      console.log("data", settlement);
      const res = await fetch("/api/settlement", {
        method: "POST",
        body: JSON.stringify(settlement),
      });
      const data = await res.json();

      if (data) {
        console.log("data", data);
        setSettlement({
          from: "",
          to: "",
          amount: 0,
          date: moment().format("yyyy-MM-DD"),
          note: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="font-semibold">Settle Up</h1>
        <Image
          alt="closeicon"
          src={CloseICon}
          width="20"
          onClick={closeOnClick}
          className="cursor-pointer"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={"Payer"}
          placeholder={"Enter Payer Name"}
          onChange={(e) => OnChange(e.target.value, "from")}
          value={settlement.item}
        />
        <Input
          label={"Reciever"}
          placeholder={"Enter Reciever Name"}
          onChange={(e) => OnChange(e.target.value, "to")}
          value={settlement.item}
        />
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={settlement.date}
            onChange={(e) => OnChange(e.target.value, "date")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={settlement.amount}
            onChange={(e) => OnChange(e.target.value, "amount")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <Input
        label={"Notes"}
        placeholder={"Enter Settlement Notes"}
        onChange={(e) => OnChange(e.target.value, "note")}
        value={settlement.note}
      />
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

export default SettlementForm;
