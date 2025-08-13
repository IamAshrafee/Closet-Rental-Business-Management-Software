import { FaUserFriends } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import React from "react";

const Sidebar = ({ children }) => {
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
          <div className="flex flex-row gap-3 items-center pl-10 hover:bg-gray-100 rounded-l-2xl w-full py-3.5 cursor-pointer">
            <MdSpaceDashboard size={30} className="" />
            <p className="font-poppins text-[18px] text-gray-800">Dashboard</p>
          </div>
          <div className="flex flex-row gap-3 items-center pl-10 hover:bg-gray-100 rounded-l-2xl w-full py-3.5 cursor-pointer">
            <MdInventory size={28} className="" />
            <p className="font-poppins text-[18px] text-gray-800">Stock</p>
          </div>
          <div className="flex flex-row gap-3 items-center pl-10 hover:bg-gray-100 rounded-l-2xl w-full py-3.5 cursor-pointer">
            <FaUserFriends size={28} className="" />
            <p className="font-poppins text-[18px] text-gray-800">Customer</p>
          </div>
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
