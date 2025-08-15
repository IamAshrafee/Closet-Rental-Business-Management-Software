import React from 'react';
import { FiUser, FiCalendar, FiPackage, FiDollarSign, FiAlertCircle } from 'react-icons/fi';

const UpcomingDeliveriesCard = ({ bookings, onDeliveryClick }) => {
  const upcomingBookings = bookings
    .filter(booking => booking.status === 'Upcoming')
    .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold font-poppins mb-4">Upcoming Deliveries</h3>
      {upcomingBookings.length > 0 ? (
        <ul className="space-y-4">
          {upcomingBookings.map(booking => (
            <li 
              key={booking.id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-indigo-50 transition-colors duration-200"
              onClick={() => onDeliveryClick(booking)}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <FiUser className="text-indigo-600 mr-2" />
                  <p className="font-semibold text-gray-800">{booking.customerName}</p>
                </div>
                <span className="text-sm font-medium text-gray-600">Booking ID: {booking.id.substring(0, 6)}...</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <FiCalendar className="text-blue-500 mr-2" />
                  <span>Delivery: {booking.deliveryDate}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="text-red-500 mr-2" />
                  <span>Return: {booking.returnDate}</span>
                </div>
                <div className="flex items-center">
                  <FiPackage className="text-purple-500 mr-2" />
                  <span>Items: {booking.items.length}</span>
                </div>
                <div className="flex items-center">
                  <FiDollarSign className="text-green-500 mr-2" />
                  <span>Total: ₹{booking.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
              
              {booking.dueAmount > 0 && (
                <div className="flex items-center text-red-600 text-sm font-semibold">
                  <FiAlertCircle className="mr-2" />
                  <span>Due: ₹{booking.dueAmount?.toFixed(2)}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 py-8">No upcoming deliveries.</p>
      )}
    </div>
  );
};

export default UpcomingDeliveriesCard;
