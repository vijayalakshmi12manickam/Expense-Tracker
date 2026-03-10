"use client";

import React, { useState } from "react";
import Input from "../input";
import moment from "moment";
import Select from "../select";
import { splitTypeOption, categories } from "../../constant/constant";
import Image from "next/image";
import CloseIcon from "../../components/icons/close.svg";

const MultiSelectInput = ({ array, label, placeholder, keyDown }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 border border-gray-300 rounded-lg px-2 py-2">
        {array.length
          ? array.map((el) => (
              <span
                key={el.name}
                className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full flex items-center"
              >
                {el.name}
                <button
                  type="button"
                  //onClick={() => removeTag(tag)}
                  className="ml-1 text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))
          : ""}
        <input
          type="text"
          placeholder={placeholder}
          onKeyDown={keyDown}
          className="flex-grow outline-none border-none"
        />
      </div>
    </div>
  );
};

const SharedExpensesForm = ({ closeOnClick }) => {
  const [participants, setParticipants] = useState([
    { name: "You", share: 1, amount: 0 },
  ]);
  const [value, setValue] = useState({
    item: "",
    bank: "shared",
    txnType: "shared",
    category: "",
    amount: 0,
    date: moment().format("yyyy-MM-DD"),
    isShared: true,
    paidBy: "",
    splitType: "",
    totalAmount: "",
  });
  const [tags, setTags] = useState([]);

  const SplitTypeChange = (value) => {
    setValue((ps) => {
      return {
        ...ps,
        splitType: value,
      };
    });

    if (value) {
      let copyArray = JSON.parse(JSON.stringify(participants));
      let array = [];
      array = copyArray.map((el) => {
        return {
          ...el,
          share: 1,
          amount: 0,
        };
      });
      console.log("array", array);
      setParticipants(array);
    }

    // if(value === "equal"){
    //   set
    // }
  };

  const handleChange = (value, type) => {
    setValue((ps) => {
      return {
        ...ps,
        [type]: value,
      };
    });
  };

  const customOption = (option) => {
    const data = option.map((op, index) => {
      return {
        id: `paid${index}`,
        value: op.name,
        name: op.name,
      };
    });

    return data;
  };

  const handleParKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (!value) return;
      const exists = participants.some(
        (p) => p.name.toLowerCase() === value.toLowerCase(),
      );

      if (!exists) {
        setParticipants([
          ...participants,
          { name: value, share: 1, amount: 0 },
        ]);
      }

      e.target.value = "";
      //   if (value && !participants.includes(value)) {
      //     setParticipants([...participants, { name: value }]);
      //     e.target.value = "";
      //   }
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        e.target.value = "";
      }
    }
  };

  const splitArrayOnClick = (value, index, name) => {
    // setSplits(ps, ...value);
    const newParticipants = [...participants];
    newParticipants[index][name] = value;

    setParticipants(newParticipants);
  };

  console.log({ ...value, participants });

  const participantsUpdate = (participants) => {
    const newParticipants = JSON.parse(JSON.stringify(participants));
    if (value.splitType === "equal") {
      return newParticipants.map((par) => {
        return { ...par, amount: value.totalAmount / participants.length };
      });
    } else if (value.splitType === "shares") {
      return newParticipants.map((par) => {
        return {
          ...par,
          amount: (
            (Number(par.share) / totalShares) *
            value.totalAmount
          ).toFixed(2),
        };
      });
    } else {
      return newParticipants;
    }
  };

  const onSubmit = () => {
    // console.log("fghjkl", participants, value);
    const res = {
      ...value,
      participants: participantsUpdate(participants),
      amount: participantsUpdate(participants)[0]["amount"],
      date: new Date(value.date),
      tags: tags,
      totalAmount: Number(value.totalAmount),
    };

    fetch("/api/expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(res),
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const totalCustom = participants.reduce(
    (sum, p) => sum + Number(p.amount),
    0,
  );

  const totalShares = participants.reduce((sum, p) => sum + Number(p.share), 0);

  // if (totalCustom !== Number(value.amount)) {
  //   alert("Split must equal total amount");
  // }

  // useEffect(() => {

  // },[])

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div>
      <div className="mb-3 flex justify-between">
        <h2 className="font-semibold">Add Shared Expense</h2>
        <Image
          src={CloseIcon}
          alt="close"
          width="20"
          onClick={closeOnClick}
          className="cursor-pointer"
        />
      </div>
      {/* <form onSubmit={() => onSubmit()}> */}
      <div className="grid mb-5">
        <MultiSelectInput
          array={participants}
          setArray={setParticipants}
          label={"Participants"}
          placeholder={"Enter participants"}
          keyDown={handleParKeyDown}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input
            label="Name"
            placeholder="Enter shop name"
            value={value.item}
            onChange={(e) => handleChange(e.target.value, "item")}
          />
        </div>
        <div>
          <Select
            label={"Category"}
            value={value.category}
            optionData={categories}
            onChange={(e) => handleChange(e.target.value, "category")}
          />
        </div>
        <div className="col-span-2 mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 border border-gray-300 rounded-lg px-2 py-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-red-500 font-bold cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add tags..."
              onKeyDown={handleTagKeyDown}
              className="flex-grow outline-none border-none"
            />
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={value.date}
            onChange={(e) => handleChange(e.target.value, "date")}
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
            value={value.totalAmount}
            onChange={(e) => handleChange(e.target.value, "totalAmount")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <Select
            label={"Paid By"}
            value={value.paidBy}
            optionData={customOption(participants)}
            onChange={(e) => handleChange(e.target.value, "paidBy")}
          />
        </div>
        <div>
          <Select
            label={"Split Type"}
            value={value.splitType}
            optionData={splitTypeOption}
            onChange={(e) => SplitTypeChange(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2">
        {value.splitType === "equal" ? (
          <div className="mb-2 flex flex-col items-center col-span-2">
            <p>{value.totalAmount / participants.length} / person</p>
            <p className="text-xs text-gray-600">
              ({participants.length} persons)
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
      {value.splitType == "custom" || value.splitType == "shares" ? (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <>
              {participants.map((person, index) => (
                <>
                  <div key={index}>{person.name}</div>
                  {value.splitType === "shares" ? (
                    <div className=" text-xs text-gray-600">
                      {(
                        (Number(person.share) / totalShares) *
                        value.totalAmount
                      ).toFixed(2)}
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ))}
            </>
          </div>
          <div>
            {value.splitType === "shares" ? (
              <>
                {participants.map((person, index) => (
                  <div key={index} className="mb-2">
                    {/* <div>{person.name}</div> */}
                    <div>
                      <input
                        type="number"
                        placeholder="1"
                        value={participants[index]["share"]}
                        onChange={(e) =>
                          splitArrayOnClick(
                            Number(e.target.value),
                            index,
                            "share",
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              ""
            )}
            {value.splitType === "custom" ? (
              <>
                {participants.map((person, index) => (
                  <div key={index}>
                    {/* <div>{person.name}</div> */}
                    <div>
                      <input
                        type="number"
                        placeholder="1"
                        value={participants[index]["amount"]}
                        onChange={(e) =>
                          splitArrayOnClick(
                            Number(e.target.value),
                            index,
                            "amount",
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="flex justify-between items-center mt-3">
        <button
          className="text-sm font-semibold mr-auto ml-auto text-white-700 bg-blue-300 p-4 rounded-md cursor-pointer"
          onClick={() => onSubmit()}
        >
          Submit
        </button>
      </div>
      {/* </form> */}
    </div>
  );
};

export default SharedExpensesForm;
