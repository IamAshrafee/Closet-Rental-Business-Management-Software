import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../layout/Sidebar";
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  FiUsers,
  FiBox,
  FiClipboard,
  FiDollarSign,
  FiPlus,
} from "react-icons/fi";
import { motion } from "framer-motion";
import UpcomingDeliveriesCard from "../cards/UpcomingDeliveriesCard";
import UpcomingReturnsCard from "../cards/UpcomingReturnsCard";
import { useNavigate } from "react-router-dom";
import AddNewBookingForm from "../modals/AddNewBookingForm";
import AddCustomerPopup from "../modals/AddCustomerPopup";
import AddItemsForm from "../modals/AddItemsForm";

const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4`}
  >
    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

const QuickActions = ({ onAddBooking, onAddCustomer, onAddItem }) => (
  <div className="mt-8">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddBooking}
        className="bg-indigo-600 text-white px-6 py-4 rounded-lg flex items-center justify-center"
      >
        <FiPlus className="mr-2" />
        Add Booking
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddCustomer}
        className="bg-blue-600 text-white px-6 py-4 rounded-lg flex items-center justify-center"
      >
        <FiPlus className="mr-2" />
        Add Customer
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddItem}
        className="bg-green-600 text-white px-6 py-4 rounded-lg flex items-center justify-center"
      >
        <FiPlus className="mr-2" />
        Add Item
      </motion.button>
    </div>
  </div>
);

const Home = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalBookings: 0,
    totalItems: 0,
    totalRevenue: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);
  const currency = useSelector((state) => state.currency.value);
  const dateTimeFormat = useSelector((state) => state.dateTime.value);

  useEffect(() => {
    if (userInfo) {
      setIsLoading(true);
      const customersRef = ref(db, `users/${userInfo.uid}/customers`);
      const bookingsRef = ref(db, `users/${userInfo.uid}/bookings`);
      const itemsRef = ref(db, `users/${userInfo.uid}/items`);

      const unsubscribeCustomers = onValue(customersRef, (snapshot) => {
        const data = snapshot.val() || {};
        const customersList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setCustomers(customersList);
        setStats((prev) => ({ ...prev, totalCustomers: customersList.length }));
      });

      const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
        const data = snapshot.val() || {};
        const bookingsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setBookings(bookingsList);
        setStats((prev) => ({
          ...prev,
          totalBookings: bookingsList.length,
          totalRevenue: bookingsList.reduce(
            (acc, b) => acc + (b.totalAmount || 0),
            0
          ),
        }));
      });

      const unsubscribeItems = onValue(itemsRef, (snapshot) => {
        const data = snapshot.val() || {};
        const itemsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setItems(itemsList);
        setStats((prev) => ({ ...prev, totalItems: itemsList.length }));
      });

      setIsLoading(false);

      return () => {
        unsubscribeCustomers();
        unsubscribeBookings();
        unsubscribeItems();
      };
    }
  }, [db, userInfo]);

  const navigate = useNavigate();

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

  const deliveries = useMemo(() => {
    return bookings
      .filter((b) => b.status === "Waiting for Delivery")
      .map((booking) => {
        const customer = customers.find((c) => c.id === booking.customerId);
        return {
          ...booking,
          customerName: customer?.name || "Unknown Customer",
        };
      })
      .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));
  }, [bookings, customers]);

  const returns = useMemo(() => {
    return bookings
      .filter((b) => b.status === "Waiting for Return")
      .map((booking) => {
        const customer = customers.find((c) => c.id === booking.customerId);
        return {
          ...booking,
          customerName: customer?.name || "Unknown Customer",
        };
      })
      .sort((a, b) => new Date(a.returnDate) - new Date(b.returnDate));
  }, [bookings, customers]);

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [bookings]);

  if (isLoading) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold font-poppins">Dashboard</h1>
        <p className="font-poppins text-gray-500 mt-1">
          Welcome to your closet rental business overview
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <StatCard
            icon={<FiUsers size={24} />}
            title="Total Customers"
            value={stats.totalCustomers}
            color="indigo"
          />
          <StatCard
            icon={<FiBox size={24} />}
            title="Items in Stock"
            value={stats.totalItems}
            color="blue"
          />
          <StatCard
            icon={<FiClipboard size={24} />}
            title="Total Bookings"
            value={stats.totalBookings}
            color="green"
          />
          <StatCard
            icon={<FiDollarSign size={24} />}
            title="Total Revenue"
            value={`${currency.symbol}${stats.totalRevenue.toFixed(2)}`}
            color="yellow"
          />
        </div>

        <QuickActions
          onAddBooking={() => setIsBookingModalOpen(true)}
          onAddCustomer={() => setIsCustomerModalOpen(true)}
          onAddItem={() => setIsItemModalOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <UpcomingDeliveriesCard
              bookings={deliveries}
              onDeliveryClick={(booking) => navigate("/reminders")}
              formatDate={formatDate}
            />
          </div>
          <div>
            <UpcomingReturnsCard
              bookings={returns}
              onReturnClick={(booking) => navigate("/reminders")}
              formatDate={formatDate}
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Bookings
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium">
                    {
                      customers.find((c) => c.id === booking.customerId)
                        ?.name
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.items.length} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {currency.symbol}{booking.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(booking.deliveryDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AddNewBookingForm
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
      <AddCustomerPopup
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />
      <AddItemsForm
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
      />
    <AddNewBookingForm
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
      <AddCustomerPopup
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />
      <AddItemsForm
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
      />
    </Sidebar>
  );
};

export default Home;
