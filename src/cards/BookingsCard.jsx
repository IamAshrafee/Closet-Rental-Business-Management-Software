import React from 'react';
import { FiUser, FiPhone, FiCalendar, FiTruck, FiRepeat, FiDollarSign, FiFileText, FiAlertCircle } from 'react-icons/fi';

const InfoLine = ({ icon, label, value, className = '' }) => (
    <div className={`flex items-center text-sm text-gray-600 ${className}`}>
        <div className="flex-shrink-0 w-5 text-gray-400">{icon}</div>
        <span className="ml-2 font-medium text-gray-500">{label}:</span>
        <span className="ml-2 text-gray-800">{value}</span>
    </div>
);

const BookingsCard = ({ booking }) => {
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

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1">
            <div className="p-5">
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
        </div>
    );
};

export default BookingsCard;