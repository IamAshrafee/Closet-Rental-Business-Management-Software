import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import {
  FiUser,
  FiBox,
  FiCalendar,
  FiDollarSign,
  FiTruck,
  FiRepeat,
  FiFileText,
  FiHash,
  FiInfo,
} from "react-icons/fi";
import { getDatabase, ref, get } from "firebase/database";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center mb-4">
    {React.cloneElement(icon, { className: "mr-3 text-indigo-500", size: 18 })}
    <h3 className="text-base font-semibold text-gray-700 uppercase tracking-wider">
      {title}
    </h3>
  </div>
);

const InfoPair = ({ label, value, className = "" }) => (
  <div className={`flex justify-between items-center py-2 ${className}`}>
    <p className="text-gray-500 text-sm font-medium">{label}</p>
    <p className="font-medium text-gray-800 text-sm text-right">
      {typeof value === "string" || typeof value === "number"
        ? value
        : React.cloneElement(value)}
    </p>
  </div>
);

const BookingInformationPopup = ({ booking, onClose }) => {
  const [customer, setCustomer] = useState(null);
  const [detailedItems, setDetailedItems] = useState([]);
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);
  const currency = useSelector((state) => state.currency.value);
  const dateTimeFormat = useSelector((state) => state.dateTime.value);

  useEffect(() => {
    if (userInfo && booking) {
      // Fetch customer details
      const customerRef = ref(
        db,
        `users/${userInfo.uid}/customers/${booking.customerId}`
      );
      get(customerRef).then((snapshot) => {
        if (snapshot.exists()) {
          setCustomer(snapshot.val());
        }
      });

      // Fetch item details
      const itemPromises = booking.items.map((item) => {
        const itemRef = ref(db, `users/${userInfo.uid}/items/${item.itemId}`);
        return get(itemRef).then((snapshot) => ({
          ...item, // from booking
          ...(snapshot.exists() ? snapshot.val() : {}), // from items db
        }));
      });

      Promise.all(itemPromises).then((itemsData) => {
        setDetailedItems(itemsData);
      });
    }
  }, [db, userInfo, booking]);

  if (!booking) return null;

  const {
    id,
    deliveryType,
    deliveryDate,
    address,
    returnDate,
    deliveryCharge,
    otherCharges,
    advances,
    notes,
    totalAmount,
    dueAmount,
    status,
    startDate,
    endDate,
    createdAt,
  } = booking;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    switch (dateTimeFormat.dateFormat) {
      case "MM/DD/YYYY":
        return `${month}/${day}/${year}`;
      case "DD/MM/YYYY":
        return `${day}/${month}/${year}`;
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      default:
        return date.toLocaleDateString(dateTimeFormat.locale);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;

    switch (dateTimeFormat.timeFormat) {
      case "hh:mm A":
        return strTime;
      case "HH:mm":
        return `${date.getHours().toString().padStart(2, "0")}:${minutes}`;
      default:
        return date.toLocaleTimeString(dateTimeFormat.locale);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return `${formatDate(dateString)} ${formatTime(dateString)}`;
  };

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case "Waiting for Delivery":
        return "bg-blue-100 text-blue-800";
      case "Waiting for Return":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0  bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-hidden"
        onClick={onClose}
        style={{
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="bg-indigo-100 text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  <FiHash size={16} />
                </span>
                Booking #{id.slice(0, 8)}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Created: {formatDateTime(createdAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <IoMdClose size={22} />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-grow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Customer & Booking Details */}
            <div className="space-y-6">
              {customer && (
                <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                  <SectionHeader icon={<FiUser />} title="Customer" />
                  <div className="space-y-2">
                    <InfoPair label="Name" value={customer.name} />
                    <InfoPair label="Phone" value={customer.phone} />
                    <InfoPair
                      label="Address"
                      value={customer.address || "N/A"}
                    />
                  </div>
                </div>
              )}

              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <SectionHeader icon={<FiCalendar />} title="Timeline" />
                <div className="space-y-2">
                  <InfoPair
                    label="Status"
                    value={
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    }
                  />
                  <InfoPair
                    label="Delivery Type"
                    value={
                      deliveryType === "HomeDelivery"
                        ? "Home Delivery"
                        : "Customer Pickup"
                    }
                  />
                  <InfoPair
                    label="Delivery Date"
                    value={formatDate(deliveryDate)}
                  />
                  <InfoPair
                    label="Return Date"
                    value={formatDate(returnDate)}
                  />
                  <InfoPair
                    label="Rent Period"
                    value={`${formatDate(startDate)} → ${formatDate(endDate)}`}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Rented Items & Financials */}
            <div className="space-y-6">
              {detailedItems.length > 0 && (
                <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                  <SectionHeader
                    icon={<FiBox />}
                    title={`Items (${detailedItems.length})`}
                  />
                  <div className="space-y-3">
                    {detailedItems.map((item, index) => (
                      <div
                        key={`${item.itemId}-${index}`}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium text-gray-700 text-sm">
                            {item.name || "Unknown Item"}
                          </p>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                          {currency.symbol}
                          {parseFloat(item.calculatedPrice || 0).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <SectionHeader
                  icon={<FiDollarSign />}
                  title="Payment Summary"
                />
                <div className="space-y-2">
                  <InfoPair
                    label="Subtotal"
                    value={`${currency.symbol}${detailedItems
                      .reduce(
                        (sum, i) => sum + parseFloat(i.calculatedPrice || 0),
                        0
                      )
                      .toFixed(2)}`}
                  />
                  <InfoPair
                    label="Delivery Charge"
                    value={`${currency.symbol}${parseFloat(
                      deliveryCharge || 0
                    ).toFixed(2)}`}
                  />
                  <InfoPair
                    label="Other Charges"
                    value={`${currency.symbol}${parseFloat(
                      otherCharges || 0
                    ).toFixed(2)}`}
                  />

                  <div className="border-t border-gray-200 my-2 pt-2">
                    <InfoPair
                      label="Total"
                      value={`${currency.symbol}${parseFloat(
                        totalAmount || 0
                      ).toFixed(2)}`}
                      className="font-semibold"
                    />
                  </div>

                  {advances &&
                    advances.map((adv, index) => (
                      <InfoPair
                        key={`advance-${index}`}
                        label={`Paid on ${formatDate(adv.date)}`}
                        value={`- ${currency.symbol}${parseFloat(
                          adv.amount || 0
                        ).toFixed(2)}`}
                        className="text-green-600"
                      />
                    ))}

                  <div className="border-t border-gray-200 my-2 pt-2">
                    <InfoPair
                      label="Balance Due"
                      value={`${currency.symbol}${parseFloat(
                        dueAmount || 0
                      ).toFixed(2)}`}
                      className={`font-bold ${
                        dueAmount > 0 ? "text-red-600" : "text-green-600"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {notes && (
                <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                  <SectionHeader icon={<FiFileText />} title="Notes" />
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm whitespace-pre-line">
                      {notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingInformationPopup;
