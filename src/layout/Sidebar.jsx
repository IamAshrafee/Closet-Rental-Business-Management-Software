import { FaUserFriends, FaSignOutAlt } from "react-icons/fa";
import { MdInventory, MdSpaceDashboard, MdNotificationsActive } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { userLogInfo } from "../slice/userSlice";
import { motion, AnimatePresence } from "framer-motion";

const SidebarContent = ({ onLinkClick, activeLink, normalLink }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const companyName = useSelector((state) => state.company.value);

  const handleLogout = () => {
    dispatch(userLogInfo(null));
    localStorage.removeItem("userLoginInfo");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", icon: <MdSpaceDashboard size={22} />, label: "Dashboard" },
    { path: "/stock", icon: <MdInventory size={20} />, label: "Stock" },
    { path: "/customers", icon: <FaUserFriends size={20} />, label: "Customers" },
    { path: "/bookings", icon: <FaUserFriends size={20} />, label: "Bookings" },
    { path: "/reminders", icon: <MdNotificationsActive size={20} />, label: "Reminders" },
    { path: "/settings", icon: <IoMdSettings size={20} />, label: "Settings" },
  ];

  return (
    <div className="h-full w-full pl-5 py-6 pr-2 border-r border-r-gray-200 flex flex-col justify-between">
      <div>
        <div className="pr-5 mb-8">
          <p className="font-poppins text-xl font-bold text-gray-800">{companyName}</p>
          <p className="font-poppins text-xs text-gray-500">Business Management</p>
        </div>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? activeLink : normalLink)}
              onClick={onLinkClick}
            >
              <span className="text-gray-600">{item.icon}</span>
              <p className="font-poppins text-[15px]">{item.label}</p>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <button
          onClick={handleLogout}
          className={`${normalLink} text-red-600 hover:bg-red-50`}
        >
          <FaSignOutAlt size={18} />
          <p className="font-poppins text-[15px]">Log Out</p>
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const activeLink = "flex flex-row gap-3 items-center pl-4 pr-4 py-2.5 bg-indigo-50 rounded-lg text-indigo-700 font-medium";
  const normalLink = "flex flex-row gap-3 items-center pl-4 pr-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors";

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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-shrink-0 border-r border-gray-200 bg-white">
        <SidebarContent activeLink={activeLink} normalLink={normalLink} />
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white shadow-md border border-gray-200"
        >
          {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "tween" }}
            className="md:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 shadow-xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <SidebarContent
              activeLink={activeLink}
              normalLink={normalLink}
              onLinkClick={() => setIsSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="p-4 md:p-6 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;