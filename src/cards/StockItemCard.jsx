import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const StockItemCard = ({ item }) => {
  if (!item) {
    return null; // Or a placeholder/error component
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
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1">
      <img className="w-full h-48 object-cover" src={photo} alt={name} />
      <div className="p-4">
        <h3 className="text-xl font-bold font-poppins mb-2">{name}</h3>
        <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-semibold ${availability === 'available' ? 'text-green-500' : 'text-red-500'}`}>
                {availability}
            </span>
            <span className="text-sm text-gray-600">Size: {getSize()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Color: {colors}</span>
            {long && <span className="text-sm text-gray-600">Long: {long}</span>}
        </div>
        
        <p className="text-gray-800 font-semibold text-lg mb-2">{getPrice()}</p>
        <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden">{description}</p>

        {target && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Target</span>
              <span className="text-sm font-medium text-gray-700">{rented || 0} / {target}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
            <FiEdit className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
            <FiTrash2 className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockItemCard;
