"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import BurgerIcon from "../icons/hamburger.svg";
import DashboardIcon from "../icons/dashboard.svg";
import ProfileIcon from "../icons/profile.svg";
import ReportIcon from "../icons/report.svg";
import CoinIcon from "../icons/coins.svg";

const Header = () => {
  const [collapsed, setCollapsed] = useState(true);
  const NAV_ITEMS = [
    { label: "Dashboard", value: "/", image: DashboardIcon },
    { label: "Expenses", value: "/expenses", image: CoinIcon },
    { label: "Report", value: "/report", image: ReportIcon },
    { label: "Profile", value: "/profile", image: ProfileIcon },
  ];
  return (
    <div
      className={`relative flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Always-visible Toggle Button */}
      <button
        onClick={() => setCollapsed((ps) => !ps)}
        className="absolute -right-4 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md cursor-pointer"
      >
        <Image src={BurgerIcon} alt="burger-icon" width="20" />
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center border-b py-4">
        {collapsed ? (
          <span className="text-lg font-bold text-blue-600">P</span>
        ) : (
          <span className="text-xl font-bold text-blue-600">PaperTrail</span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="mt-4 flex flex-col space-y-1 px-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className="flex items-center space-x-3 rounded-md p-2 text-gray-700 hover:bg-blue-50"
          >
            <Image src={item.image} alt={"icon"} width="20" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Header;
