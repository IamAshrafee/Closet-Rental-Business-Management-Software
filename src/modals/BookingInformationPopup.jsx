import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiUser, FiBox, FiCalendar, FiDollarSign, FiTruck, FiRepeat, FiFileText, FiHash } from 'react-icons/fi';
import { getDatabase, ref, get } from "firebase/database";
import { useSelector } from 'react-redux';

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
    const [customer, setCustomer] = useState(null);
    const [detailedItems, setDetailedItems] = useState([]);
    const db = getDatabase();
    const userInfo = useSelector((state) => state.userLogInfo.value);
    const currency = useSelector((state) => state.currency.value);

    useEffect(() => {
        if (userInfo && booking) {
            // Fetch customer details
            const customerRef = ref(db, `users/${userInfo.uid}/customers/${booking.customerId}`);
            get(customerRef).then((snapshot) => {
                if (snapshot.exists()) {
                    setCustomer(snapshot.val());
                }
            });

            // Fetch item details
            const itemPromises = booking.items.map(item => {
                const itemRef = ref(db, `users/${userInfo.uid}/items/${item.itemId}`);
                return get(itemRef).then(snapshot => ({
                    ...item, // from booking
                    ...(snapshot.exists() ? snapshot.val() : {}), // from items db
                }));
            });

            Promise.all(itemPromises).then(itemsData => {
                setDetailedItems(itemsData);
            });
        }
    }, [db, userInfo, booking]);

    if (!booking) return null;

    const {
        id,
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
        status
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
                    {customer && (
                        <DetailSection title="Customer">
                            <InfoPair label="Name" value={customer.name} />
                            <InfoPair label="Phone" value={customer.phone} />
                        </DetailSection>
                    )}

                    <DetailSection title="Booking Details">
                        <InfoPair label="Status" value={status} />
                        <InfoPair label="Delivery Date" value={deliveryDate} />
                        <InfoPair label="Return Date" value={returnDate} />
                        <InfoPair label="Delivery Type" value={deliveryType === 'HomeDelivery' ? 'Home Delivery' : 'Customer Pickup'} />
                        {deliveryType === 'HomeDelivery' && <InfoPair label="Address" value={address} />}
                    </DetailSection>

                    {detailedItems.length > 0 && (
                        <DetailSection title="Rented Items">
                            {detailedItems.map((item, index) => (
                                <div key={`${item.itemId}-${index}`} className="py-1 border-b last:border-none">
                                    <InfoPair label={item.name || 'Item not found'} value={`${currency.symbol}${parseFloat(item.calculatedPrice || 0).toFixed(2)}`} />
                                    <p className="text-xs text-gray-500 pl-2">{booking.startDate} to {booking.endDate}</p>
                                </div>
                            ))}
                        </DetailSection>
                    )}

                    <DetailSection title="Financials">
                        <InfoPair label="Total Rent" value={`${currency.symbol}${detailedItems.reduce((sum, i) => sum + parseFloat(i.calculatedPrice || 0), 0).toFixed(2)}`} />
                        <InfoPair label="Delivery Charge" value={`${currency.symbol}${parseFloat(deliveryCharge || 0).toFixed(2)}`} />
                        <InfoPair label="Other Charges" value={`${currency.symbol}${parseFloat(otherCharges || 0).toFixed(2)}`} />
                        <hr className="my-1"/>
                        <InfoPair label="Subtotal" value={`${currency.symbol}${parseFloat(totalAmount || 0).toFixed(2)}`} />
                        {advances && advances.map((adv, index) => (
                             <InfoPair key={`advance-${index}`} label={`Advance on ${adv.date}`} value={`- ${currency.symbol}${parseFloat(adv.amount || 0).toFixed(2)}`} />
                        ))}
                        <hr className="my-1"/>
                        <div className="flex justify-between font-bold text-lg text-indigo-600">
                            <p>Due Amount:</p>
                            <p>{currency.symbol}{parseFloat(dueAmount || 0).toFixed(2)}</p>
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