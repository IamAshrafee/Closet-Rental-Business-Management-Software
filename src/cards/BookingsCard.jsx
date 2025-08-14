import React from 'react';
import { FiUser, FiPhone, FiCalendar, FiTruck, FiRepeat, FiDollarSign, FiFileText, FiAlertCircle, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

const InfoLine = ({ icon, label, value, className = '' }) => (
    <div className={`flex items-center text-sm text-gray-600 ${className}`}>
        <div className="flex-shrink-0 w-5 text-gray-400">{icon}</div>
        <span className="ml-2 font-medium text-gray-500">{label}:</span>
        <span className="ml-2 text-gray-800">{value}</span>
    </div>
);

const BookingsCard = ({ booking, onView, onEdit, onDelete }) => {
    if (!booking) {
        return null;
    }

    const {
        customerName,
        customerPhone,
        deliveryDate,
        returnDate,
        startDate,
        endDate,
        totalAmount,
        dueAmount,
        notes,
    } = booking;

    const isDue = dueAmount > 0;

    const handleActionClick = (e, action) => {
        e.stopPropagation(); // Prevent card click from firing if buttons are inside
        action();
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col">
            <div className="p-5 flex-grow">
                {/* Header */}
                <div className="border-b pb-3 mb-4">
                    <h3 className="text-lg font-bold font-poppins text-gray-800">{customerName}</h3>
                    <p className="text-sm text-gray-500 flex items-center"><FiPhone className="mr-2" />{customerPhone}</p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-4">
                    <InfoLine icon={<FiTruck />} label="Delivery" value={deliveryDate} className="font-semibold text-blue-600" />
                    <InfoLine icon={<FiRepeat />} label="Return" value={returnDate} className="font-semibold text-red-600" />
                    <InfoLine icon={<FiCalendar />} label="Start" value={startDate} />
                    <InfoLine icon={<FiCalendar />} label="End" value={endDate} />
                </div>

                {/* Financials */}
                <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <div className="flex justify-between items-center text-sm">
                        <InfoLine icon={<FiDollarSign />} label="Total" value={`₹${totalAmount.toFixed(2)}`} />
                        {isDue && (
                            <div className="flex items-center text-red-600 font-semibold">
                                <FiAlertCircle className="mr-1" />
                                <span>Due: ₹{dueAmount.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes */}
                {notes && (
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Notes</h4>
                        <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 p-2 rounded-md">{notes}</p>
                    </div>
                )}
            </div>
            
            {/* Actions */}
            <div className="flex justify-end items-center p-3 bg-gray-50 border-t">
                <button onClick={(e) => handleActionClick(e, onView)} className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors">
                    <FiEye className="mr-1.5" /> View Info
                </button>
                <div className="w-px h-5 bg-gray-300 mx-2"></div>
                <button onClick={(e) => handleActionClick(e, onEdit)} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-100 transition-colors"><FiEdit /></button>
                <button onClick={(e) => handleActionClick(e, onDelete)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"><FiTrash2 /></button>
            </div>
        </div>
    );
};

export default BookingsCard;