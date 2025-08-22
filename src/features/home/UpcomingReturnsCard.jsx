import React from 'react';
import { 
  FiUser, 
  FiCalendar, 
  FiPackage, 
  FiDollarSign, 
  FiAlertCircle,
  FiRepeat,
  FiMapPin
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import EmptyState from '../../components/EmptyState';

import { useFormatDate } from '../../hooks/useFormatDate';

const UpcomingReturnsCard = ({ bookings, onReturnClick, stockItems }) => {
  const currency = useSelector((state) => state.currency.value);
  const { formatDate } = useFormatDate();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600 mr-3">
            <FiRepeat size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Returns</h3>
          <span className="ml-auto bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {bookings.length}
          </span>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-5">
        <AnimatePresence>
          {bookings.length > 0 ? (
            <motion.ul 
              className="space-y-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {bookings.map(booking => (
                <motion.li
                  key={booking.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.01 }}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-xs cursor-pointer"
                  onClick={() => onReturnClick(booking)}
                  role="button"
                  tabIndex="0"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onReturnClick(booking);
                    }
                  }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <FiUser className="text-indigo-600 mr-2" size={16} />
                        <h4 className="font-medium text-gray-800">{booking.customerName}</h4>
                      </div>
                      <span className="text-xs font-medium text-gray-500">
                        #{booking.id.slice(0, 6)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div className="flex items-center">
                        <FiCalendar className="text-red-500 mr-2" size={14} />
                        <span>{formatDate(booking.returnDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <FiPackage className="text-purple-500 mr-2" size={14} />
                        <span>{booking.items?.length || 0} items</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FiDollarSign className="text-green-500 mr-2" size={14} />
                        <span className="font-medium">{currency.symbol}{booking.totalAmount?.toFixed(2)}</span>
                      </div>
                      {booking.dueAmount > 0 && (
                        <div className="flex items-center text-red-600 text-sm font-medium">
                          <FiAlertCircle className="mr-1" size={14} />
                          <span>{currency.symbol}{booking.dueAmount?.toFixed(2)} due</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-100 mt-3 pt-3">
                      <h5 className="text-xs font-bold text-gray-500 mb-2">Items</h5>
                      <div className="space-y-2">
                        {stockItems && booking.items.map((item, index) => {
                          const itemDetails = stockItems.find(si => si.id === item.itemId);
                          return (
                            <div key={item.itemId} className="flex items-center">
                              <img 
                                src={itemDetails?.photo || '/assets/default-item-image.svg'} 
                                alt={itemDetails?.name || 'Item'}
                                className="w-8 h-8 object-cover rounded-md mr-2"
                              />
                              <span className="text-xs text-gray-700">{itemDetails?.name || 'Unknown Item'}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <EmptyState
              title="No upcoming returns"
              description="All items have been returned"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UpcomingReturnsCard;
