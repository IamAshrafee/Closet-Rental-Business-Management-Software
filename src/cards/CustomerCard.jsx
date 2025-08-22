import React from 'react';
import { 
  FiEdit, 
  FiTrash2, 
  FiPhone, 
  FiMapPin, 
  FiClock, 
  FiBookOpen, 
  FiDollarSign, 
  FiPackage, 
  FiActivity, 
  FiAlertCircle,
  FiUser,
  FiStar,
  FiCreditCard
} from 'react-icons/fi';
import { useSelector } from 'react-redux';

const timeSince = (dateString, dateFormat, locale) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];
  
  for (let interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      if (interval.label === 'year') {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        switch (dateFormat) {
          case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`;
          case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
          case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
          default:
            return date.toLocaleDateString(locale);
        }
      }
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
};

const StatItem = ({ icon, label, value, color }) => (
  <div className="flex items-center space-x-2">
    <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const CustomerCard = ({ customer, onEdit, onDelete, onHistoryClick }) => {
  const currency = useSelector((state) => state.currency.value);
  const dateTimeFormat = useSelector((state) => state.dateTime.value);
  if (!customer) return null;

  const {
    name,
    phone,
    address,
    totalSpent = 0,
    totalBookings = 0,
    activeBookings = 0,
    totalOutstanding = 0,
    createdAt,
    loyaltyPoints = 0,
    status,
  } = customer;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden border border-gray-100 hover:border-gray-200 flex flex-col h-full">
      {/* Header Section */}
      <div className="p-5 pb-3 flex-grow">
        {status === 'draft' && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-semibold">
            Draft
          </div>
        )}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
              <FiUser size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 font-poppins">{name}</h3>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <FiClock className="mr-1" size={12} />
                <span>Member since {timeSince(createdAt, dateTimeFormat.dateFormat, dateTimeFormat.locale)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <button 
              onClick={onEdit} 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-indigo-600"
              aria-label="Edit customer"
            >
              <FiEdit size={18} />
            </button>
            <button 
              onClick={onDelete} 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-red-600"
              aria-label="Delete customer"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="space-y-3 pl-2">
          <div className="flex items-center text-gray-600">
            <FiPhone className="mr-3 text-gray-500" size={16} />
            <a href={`tel:${phone}`} className="hover:text-indigo-600 transition-colors">
              {phone}
            </a>
          </div>
          
          <div className="flex items-start text-gray-600">
            <FiMapPin className="mr-3 mt-0.5 text-gray-500" size={16} />
            <span className="flex-1 text-sm">{address || 'No address provided'}</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 px-5 py-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium text-gray-700">Customer Stats</h4>
          <button 
            onClick={onHistoryClick} 
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <FiBookOpen className="mr-2" size={14} /> 
            View History
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <StatItem 
            icon={<FiDollarSign size={16} />} 
            label="Total Spent" 
            value={`${currency.symbol}${totalSpent.toFixed(2)}`} 
            color="green" 
          />
          <StatItem 
            icon={<FiPackage size={16} />} 
            label="Bookings" 
            value={totalBookings} 
            color="blue" 
          />
          <StatItem 
            icon={<FiActivity size={16} />} 
            label="Active" 
            value={activeBookings} 
            color="yellow" 
          />
          <StatItem 
            icon={<FiAlertCircle size={16} />} 
            label="Outstanding" 
            value={`${currency.symbol}${totalOutstanding.toFixed(2)}`} 
            color="red" 
          />
        </div>
        
        {/* Loyalty Points (optional) */}
        {loyaltyPoints > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <StatItem 
              icon={<FiStar size={16} />} 
              label="Loyalty Points" 
              value={loyaltyPoints} 
              color="purple" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCard;
