import { FaUserFriends } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import React from "react";
import { NavLink } from "react-router";

const Sidebar = ({ children }) => {
  const activeLink =
    "flex flex-row gap-3 items-center pl-10 bg-gray-100 rounded-l-2xl w-full py-3.5 cursor-pointer border-r-4 border-r-gray-800";
  const normalLink =
    "flex flex-row gap-3 items-center pl-10 hover:bg-gray-100 rounded-l-2xl w-full py-3.5 cursor-pointer";
  return (
    <div className="flex flex-row gap-10">
      <div className="h-[100dvh] pl-7 py-7 border-r border-r-gray-200 flex flex-col justify-start">
        <div className="flex-1 flex flex-col pr-7">
          <p className="font-poppins text-2xl font-bold text-gray-800">
            Rentiva - Rental
          </p>
          <p className="font-poppins text-[14px] text-gray-600">
            Business Management
          </p>
        </div>
        <div className="flex-3 flex flex-col gap-0.5 items-center ">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? activeLink : normalLink)}
          >
            <MdSpaceDashboard size={30} className="" />
            <p className="font-poppins text-[18px] text-gray-800">Dashboard</p>
          </NavLink>
          <NavLink
            to="/stock"
            className={({ isActive }) => (isActive ? activeLink : normalLink)}
          >
            <MdInventory size={28} className="" />
            <p className="font-poppins text-[18px] text-gray-800">Stock</p>
          </NavLink>
          <NavLink
            to="/customers"
            className={({ isActive }) => (isActive ? activeLink : normalLink)}
          >
            <FaUserFriends size={28} className="" />
            <p className="font-poppins text-[18px] text-gray-800">Customer</p>
          </NavLink>
        </div>
        <div className="flex-1">
          <div className="flex flex-row gap-3 items-center pl-10 hover:bg-gray-100 rounded-l-2xl w-full py-3.5 cursor-pointer">
            <FaSignOutAlt size={28} className="" />
            <p className="font-poppins text-[18px] text-gray-800">Log Out</p>
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Sidebar;
