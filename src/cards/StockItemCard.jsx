import React from 'react';
import { FiEdit, FiTrash2, FiDollarSign, FiPackage, FiEye, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const StockItemCard = ({ item, onClick, onEdit, onDelete }) => {
  const currency = useSelector((state) => state.currency.value);
  const colorsList = useSelector((state) => state.color.value); // Get colors from Redux
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
    colors, // This is the color name string from the item
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

  // Find the corresponding color object from the Redux store
  const selectedColor = colorsList.find(c => c.name === colors);

  const getPrice = () => {
    switch (rentOption) {
      case 'fixed':
        return `${currency.symbol}${rentValue}`;
      case 'per-day':
        return `${currency.symbol}${rentPerDay}/day`;
      case 'range':
        return `${currency.symbol}${rentFrom}-${rentTo}`;
      default:
        return 'N/A';
    }
  };

  const getSize = () => {
    switch (sizeOption) {
      case 'fixed':
        return sizeValue;
      case 'range':
        return `${sizeFrom}-${sizeTo}`;
      case 'free':
        return 'Free size';
      default:
        return 'N/A';
    }
  };

  const progress = rented && target ? Math.min((rented / target) * 100, 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer flex h-40 border border-gray-100 overflow-hidden"
    >
      {/* Image Section - Optimized for 9:16 */}
      <div className="relative w-24 h-full flex-shrink-0">
        <img 
          className="w-full h-full object-cover"
          src={photo || 'https://via.placeholder.com/96x160?text=No+Image'} 
          alt={name}
          loading="lazy"
        />
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium ${
          availability === 'available' 
            ? 'bg-green-50 text-green-700 border border-green-100' 
            : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {availability.charAt(0).toUpperCase() + availability.slice(1)}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-3 flex flex-col flex-grow overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{name}</h3>
          <div className="flex space-x-1">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onEdit(e); }}
              className="p-1 rounded hover:bg-gray-50 text-gray-500"
              aria-label="Edit"
            >
              <FiEdit size={14} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onDelete(e); }}
              className="p-1 rounded hover:bg-gray-50 text-red-400"
              aria-label="Delete"
            >
              <FiTrash2 size={14} />
            </motion.button>
          </div>
        </div>
        
        {/* Price */}
        <div className="flex items-center mb-2">
          <FiDollarSign className="text-indigo-500 mr-1" size={14} />
          <span className="text-base font-bold text-gray-800">{getPrice()}</span>
          {rentOption === 'per-day' && (
            <span className="text-xs text-gray-500 ml-1 flex items-center">
              <FiCalendar className="mr-0.5" size={10} />/day
            </span>
          )}
        </div>
        
        {/* Details Row */}
        <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
          <div className="flex items-center">
            <FiPackage className="mr-1" size={12} />
            <span>{getSize()}</span>
          </div>
          {colors && (
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1 border border-gray-200" 
                style={{ backgroundColor: selectedColor ? selectedColor.hex : colors }}
              />
              <span className="truncate max-w-[80px]">{selectedColor ? selectedColor.name : colors}</span>
            </div>
          )}
        </div>
        
        {/* Description (only visible if space available) */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-2 hidden sm:block">
          {description}
        </p>
        
        {/* Progress Section */}
        {target && (
          <div className="mt-auto">
            <div className="flex justify-between mb-1 text-xs">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{rented || 0}/{target}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <motion.div 
                className="bg-gradient-to-r from-indigo-400 to-indigo-500 h-1.5 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StockItemCard;