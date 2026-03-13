import React from "react";

const Input = ({ label, placeholder, onChange, value }) => {
  return (
    <div className="">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        key={label}
        name={label}
        onChange={onChange}
        value={value}
        className="w-full text-gray-700 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Input;
