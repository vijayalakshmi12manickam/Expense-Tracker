import React from "react";

const PopupLayout = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg relative">
        <div className="sm:flex sm:items-start">{children}</div>
      </div>
    </div>
  );
};

export default PopupLayout;
