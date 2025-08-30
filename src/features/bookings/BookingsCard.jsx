import React, { useState, useMemo } from 'react';
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
  FiChevronDown
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormatDate } from '../../hooks/useFormatDate';

const InfoLine = ({ icon, label, value, className = '', iconClass = '' }) => (
  <div className={`flex items-center text-sm ${className}`}>
    <div className={`flex-shrink-0 ${iconClass || 'text-gray-400'}`}>
      {icon}
    </div>
    <span className="ml-2 font-medium text-gray-500">{label}:</span>
    <span className="ml-2 text-gray-800">{value}</span>
  </div>
);

const BookingsCard = ({ booking, customer, onView, onEdit, onDelete, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(booking.status === 'Draft');
  const currency = useSelector((state) => state.currency.value);
  const { formatDate, formatTime } = useFormatDate();

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

  if (!customer) {
    // Render a lightweight placeholder or nothing if customer data is not yet available
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4" onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
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
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="px-4 pb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="border-t border-gray-200 pt-4">
              {/* Detailed Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Rent Period</h4>
                  <div className="space-y-1">
                    <InfoLine icon={<FiCalendar size={14} />} label="Start" value={formatDate(startDate)} />
                    <InfoLine icon={<FiCalendar size={14} />} label="End" value={formatDate(endDate)} />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Logistics</h4>
                  <div className="space-y-1">
                    <InfoLine icon={<FiTruck size={14} />} label="Delivery" value={formatDate(deliveryDate)} />
                    <InfoLine icon={<FiRepeat size={14} />} label="Return" value={formatDate(returnDate)} />
                  </div>
                </div>
              </div>

              {createdAt && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Booking Created</h4>
                  <p className="text-sm text-gray-700">{formatDateTime(createdAt)}</p>
                </div>
              )}

              {notes && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Notes</h4>
                  <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-100 p-3 rounded-md">{notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-100">
                <div className="relative w-full sm:w-auto">
                  <select
                    onClick={(e) => e.stopPropagation()}
                    onChange={handleStatusChange}
                    value={status}
                    className="appearance-none w-full bg-white border border-gray-300 rounded-lg shadow-sm pl-3 pr-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {statusOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="flex space-x-2 w-full sm:w-auto">
                  <button onClick={(e) => { e.stopPropagation(); onView(); }} className="flex-1 sm:flex-none flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"><FiEye className="mr-1.5" size={14} />View</button>
                  <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="flex-1 sm:flex-none flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"><FiEdit className="mr-1.5" size={14} />Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="flex-1 sm:flex-none flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-red-600 bg-white hover:bg-red-50"><FiTrash2 className="mr-1.5" size={14} />Delete</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(BookingsCard);