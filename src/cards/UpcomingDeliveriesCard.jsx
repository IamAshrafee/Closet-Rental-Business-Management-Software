import React from 'react';
import { 
  FiUser, 
  FiCalendar, 
  FiPackage, 
  FiDollarSign, 
  FiAlertCircle,
  FiTruck,
  FiMapPin
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const UpcomingDeliveriesCard = ({ bookings, onDeliveryClick, formatDate }) => {
  const currency = useSelector((state) => state.currency.value);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-3">
            <FiTruck size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Deliveries</h3>
          <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
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
                  onClick={() => onDeliveryClick(booking)}
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
                        <FiCalendar className="text-blue-500 mr-2" size={14} />
                        <span>{formatDate(booking.deliveryDate)}</span>
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
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-10"
            >
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <FiTruck size={32} className="text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-1">No upcoming deliveries</h4>
              <p className="text-gray-500">All deliveries are completed</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UpcomingDeliveriesCard;
