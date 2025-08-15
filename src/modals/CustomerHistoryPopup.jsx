import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiDollarSign, FiPackage, FiActivity, FiAlertCircle } from 'react-icons/fi';

const CustomerHistoryPopup = ({ customer, bookings, stockItems, onClose }) => {
  if (!customer) {
    return null;
  }

  const totalSpent = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'Upcoming' || b.status === 'Ongoing').length;
  const totalOutstanding = bookings.reduce((acc, b) => acc + (b.dueAmount > 0 ? b.dueAmount : 0), 0);

  const getItemName = (itemId) => {
    const item = stockItems.find(item => item.id === itemId);
    return item ? item.name : 'Item not found';
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-50 p-4"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-11/12 md:w-full max-w-4xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{customer.name}'s History</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close form"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-grow">
          {/* Customer Stats */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-600">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <FiDollarSign className="text-green-500 mx-auto text-2xl mb-2" />
                <p className="text-gray-500 text-sm">Total Spent</p>
                <p className="font-bold text-gray-800 text-xl">₹{totalSpent.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <FiPackage className="text-blue-500 mx-auto text-2xl mb-2" />
                <p className="text-gray-500 text-sm">Total Bookings</p>
                <p className="font-bold text-gray-800 text-xl">{totalBookings}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <FiActivity className="text-yellow-500 mx-auto text-2xl mb-2" />
                <p className="text-gray-500 text-sm">Active Bookings</p>
                <p className="font-bold text-gray-800 text-xl">{activeBookings}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <FiAlertCircle className="text-red-500 mx-auto text-2xl mb-2" />
                <p className="text-gray-500 text-sm">Outstanding</p>
                <p className="font-bold text-gray-800 text-xl">₹{totalOutstanding.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-600">Booking History</h3>
            {bookings && bookings.length > 0 ? (
              <ul className="space-y-4">
                {bookings.map(booking => (
                  <li key={booking.id} className="p-4 border rounded-md bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-gray-800">Booking ID: {booking.id}</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <p><strong>Delivery:</strong> {booking.deliveryDate}</p>
                      <p><strong>Return:</strong> {booking.returnDate}</p>
                      <p><strong>Total:</strong> ₹{booking.totalAmount.toFixed(2)}</p>
                      <p><strong>Due:</strong> ₹{booking.dueAmount.toFixed(2)}</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Items Rented:</p>
                      <ul className="list-disc list-inside pl-2 text-sm text-gray-600">
                        {booking.items.map((item, index) => (
                          <li key={index}>{getItemName(item.itemId)}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-8">No bookings found for this customer.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 font-semibold">Close</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerHistoryPopup;
