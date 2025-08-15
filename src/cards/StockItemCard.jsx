import React from 'react';
import { FiEdit, FiTrash2, FiDollarSign, FiPackage, FiEye, FiCalendar } from 'react-icons/fi';

const StockItemCard = ({ item, onEdit, onDelete }) => {
  if (!item) {
    return null;
  }

  const {
    name,
    availability,
    sizeOption,
    sizeValue,
    sizeFrom,
    sizeTo,
    colors,
    long,
    rentOption,
    rentValue,
    rentPerDay,
    rentFrom,
    rentTo,
    description,
    target,
    rented,
    photo,
  } = item;

  const getPrice = () => {
    switch (rentOption) {
      case 'fixed':
        return `₹${rentValue}`;
      case 'per-day':
        return `₹${rentPerDay}/day`;
      case 'range':
        return `₹${rentFrom} - ₹${rentTo}`;
      default:
        return 'N/A';
    }
  };

  const getSize = () => {
    switch (sizeOption) {
      case 'fixed':
        return sizeValue;
      case 'range':
        return `${sizeFrom} - ${sizeTo}`;
      case 'free':
        return 'Free size';
      default:
        return 'N/A';
    }
  };

  const progress = rented && target ? Math.min((rented / target) * 100, 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1 flex flex-col md:flex-row h-full">
      {/* Image Section */}
      <div className="md:w-2/5 lg:w-1/3 relative overflow-hidden bg-gray-100">
        <img 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          src={photo} 
          alt={name} 
        />
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
          availability === 'available' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {availability}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="md:w-3/5 lg:w-2/3 p-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-800 truncate pr-2">{name}</h3>
            <div className="flex space-x-2">
              <button onClick={onEdit} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <FiEdit className="text-gray-600" />
              </button>
              <button onClick={onDelete} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                <FiTrash2 className="text-red-500" />
              </button>
            </div>
          </div>
          
          {/* Price */}
          <div className="flex items-center mb-4">
            <FiDollarSign className="text-indigo-600 mr-1" />
            <span className="text-2xl font-bold text-gray-800">{getPrice()}</span>
            {rentOption === 'per-day' && (
              <span className="text-sm text-gray-500 ml-2 flex items-center">
                <FiCalendar className="mr-1" /> per day
              </span>
            )}
          </div>
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center">
              <FiPackage className="text-gray-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Size</p>
                <p className="font-medium text-gray-800">{getSize()}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: colors }}></div>
              <div>
                <p className="text-xs text-gray-500">Color</p>
                <p className="font-medium text-gray-800">{colors}</p>
              </div>
            </div>
            
            {long && (
              <div className="flex items-center">
                <FiEye className="text-gray-500 mr-2" />
                <div>
                  <p className="text-xs text-gray-500">Length</p>
                  <p className="font-medium text-gray-800">{long}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        </div>
        
        {/* Progress Section */}
        {target && (
          <div className="mt-auto">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Rental Progress</span>
              <span className="text-sm font-medium text-gray-700">{rented || 0} / {target}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-right mt-1">
              <span className="text-xs text-gray-500">{Math.round(progress)}% rented</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockItemCard;