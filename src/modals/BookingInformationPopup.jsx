import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiUser, FiBox, FiCalendar, FiDollarSign, FiTruck, FiRepeat, FiFileText, FiHash } from 'react-icons/fi';

const DetailSection = ({ title, children }) => (
    <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h4>
        <div className="bg-gray-50 p-3 rounded-md text-sm space-y-1">
            {children}
        </div>
    </div>
);

const InfoPair = ({ label, value }) => (
    <div className="flex justify-between">
        <p className="text-gray-600">{label}:</p>
        <p className="font-medium text-gray-800">{value}</p>
    </div>
);

const BookingInformationPopup = ({ booking, onClose }) => {
    if (!booking) return null;

    const {
        id,
        customerName,
        customerPhone,
        items,
        deliveryType,
        deliveryDate,
        address,
        returnDate,
        deliveryCharge,
        otherCharges,
        advances,
        notes,
        totalAmount,
        dueAmount,
    } = booking;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center backdrop-blur-sm z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-xl z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
                        <p className="text-sm text-gray-500">Booking ID: #{id}</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800"><IoMdClose size={24} /></button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-4">
                    <DetailSection title="Customer">
                        <InfoPair label="Name" value={customerName} />
                        <InfoPair label="Phone" value={customerPhone} />
                    </DetailSection>

                    <DetailSection title="Booking Timeline">
                        <InfoPair label="Delivery Date" value={deliveryDate} />
                        <InfoPair label="Return Date" value={returnDate} />
                        <InfoPair label="Delivery Type" value={deliveryType === 'HomeDelivery' ? 'Home Delivery' : 'Customer Pickup'} />
                        {deliveryType === 'HomeDelivery' && <InfoPair label="Address" value={address} />}
                    </DetailSection>

                    <DetailSection title="Rented Items">
                        {items.map((item, index) => (
                            <div key={index} className="py-1 border-b last:border-none">
                                <InfoPair label={item.name} value={`₹${item.price.toFixed(2)}`} />
                                <p className="text-xs text-gray-500 pl-2">{item.startDate} to {item.endDate}</p>
                            </div>
                        ))}
                    </DetailSection>

                    <DetailSection title="Financials">
                        <InfoPair label="Total Rent" value={`₹${items.reduce((sum, i) => sum + i.price, 0).toFixed(2)}`} />
                        <InfoPair label="Delivery Charge" value={`₹${deliveryCharge.toFixed(2)}`} />
                        <InfoPair label="Other Charges" value={`₹${otherCharges.toFixed(2)}`} />
                        <hr className="my-1"/>
                        <InfoPair label="Subtotal" value={`₹${totalAmount.toFixed(2)}`} />
                        {advances.map((adv, index) => (
                             <InfoPair key={index} label={`Advance on ${adv.date}`} value={`- ₹${adv.amount.toFixed(2)}`} />
                        ))}
                        <hr className="my-1"/>
                        <div className="flex justify-between font-bold text-lg text-indigo-600">
                            <p>Due Amount:</p>
                            <p>₹{dueAmount.toFixed(2)}</p>
                        </div>
                    </DetailSection>

                    {notes && (
                        <DetailSection title="Notes">
                            <p className="text-gray-700">{notes}</p>
                        </DetailSection>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t bg-white sticky bottom-0 rounded-b-xl z-10">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 font-semibold">Close</button>
                </div>
            </div>
        </div>
    );
};

export default BookingInformationPopup;