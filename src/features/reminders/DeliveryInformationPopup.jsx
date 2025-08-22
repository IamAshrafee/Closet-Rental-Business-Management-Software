import React from "react";
import { IoMdClose } from "react-icons/io";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiPackage,
  FiInfo,
} from "react-icons/fi";
import { useSelector } from "react-redux";

import { useFormatDate } from "../../hooks/useFormatDate";

const DeliveryInformationPopup = ({ booking, stockItems, onClose }) => {
  const currency = useSelector((state) => state.currency.value);
  const { formatDate } = useFormatDate();
  if (!booking) {
    return null;
  }

  const getItemDetails = (itemId) => {
    const item = stockItems.find((item) => item.id === itemId);
    return item || {};
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 bg-opacity-60 flex justify-center items-center backdrop-blur-sm z-50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-11/12 md:w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Delivery Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-200"
            aria-label="Close form"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-grow space-y-6">
          {/* Customer Information */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-blue-800 flex items-center">
              <FiUser className="mr-2" /> Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
              <p className="flex items-center">
                <FiInfo className="mr-2 text-blue-500" /> <strong>Name:</strong>{" "}
                {booking.customerName}
              </p>
              <p className="flex items-center">
                <FiPhone className="mr-2 text-blue-500" />{" "}
                <strong>Phone:</strong> {booking.customerPhone}
              </p>
              <p className="flex items-center sm:col-span-2">
                <FiMapPin className="mr-2 text-blue-500" />{" "}
                <strong>Address:</strong> {booking.address}
              </p>
            </div>
          </div>

          {/* Booking Information */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center">
              <FiCalendar className="mr-2" /> Booking Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
              <p className="flex items-center">
                <FiInfo className="mr-2 text-green-500" />{" "}
                <strong>Booking ID:</strong> {booking.id}
              </p>
              <p className="flex items-center">
                <FiCalendar className="mr-2 text-green-500" />{" "}
                <strong>Delivery Date:</strong>{" "}
                {formatDate(booking.deliveryDate)}
              </p>
              <p className="flex items-center">
                <FiCalendar className="mr-2 text-green-500" />{" "}
                <strong>Return Date:</strong> {formatDate(booking.returnDate)}
              </p>
              <p className="flex items-center">
                <FiDollarSign className="mr-2 text-green-500" />{" "}
                <strong>Total Amount:</strong> {currency.symbol}
                {booking.totalAmount?.toFixed(2)}
              </p>
              <p className="flex items-center">
                <FiDollarSign className="mr-2 text-green-500" />{" "}
                <strong>Due Amount:</strong> {currency.symbol}
                {booking.dueAmount?.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Items to be Delivered */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-purple-800 flex items-center">
              <FiPackage className="mr-2" /> Items to be Delivered
            </h3>
            <div className="space-y-3">
              {booking.items.map((item, index) => {
                const itemDetails = getItemDetails(item.itemId);
                return (
                  <div
                    key={index}
                    className="flex items-center bg-white p-3 rounded-lg border border-gray-200"
                  >
                    <img
                      src={
                        itemDetails.photo || "/assets/default-item-image.svg"
                      }
                      alt={itemDetails.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800 text-sm">
                        {itemDetails.name || "Unknown Item"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {itemDetails.category || "Uncategorized"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInformationPopup;
