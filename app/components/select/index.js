import React from "react";

const Select = ({ label, optionData, onChange, value }) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <select
        onChange={onChange}
        value={value}
        className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option hidden>Select</option>
        {optionData.map((el, index) => (
          <option key={el.id}>{el.name}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
