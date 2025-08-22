import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiUser, 
  FiPhone, 
  FiCalendar, 
  FiTruck, 
  FiRepeat, 
  FiDollarSign,
  FiAlertCircle, 
  FiEye, 
  FiEdit, 
  FiTrash2,
  FiChevronDown,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import { ref, onValue } from 'firebase/database';
import { db } from '../../lib/firebase';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useFormatDate } from '../../hooks/useFormatDate';

const InfoLine = ({ icon, label, value, className = '', iconClass = '' }) => (
  <div className={`flex items-center text-sm ${className}`}>
    <div className={`flex-shrink-0  ${iconClass || 'text-gray-400'}`}>
      {icon}
    </div>
    <span className="ml-2 font-medium text-gray-500">{label}:</span>
    <span className="ml-2 text-gray-800">{value}</span>
  </div>
);

const BookingsCard = ({ booking, onView, onEdit, onDelete, onStatusChange }) => {
  const [customer, setCustomer] = useState(null);
  const [isExpanded, setIsExpanded] = useState(booking.status === 'Draft');
  const userInfo = useSelector((state) => state.userLogInfo.value);
  const currency = useSelector((state) => state.currency.value);
  const { formatDate, formatTime } = useFormatDate();

  useEffect(() => {
    if (userInfo && booking.customerId) {
      const customerRef = ref(db, `users/${userInfo.uid}/customers/${booking.customerId}`);
      const unsubscribe = onValue(customerRef, (snapshot) => {
        setCustomer(snapshot.val());
      });
      return () => unsubscribe();
    }
  }, [userInfo, booking.customerId]);

  const {
    deliveryDate,
    returnDate,
    startDate,
    endDate,
    notes,
    items = [],
    advances = [],
    deliveryCharge = 0,
    otherCharges = 0,
    status,
    createdAt
  } = booking;

  const totalRent = useMemo(() => 
    items.reduce((total, item) => total + (item.calculatedPrice || 0), 0), 
    [items]
  );

  const totalAdvance = useMemo(() => 
    advances.reduce((total, advance) => total + (Number(advance.amount) || 0), 0), 
    [advances]
  );

  const totalCharges = useMemo(() => 
    (Number(deliveryCharge) || 0) + (Number(otherCharges) || 0), 
    [deliveryCharge, otherCharges]
  );

  const totalAmount = useMemo(() => totalRent + totalCharges, [totalRent, totalCharges]);
  const dueAmount = useMemo(() => totalAmount - totalAdvance, [totalAmount, totalAdvance]);
  const isDue = dueAmount > 0;

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case 'Draft': return 'bg-gray-200 text-gray-800';
      case 'Waiting for Delivery': return 'bg-blue-100 text-blue-800';
      case 'Waiting for Return': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Postponed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString) => {
      if (!dateString) return 'N/A';
      return `${formatDate(dateString)} ${formatTime(dateString)}`;
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus && newStatus !== status) {
      onStatusChange(booking, newStatus);
    }
  };

  const statusOptions = ['Draft', 'Waiting for Delivery', 'Waiting for Return', 'Completed', 'Postponed'];

  if (!customer) return null;

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 overflow-hidden p-4"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      role="button"
      tabIndex="0"
      onClick={() => setIsExpanded(!isExpanded)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }
      }}
    >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
            <p className="text-sm text-gray-500 flex items-center">
              <FiPhone className="mr-1.5" size={14} />
              {customer.phone}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>

        {/* Quick Info */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
          <InfoLine 
            icon={<FiTruck size={14} />} 
            label="Delivery" 
            value={formatDate(deliveryDate)} 
            iconClass="text-blue-500" 
          />
          <InfoLine 
            icon={<FiRepeat size={14} />} 
            label="Return" 
            value={formatDate(returnDate)} 
            iconClass="text-red-500" 
          />
        </div>

        {/* Financial Summary */}
        <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <FiDollarSign className="text-gray-500 mr-2" size={14} />
            <span className="font-medium">{currency.symbol}{totalAmount.toFixed(2)}</span>
          </div>
          {isDue && (
            <div className="flex items-center text-red-600 text-sm font-medium">
              <FiAlertCircle className="mr-1" size={14} />
              <span>{currency.symbol}{dueAmount.toFixed(2)} due</span>
            </div>
          )}
        </div>

      {/* Expanded Details */}
      {isExpanded && (
        <motion.div 
          className="p-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="border-t border-gray-200 pt-4 mb-4">
            {/* Detailed Dates */}
            <div className="grid grid-cols-2 gap-0 mb-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Rent Period</h4>
                <div className="space-y-1">
                  <InfoLine icon={<FiCalendar size={14} />} label="Start" value={formatDate(startDate)} />
                  <InfoLine icon={<FiCalendar size={14} />} label="End" value={formatDate(endDate)} />
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Logistics</h4>
                <div className="space-y-1">
                  <InfoLine icon={<FiTruck size={14} />} label="Delivery" value={formatDate(deliveryDate)} />
                  <InfoLine icon={<FiRepeat size={14} />} label="Return" value={formatDate(returnDate)} />
                </div>
              </div>
            </div>

            {/* Created At */}
            {createdAt && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Booking Created</h4>
                <p className="text-sm text-gray-700">
                  {formatDateTime(createdAt)}
                </p>
              </div>
            )}

            {/* Notes */}
            {notes && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Notes</h4>
                <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-100 p-3 rounded-md">
                  {notes}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="relative w-full sm:w-auto">
              <select
                onClick={(e) => e.stopPropagation()}
                onChange={handleStatusChange}
                value={status}
                className="appearance-none w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex space-x-2 w-full sm:w-auto">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiEye className="mr-1.5" size={14} />
                View
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
              >
                <FiEdit className="mr-1.5" size={14} />
                Edit
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-red-600 bg-white hover:bg-red-50"
              >
                <FiTrash2 className="mr-1.5" size={14} />
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer - Quick Actions */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
        <div className="flex justify-between items-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            {isExpanded ? 'Show less' : 'Show details'}
          </button>
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${isDue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {isDue ? 'Payment Due' : 'Paid'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(BookingsCard);