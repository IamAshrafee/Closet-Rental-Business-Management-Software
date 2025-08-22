import React, { useState, useMemo, useCallback } from 'react';
import {
  FiEdit,
  FiTrash2,
  FiDollarSign,
  FiPackage,
  FiEye,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import ActiveBookingsPopup from '../modals/ActiveBookingsPopup';

const StockItemCard = ({
  item,
  onClick,
  onEdit,
  onDelete,
  onViewBookingDetails
}) => {
  const currency = useSelector((state) => state.currency.value);
  const colorsList = useSelector((state) => state.color.value);
  const [isBookingPopupOpen, setBookingPopupOpen] = useState(false);

  if (!item) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-44 flex items-center justify-center text-gray-400 animate-pulse">
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mb-2"></div>
          <p>Loading item...</p>
        </div>
      </div>
    );
  }

  const {
    name,
    availability,
    sizeOption,
    sizeValue,
    sizeFrom,
    sizeTo,
    colors,
    rentOption,
    rentValue,
    rentPerDay,
    rentFrom,
    rentTo,
    description,
    target,
    rented,
    photo,
    activeBookingsCount = 0,
    activeBookings = [],
    rating,
    isFeatured
  } = item;

  const progress = useMemo(
    () => (target ? Math.min((rented / target) * 100, 100) : 0),
    [rented, target]
  );

  const getPrice = useCallback(() => {
    switch (rentOption) {
      case 'fixed':
        return `${currency.symbol}${rentValue.toLocaleString()}`;
      case 'per-day':
        return `${currency.symbol}${rentPerDay.toLocaleString()}/day`;
      case 'range':
        return `${currency.symbol}${rentFrom.toLocaleString()}-${rentTo.toLocaleString()}`;
      default:
        return 'N/A';
    }
  }, [rentOption, rentValue, rentPerDay, rentFrom, rentTo, currency]);

  const getSize = useCallback(() => {
    switch (sizeOption) {
      case 'fixed':
        return `${sizeValue}"`;
      case 'range':
        return `${sizeFrom}" - ${sizeTo}"`;
      case 'free':
        return 'Free size';
      default:
        return 'N/A';
    }
  }, [sizeOption, sizeValue, sizeFrom, sizeTo]);

  const handleViewBookings = useCallback((e) => {
    e.stopPropagation();
    if (activeBookingsCount > 0) {
      setBookingPopupOpen(true);
    }
  }, [activeBookingsCount]);

  const availabilityConfig = useMemo(() => ({
    available: {
      icon: <FiCheckCircle size={12} />,
      bg: 'bg-green-100/80',
      text: 'text-green-800',
      border: 'border-green-200'
    },
    unavailable: {
      icon: <FiXCircle size={12} />,
      bg: 'bg-red-100/80',
      text: 'text-red-800',
      border: 'border-red-200'
    }
  }), []);

  const availabilityStatus = availabilityConfig[availability] || availabilityConfig.unavailable;

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer flex h-50 border border-gray-200/80 overflow-hidden group"
        aria-label={`Stock item: ${name}`}
        role="button"
        tabIndex={0}
      >
        {item.status === 'draft' && (
          <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full flex items-center shadow-sm font-semibold">
            Draft
          </div>
        )}
        {isFeatured && (
          <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-sm">
            <FiStar className="mr-1" size={10} />
            Featured
          </div>
        )}

        {/* Image Section */}
        <div className="relative w-32 h-full flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 z-[1]"></div>
          <img
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={photo || '/assets/default-item-image.svg'}
            alt={name}
            loading="lazy"
            onError={(e) => {
              e.target.src = '/assets/default-item-image.svg';
            }}
          />
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center ${availabilityStatus.bg} ${availabilityStatus.text} ${availabilityStatus.border} backdrop-blur-sm`}>
            {availabilityStatus.icon}
            <span className="ml-1">
              {availability.charAt(0).toUpperCase() + availability.slice(1)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1" title={name}>
              {name}
            </h3>
            <div className="flex space-x-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onEdit(e); }}
                className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-colors"
                aria-label={`Edit ${name}`}
              >
                <FiEdit size={14} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); onDelete(e); }}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                aria-label={`Delete ${name}`}
              >
                <FiTrash2 size={14} />
              </motion.button>
            </div>
          </div>

          {/* Rating (if exists) */}
          {rating && (
            <div className="flex items-center mb-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={12}
                    fill={i < Math.round(rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center mb-2">
            <div className="bg-indigo-100 p-1 rounded-lg mr-2">
              <FiDollarSign className="text-indigo-600" size={14} />
            </div>
            <span className="text-base font-bold text-gray-800">{getPrice()}</span>
            {rentOption === 'per-day' && (
              <span className="text-xs text-gray-500 ml-1 flex items-center">
                <FiCalendar className="mr-0.5" size={10} />/day
              </span>
            )}
          </div>

          {/* Details Row */}
          <div className="flex items-center space-x-3 text-xs text-gray-600 mb-2">
            <div className="flex items-center bg-gray-100/70 px-2 py-1 rounded-lg">
              <FiPackage className="mr-1 text-indigo-500" size={12} />
              <span>{getSize()}</span>
            </div>
            {colors && Array.isArray(colors) && colors.length > 0 && (
              <div className="flex items-center space-x-1">
                {colors.map((colorName, index) => {
                  const color = colorsList.find(c => c.name === colorName);
                  return (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color ? color.hex : '#ffffff' }}
                      title={colorName}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Bookings */}
          {activeBookingsCount > 0 && (
            <div className="flex items-center justify-between text-xs text-blue-600 mt-1 mb-2">
              <div className="flex items-center bg-blue-50/70 px-2 py-1 rounded-lg">
                <FiEye className="mr-1.5" />
                <span>{activeBookingsCount} Active Booking{activeBookingsCount !== 1 ? 's' : ''}</span>
              </div>
              <motion.button
                onClick={handleViewBookings}
                className="font-medium text-indigo-600 hover:text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View
              </motion.button>
            </div>
          )}

          {/* Progress Section */}
          {target && (
            <div className="mt-auto">
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-gray-600">Rental Progress</span>
                <div className="flex items-center">
                  <FiTrendingUp className="mr-1 text-indigo-500" size={12} />
                  <span className="font-medium">
                    {rented.toLocaleString()}/{target.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, type: 'spring' }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <ActiveBookingsPopup
        isOpen={isBookingPopupOpen}
        onClose={() => setBookingPopupOpen(false)}
        bookings={activeBookings}
        item={item}
        currency={currency}
        onViewDetails={onViewBookingDetails}
      />
    </>
  );
};

export default React.memo(StockItemCard);