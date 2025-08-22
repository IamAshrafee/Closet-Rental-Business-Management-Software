import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { 
  FiDollarSign, 
  FiPackage, 
  FiActivity, 
  FiAlertCircle,
  FiCalendar,
  FiClock,
  FiList
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useFormatDate } from '../../hooks/useFormatDate';

const StatCard = ({ icon, label, value, color }) => (
  <motion.div 
    className="p-4 bg-white rounded-xl shadow-xs border border-gray-100"
    whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
  >
    <div className={`w-10 h-10 rounded-lg ${color.bg} ${color.text} flex items-center justify-center mb-3`}>
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
  </motion.div>
);

const BookingItem = ({ booking, getItemDetails, currency, formatDate }) => (
  <motion.li 
    className="p-5 border border-gray-200 rounded-xl bg-white shadow-xs mb-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    whileHover={{ scale: 1.01 }}
  >
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
      <div className="flex items-center mb-2 sm:mb-0">
        <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mr-3">
          <FiCalendar size={16} />
        </div>
        <p className="font-semibold text-gray-800">Booking #{booking.id}</p>
      </div>
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
        {booking.status}
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
      <div className="flex items-center">
        <FiCalendar className="text-gray-400 mr-2" size={14} />
        <span><strong>Delivery:</strong> {formatDate(booking.deliveryDate)}</span>
      </div>
      <div className="flex items-center">
        <FiCalendar className="text-gray-400 mr-2" size={14} />
        <span><strong>Return:</strong> {formatDate(booking.returnDate)}</span>
      </div>
      <div className="flex items-center">
        <FiDollarSign className="text-gray-400 mr-2" size={14} />
        <span><strong>Total:</strong> {currency.symbol}{booking.totalAmount?.toFixed(2)}</span>
      </div>
      <div className="flex items-center">
        <FiAlertCircle className="text-gray-400 mr-2" size={14} />
        <span><strong>Due:</strong> {currency.symbol}{booking.dueAmount?.toFixed(2)}</span>
      </div>
    </div>

    <div>
      <div className="flex items-center text-sm font-semibold text-gray-700 mb-3">
        <FiList className="text-gray-400 mr-2" size={14} />
        <span>Items Rented</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {booking.items?.map((item, index) => {
          const itemDetails = getItemDetails(item.itemId);
          return (
            <div key={index} className="flex items-center bg-gray-50 p-2 rounded-lg">
              <img 
                src={itemDetails.photo || '/assets/default-item-image.svg'} 
                alt={itemDetails.name} 
                className="w-12 h-12 object-cover rounded-md mr-3"
              />
              <div>
                <p className="font-semibold text-gray-700 text-sm">{itemDetails.name || 'Unknown Item'}</p>
                <p className="text-xs text-gray-500">{itemDetails.category || 'Uncategorized'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </motion.li>
);

const getStatusColor = (status) => {
  switch(status) {
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Upcoming':
      return 'bg-blue-100 text-blue-800';
    case 'Ongoing':
      return 'bg-yellow-100 text-yellow-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const CustomerHistoryPopup = ({ isOpen, customer, bookings = [], stockItems = [], onClose }) => {
  const currency = useSelector((state) => state.currency.value);
  const { formatDate } = useFormatDate();
  if (!isOpen || !customer) return null;

  const totalSpent = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'Upcoming' || b.status === 'Ongoing').length;
  const totalOutstanding = bookings.reduce((acc, b) => acc + (b.dueAmount > 0 ? b.dueAmount : 0), 0);

  const getItemDetails = (itemId) => {
    const item = stockItems.find(item => item.id === itemId);
    return item || {};
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0  bg-opacity-50 bg-black/30 flex justify-center items-center backdrop-blur-sm z-50 p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{customer.name}'s Rental History</h2>
              <p className="text-sm text-gray-500 mt-1">All booking records and statistics</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <IoMdClose size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-grow p-5">
            {/* Statistics Section */}
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                <FiActivity className="mr-2" size={16} />
                Customer Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                  icon={<FiDollarSign />} 
                  label="Total Spent" 
                  value={`${currency.symbol}${totalSpent.toFixed(2)}`} 
                  color={{ bg: 'bg-green-50', text: 'text-green-600' }}
                />
                <StatCard 
                  icon={<FiPackage />} 
                  label="Total Bookings" 
                  value={totalBookings} 
                  color={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
                />
                <StatCard 
                  icon={<FiClock />} 
                  label="Active Bookings" 
                  value={activeBookings} 
                  color={{ bg: 'bg-yellow-50', text: 'text-yellow-600' }}
                />
                <StatCard 
                  icon={<FiAlertCircle />} 
                  label="Outstanding" 
                  value={`${currency.symbol}${totalOutstanding.toFixed(2)}`} 
                  color={{ bg: 'bg-red-50', text: 'text-red-600' }}
                />
              </div>
            </motion.section>

            {/* Booking History Section */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                <FiList className="mr-2" size={16} />
                Booking History
              </h3>
              
              {bookings.length > 0 ? (
                <motion.ul 
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
                                        <BookingItem 
                      key={booking.id} 
                      booking={booking} 
                      getItemDetails={getItemDetails} 
                      currency={currency}
                      formatDate={formatDate}
                    />
                  ))}
                </motion.ul>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10"
                >
                  <div className="bg-gray-100 p-5 rounded-full inline-block mb-4">
                    <FiPackage size={32} className="text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 mb-1">No bookings found</h4>
                  <p className="text-gray-500">This customer hasn't made any bookings yet</p>
                </motion.div>
              )}
            </motion.section>
          </div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 border-t border-gray-100 bg-gray-50"
          >
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Close History
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomerHistoryPopup;
