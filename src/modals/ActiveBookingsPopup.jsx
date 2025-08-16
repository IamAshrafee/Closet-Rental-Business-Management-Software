import React from "react";
import {
  FiX,
  FiUser,
  FiCalendar,
  FiInfo,
  FiArrowRight,
  FiPackage,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useFormatDate } from "../hooks/useFormatDate";

const ActiveBookingsPopup = ({
  isOpen,
  onClose,
  bookings,
  item,
  onViewDetails,
}) => {
  if (!isOpen) return null;
  const formatDate = useFormatDate();

  const handleViewDetailsClick = (e, booking) => {
    e.stopPropagation();
    onViewDetails(booking);
    onClose(); // Close the current popup
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
          style={{
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-md overflow-hidden mr-4">
                  <img
                    src={
                      item.photo ||
                      "https://via.placeholder.com/96x160?text=No+Image"
                    }
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Active Bookings
                  </h2>
                  <p className="text-sm text-gray-500 truncate">{item.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              {bookings.length > 0 ? (
                <ul className="space-y-4">
                  {bookings.map((booking) => (
                    <li
                      key={booking.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-indigo-200 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {booking.customerName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Booking #{booking.id.slice(0, 6)}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FiUser
                            className="mr-2 text-indigo-500 flex-shrink-0"
                            size={14}
                          />
                          <span className="truncate">
                            {booking.customerName}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FiPackage
                            className="mr-2 text-indigo-500 flex-shrink-0"
                            size={14}
                          />
                          <span>{booking.items.length} item(s)</span>
                        </div>
                        <div className="flex items-center">
                          <FiCalendar
                            className="mr-2 text-green-500 flex-shrink-0"
                            size={14}
                          />
                          <span>
                            Delivery: {formatDate(booking.deliveryDate)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FiCalendar
                            className="mr-2 text-red-500 flex-shrink-0"
                            size={14}
                          />
                          <span>Return: {formatDate(booking.returnDate)}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={(e) => handleViewDetailsClick(e, booking)}
                          className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          View Details{" "}
                          <FiArrowRight className="ml-1" size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-700">
                    No Active Bookings
                  </h3>
                  <p className="text-gray-500 mt-1">
                    This item is not part of any active bookings.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "Waiting for Delivery":
      return "bg-yellow-100 text-yellow-800";
    case "Ongoing":
      return "bg-blue-100 text-blue-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default ActiveBookingsPopup;
