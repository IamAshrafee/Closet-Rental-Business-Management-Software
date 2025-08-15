import React from 'react';
import { FiEdit, FiTrash2, FiPhone, FiMapPin, FiUser, FiLink, FiCreditCard, FiDollarSign, FiPackage, FiActivity, FiAlertCircle, FiBookOpen, FiClock } from 'react-icons/fi';

const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return new Date(date).toLocaleDateString();
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};

const CustomerCard = ({ customer, onEdit, onDelete, onHistoryClick }) => {
  if (!customer) {
    return null;
  }

  const {
    name,
    phone,
    address,
    totalSpent,
    totalBookings,
    activeBookings,
    totalOutstanding,
    createdAt
  } = customer;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1 flex flex-col h-full">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold font-poppins mb-3">{name}</h3>
          <div className="flex space-x-2">
            <button onClick={onEdit} className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
              <FiEdit className="text-gray-600" />
            </button>
            <button onClick={onDelete} className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
              <FiTrash2 className="text-red-500" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-2">
          <FiPhone className="mr-3" />
          <span>{phone}</span>
        </div>
        
        <div className="flex items-start text-gray-600 mb-4">
          <FiMapPin className="mr-3 mt-1" />
          <span className="flex-1">{address}</span>
        </div>
        {createdAt && (
          <div className="flex items-center text-gray-500 text-xs">
            <FiClock className="mr-1.5" />
            Member since {timeSince(createdAt)}
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 border-t">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-semibold text-gray-500">Status</h4>
          <button onClick={onHistoryClick} className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors">
            <FiBookOpen className="mr-1.5" /> History
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <FiDollarSign className="text-green-500 mr-2" />
            <div>
              <p className="text-gray-500">Spent</p>
              <p className="font-bold text-gray-800">₹{totalSpent?.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FiPackage className="text-blue-500 mr-2" />
            <div>
              <p className="text-gray-500">Bookings</p>
              <p className="font-bold text-gray-800">{totalBookings}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FiActivity className="text-yellow-500 mr-2" />
            <div>
              <p className="text-gray-500">Active</p>
              <p className="font-bold text-gray-800">{activeBookings}</p>
            </div>
          </div>
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" />
            <div>
              <p className="text-gray-500">Outstanding</p>
              <p className="font-bold text-gray-800">₹{totalOutstanding?.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
