import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../layout/Sidebar';
import UpcomingDeliveriesCard from '../cards/UpcomingDeliveriesCard';
import UpcomingReturnsCard from '../cards/UpcomingReturnsCard';
import DeliveryInformationPopup from '../modals/DeliveryInformationPopup';
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiTruck, FiRepeat } from 'react-icons/fi';

const Reminders = () => {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [activeTab, setActiveTab] = useState('deliveries');
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);
  const dateTimeFormat = useSelector((state) => state.dateTime.value);

  useEffect(() => {
    if (!userInfo) return;

    const bookingsRef = ref(db, `users/${userInfo.uid}/bookings`);
    const customersRef = ref(db, `users/${userInfo.uid}/customers`);
    const itemsRef = ref(db, `users/${userInfo.uid}/items`);

    const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      setBookings(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    });

    const unsubscribeCustomers = onValue(customersRef, (snapshot) => {
      const data = snapshot.val();
      setCustomers(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    });

    const unsubscribeItems = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      setStockItems(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    });

    return () => {
      unsubscribeBookings();
      unsubscribeCustomers();
      unsubscribeItems();
    };
  }, [db, userInfo]);

  const deliveries = useMemo(() => {
    return bookings
      .filter(b => b.status === 'Waiting for Delivery')
      .map(booking => {
        const customer = customers.find(c => c.id === booking.customerId);
        return {
          ...booking,
          customerName: customer?.name || 'Unknown Customer',
          customerPhone: customer?.phone || 'N/A',
          customerAddress: customer?.address || 'N/A'
        };
      })
      .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));
  }, [bookings, customers]);

  const returns = useMemo(() => {
    return bookings
      .filter(b => b.status === 'Waiting for Return')
      .map(booking => {
        const customer = customers.find(c => c.id === booking.customerId);
        return {
          ...booking,
          customerName: customer?.name || 'Unknown Customer',
          customerPhone: customer?.phone || 'N/A',
          customerAddress: customer?.address || 'N/A'
        };
      })
      .sort((a, b) => new Date(a.returnDate) - new Date(b.returnDate));
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    switch (dateTimeFormat.dateFormat) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return date.toLocaleDateString(dateTimeFormat.locale);
    }
  };

  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
              <FiClock size={24} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Reminders</h1>
          </div>
          <p className="text-gray-500 text-sm md:text-base">
            Track upcoming deliveries and returns
          </p>
        </div>

        {/* Tabs */}
        <div role="tablist" className="flex border-b border-gray-200 mb-6">
          <button
            role="tab"
            aria-selected={activeTab === 'deliveries'}
            className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === 'deliveries' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('deliveries')}
          >
            <FiTruck className="mr-2" size={16} />
            Deliveries ({deliveries.length})
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'returns'}
            className={`px-4 py-2 font-medium text-sm flex items-center ${activeTab === 'returns' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('returns')}
          >
            <FiRepeat className="mr-2" size={16} />
            Returns ({returns.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'deliveries' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'deliveries' ? -20 : 20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'deliveries' ? (
                <UpcomingDeliveriesCard 
                  bookings={deliveries} 
                  onDeliveryClick={handleDeliveryClick} 
                  formatDate={formatDate}
                  stockItems={stockItems}
                />
              ) : (
                <UpcomingReturnsCard 
                  bookings={returns} 
                  onReturnClick={handleReturnClick}
                  formatDate={formatDate}
                  stockItems={stockItems}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Popup */}
      <DeliveryInformationPopup 
        isOpen={!!selectedDelivery}
        booking={selectedDelivery} 
        stockItems={stockItems} 
        onClose={handleClosePopup} 
      />
    </Sidebar>
  );
};

export default Reminders;
