import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../layout/Sidebar';
import UpcomingDeliveriesCard from '../cards/UpcomingDeliveriesCard';
import UpcomingReturnsCard from '../cards/UpcomingReturnsCard';
import DeliveryInformationPopup from '../modals/DeliveryInformationPopup';
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue } from 'firebase/database';

const Reminders = () => {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (userInfo) {
      const bookingsRef = ref(db, `users/${userInfo.uid}/bookings`);
      onValue(bookingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const bookingsList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setBookings(bookingsList);
        } else {
          setBookings([]);
        }
      });

      const customersRef = ref(db, `users/${userInfo.uid}/customers`);
      onValue(customersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const customersList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setCustomers(customersList);
        } else {
          setCustomers([]);
        }
      });

      const itemsRef = ref(db, `users/${userInfo.uid}/items`);
      onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const itemsList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setStockItems(itemsList);
        } else {
          setStockItems([]);
        }
      });
    }
  }, [db, userInfo]);

  const deliveries = useMemo(() => {
    return bookings.map(booking => {
      const customer = customers.find(c => c.id === booking.customerId);
      return {
        ...booking,
        customerName: customer ? customer.name : 'N/A',
        customerPhone: customer ? customer.phone : 'N/A',
      };
    });
  }, [bookings, customers]);

  const handleDeliveryClick = (booking) => {
    setSelectedDelivery(booking);
  };

  const handleReturnClick = (booking) => {
    setSelectedDelivery(booking);
  };

  const handleClosePopup = () => {
    setSelectedDelivery(null);
  };

  return (
    <Sidebar>
      <div className="flex flex-col">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-poppins">Reminders</h1>
          <p className="font-poppins text-gray-500 mt-2">
            Upcoming reminders for your rental business
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UpcomingDeliveriesCard bookings={deliveries.filter(b => b.status === 'Waiting for Delivery')} onDeliveryClick={handleDeliveryClick} />
          <UpcomingReturnsCard bookings={deliveries.filter(b => b.status === 'Waiting for Return')} onReturnClick={handleReturnClick} />
        </div>
      </div>
      {selectedDelivery && <DeliveryInformationPopup booking={selectedDelivery} stockItems={stockItems} onClose={handleClosePopup} />}
    </Sidebar>
  );
};

export default Reminders;