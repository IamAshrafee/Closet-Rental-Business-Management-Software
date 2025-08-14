import { FaUserFriends, FaSignOutAlt } from "react-icons/fa";
import { MdInventory, MdSpaceDashboard } from "react-icons/md";
import React, { useState, useRef } from "react";
import { NavLink } from "react-router";
import { FiMenu } from "react-icons/fi";

const SidebarContent = ({ onLinkClick, activeLink, normalLink }) => (
  <div className="h-full w-full pl-7 py-7 border-r border-r-gray-200 flex flex-col justify-between">
    <div>
      <div className="pr-7 mb-10">
        <p className="font-poppins text-2xl font-bold text-gray-800">Rentiva - Rental</p>
        <p className="font-poppins text-[14px] text-gray-600">Business Management</p>
      </div>
      <div className="flex flex-col gap-0.5">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
          onClick={onLinkClick}
        >
          <MdSpaceDashboard size={30} />
          <p className="font-poppins text-[18px]">Dashboard</p>
        </NavLink>
        <NavLink
          to="/stock"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
          onClick={onLinkClick}
        >
          <MdInventory size={28} />
          <p className="font-poppins text-[18px]">Stock</p>
        </NavLink>
        <NavLink
          to="/customers"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
          onClick={onLinkClick}
        >
          <FaUserFriends size={28} />
          <p className="font-poppins text-[18px]">Customers</p>
        </NavLink>
        <NavLink
          to="/bookings"
          className={({ isActive }) => (isActive ? activeLink : normalLink)}
          onClick={onLinkClick}
        >
          <FaUserFriends size={28} />
          <p className="font-poppins text-[18px]">Bookings</p>
        </NavLink>
      </div>
    </div>
    <div>
      <div className="flex flex-row gap-3 items-center pl-5 pr-5 hover:bg-gray-100 rounded-l-2xl w-full py-3.5 cursor-pointer">
        <FaSignOutAlt size={28} />
        <p className="font-poppins text-[18px]">Log Out</p>
      </div>
    </div>
  </div>
);

const Sidebar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const activeLink = "flex flex-row gap-3 items-center pl-5 pr-5 bg-gray-100 rounded-l-2xl w-full py-3.5 cursor-pointer border-r-4 border-r-gray-800";
  const normalLink = "flex flex-row gap-3 items-center pl-5 pr-5 hover:bg-gray-100 rounded-l-2xl w-full py-3.5 cursor-pointer";

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-shrink-0 border-r border-gray-200">
        <SidebarContent activeLink={activeLink} normalLink={normalLink} />
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-5 right-5 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <SidebarContent
          activeLink={activeLink}
          normalLink={normalLink}
          onLinkClick={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="p-5 md:p-7 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;