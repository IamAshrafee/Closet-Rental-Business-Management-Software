import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../layout/Sidebar';
import { useSelector } from 'react-redux';
import { ref, onValue } from 'firebase/database';
import { db } from '../../lib/firebase';
import { FiUsers, FiDollarSign } from 'react-icons/fi';

const PartnerPayouts = () => {
  const [partners, setPartners] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userInfo = useSelector((state) => state.userLogInfo.value);
  const currency = useSelector((state) => state.currency.value);

  useEffect(() => {
    if (userInfo) {
      setIsLoading(true);
      const partnersRef = ref(db, `users/${userInfo.uid}/partners`);
      const bookingsRef = ref(db, `users/${userInfo.uid}/bookings`);
      const itemsRef = ref(db, `users/${userInfo.uid}/items`);

      onValue(partnersRef, (snapshot) => {
        const data = snapshot.val() || {};
        setPartners(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      });

      onValue(bookingsRef, (snapshot) => {
        const data = snapshot.val() || {};
        setBookings(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      });

      onValue(itemsRef, (snapshot) => {
        const data = snapshot.val() || {};
        setItems(Object.keys(data).map(key => ({ id: key, ...data[key] })));
        setIsLoading(false);
      });
    }
  }, [userInfo]);

  const payoutData = useMemo(() => {
    if (isLoading || partners.length === 0) return [];

    return partners.map(partner => {
      let totalRevenue = 0;
      let ownerShare = 0;
      let partnerItemsCount = 0;

      const partnerItems = items.filter(item => item.isCollaborated && item.ownerId === partner.id);
      partnerItemsCount = partnerItems.length;

      bookings.forEach(booking => {
        (booking.items || []).forEach(itemInBooking => {
          if (itemInBooking.isCollaborated && itemInBooking.ownerId === partner.id) {
            totalRevenue += itemInBooking.calculatedPrice || 0;
            ownerShare += itemInBooking.ownerShare || 0;
          }
        });
      });

      return {
        ...partner,
        totalRevenue,
        ownerShare,
        partnerItemsCount
      };
    });
  }, [partners, bookings, items, isLoading]);

  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Partner Payouts</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Review revenue and earnings for your collaboration partners.
            </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Owed (60%)</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {payoutData.map(partner => (
                        <tr key={partner.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner.partnerItemsCount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{currency.symbol}{partner.totalRevenue.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{currency.symbol}{partner.ownerShare.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </Sidebar>
  );
};

export default PartnerPayouts;