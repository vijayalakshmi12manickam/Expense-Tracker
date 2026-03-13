"use client";

import React from "react";
import SettlementForm from "../form/SettlementForm";

const SettlementDrawer = ({ open, person, onClose, onSuccess }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-xl z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Settle with {person}</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <SettlementForm
            name={person}
            closeOnClick={onClose}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </>
  );
};

export default SettlementDrawer;
