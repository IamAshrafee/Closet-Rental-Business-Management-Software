import { FaUserFriends, FaSignOutAlt, FaUserTie } from "react-icons/fa";
import { MdInventory, MdSpaceDashboard, MdNotificationsActive } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiDollarSign, FiCheckSquare } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { userLogInfo } from "../store/slices/userSlice";
import { motion, AnimatePresence } from "framer-motion";

const SidebarContent = ({ onLinkClick, isMobile = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const companyName = useSelector((state) => state.company.value);

  const handleLogout = () => {
    dispatch(userLogInfo(null));
    localStorage.removeItem("userLoginInfo");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", icon: <MdSpaceDashboard size={20} />, label: "Dashboard" },
    { path: "/stock", icon: <MdInventory size={20} />, label: "Stock" },
    { path: "/customers", icon: <FaUserFriends size={18} />, label: "Customers" },
    { path: "/partners", icon: <FaUserTie size={18} />, label: "Partners" },
    { path: "/payouts", icon: <FiDollarSign size={18} />, label: "Payouts" },
    { path: "/bookings", icon: <FaUserFriends size={18} />, label: "Bookings" },
    { path: "/reminders", icon: <MdNotificationsActive size={18} />, label: "Reminders" },
    { path: "/todo", icon: <FiCheckSquare size={18} />, label: "Todo" },
    { path: "/settings", icon: <IoMdSettings size={18} />, label: "Settings" },
  ];

  const activeLink = "flex flex-row gap-3 items-center pl-4 pr-4 py-2.5 bg-indigo-50 rounded-lg text-indigo-700 font-medium";
  const normalLink = "flex flex-row gap-3 items-center pl-4 pr-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors";

  return (
    <div className={`h-full w-full ${isMobile ? 'px-4' : 'pl-5 pr-2'} py-6 border-r border-r-gray-100 flex flex-col justify-between`}>
      <div>
        <div className={`${isMobile ? 'px-2' : 'pr-5'} mb-8`}>
          <p className="font-poppins text-xl font-bold text-gray-800 truncate">{companyName}</p>
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
              <p className="font-poppins text-sm">{item.label}</p>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <button
          onClick={handleLogout}
          className={`${normalLink} text-red-600 hover:bg-red-50 w-full`}
        >
          <FaSignOutAlt size={16} />
          <p className="font-poppins text-sm">Log Out</p>
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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
      {/* Desktop Sidebar - Hidden on tablets */}
      <div className="hidden lg:flex w-55 flex-shrink-0 border-r border-gray-100 bg-white">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white shadow-md border border-gray-200"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 , animationDuration: 0.1}}
            animate={{ opacity: 1 , animationDuration: 0.1}}
            
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
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
            transition={{ type: "spring", damping: 25 }}
            className="lg:hidden fixed inset-y-0 left-0 w-65 bg-white z-50 shadow-xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <SidebarContent 
              onLinkClick={() => setIsSidebarOpen(false)} 
              isMobile={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto lg:ml-0">
        <div className="p-4 md:p-5 lg:p-6 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;