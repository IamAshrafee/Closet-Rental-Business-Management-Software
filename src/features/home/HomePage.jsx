import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../layout/Sidebar";
import { useSelector } from "react-redux";
import {
  FiUsers,
  FiBox,
  FiClipboard,
  FiDollarSign,
  FiPlus,
} from "react-icons/fi";
import { motion } from "framer-motion";
import UpcomingDeliveriesCard from "./UpcomingDeliveriesCard";
import UpcomingReturnsCard from "./UpcomingReturnsCard";
import { useNavigate } from "react-router-dom";
import AddNewBookingForm from "../bookings/AddNewBookingForm";
import AddCustomerPopup from "../customers/AddCustomerPopup";
import AddItemsForm from "../stock/AddItemsForm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import EmptyState from "../../components/EmptyState";
import { useFormatDate } from "../../hooks/useFormatDate";

const StatCard = ({ icon, title, value, color, isLoading }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4`}
  >
    {isLoading ? (
      <Skeleton circle height={48} width={48} />
    ) : (
      <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>
    )}
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {isLoading ? <Skeleton width={100} /> : <p className="text-2xl font-bold text-gray-800">{value}</p>}
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
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Get data from Redux store
  const { bookings, status: bookingsStatus } = useSelector((state) => state.bookings);
  const { customers, status: customersStatus } = useSelector((state) => state.customers);
  const { stockItems, status: stockStatus } = useSelector((state) => state.stock);
  
  const currency = useSelector((state) => state.currency.value);
  const { formatDate } = useFormatDate();
  const navigate = useNavigate();

  const isLoading = useMemo(() => 
    bookingsStatus === 'loading' || customersStatus === 'loading' || stockStatus === 'loading',
    [bookingsStatus, customersStatus, stockStatus]
  );

  const stats = useMemo(() => ({
    totalCustomers: customers.length,
    totalBookings: bookings.length,
    totalItems: stockItems.length,
    totalRevenue: bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0),
  }), [customers, bookings, stockItems]);

  const deliveries = useMemo(() => {
    if (!customers || customers.length === 0) return [];
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
    if (!customers || customers.length === 0) return [];
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
            isLoading={isLoading}
          />
          <StatCard
            icon={<FiBox size={24} />}
            title="Items in Stock"
            value={stats.totalItems}
            color="blue"
            isLoading={isLoading}
          />
          <StatCard
            icon={<FiClipboard size={24} />}
            title="Total Bookings"
            value={stats.totalBookings}
            color="green"
            isLoading={isLoading}
          />
          <StatCard
            icon={<FiDollarSign size={24} />}
            title="Total Revenue"
            value={`${currency.symbol}${stats.totalRevenue.toFixed(2)}`}
            color="yellow"
            isLoading={isLoading}
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
              onDeliveryClick={() => navigate("/reminders")}
              stockItems={stockItems}
              isLoading={isLoading}
            />
          </div>
          <div>
            <UpcomingReturnsCard
              bookings={returns}
              onReturnClick={() => navigate("/reminders")}
              stockItems={stockItems}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Bookings
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {isLoading ? (
              <div className="p-4">
                <Skeleton count={5} height={60} />
              </div>
            ) : recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border-b last:border-b-0"
                  role="button"
                  tabIndex="0"
                  onClick={() => navigate("/bookings")}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate("/bookings");
                    }
                  }}
                >
                  <div>
                    <p className="font-medium">
                      {customers.find((c) => c.id === booking.customerId)?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.items?.length || 0} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {currency.symbol}{(booking.totalAmount || 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(booking.deliveryDate)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="No recent bookings"
                description="Your most recent bookings will appear here."
              />
            )}
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
        stockItems={stockItems}
      />
    </Sidebar>
  );
};

export default Home;