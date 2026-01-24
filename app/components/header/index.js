import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div>
      <header className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
        <div>
          <Link href={"/"} className="text-lg font-semibold text-slate-800">
            Expense Tracker
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Header;
