import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../layout/Sidebar";
import AddNewBookingForm from "../modals/AddNewBookingForm";
import BookingsCard from "../cards/BookingsCard";
import BookingInformationPopup from "../modals/BookingInformationPopup";
import { useSelector } from "react-redux";
import { ref, onValue, remove, update, get } from "firebase/database";
import { db } from "../authentication/firebaseConfig";
import { FiPlus, FiSearch, FiCalendar, FiX, FiArrowLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import EmptyState from "../components/EmptyState";

const Bookings = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchCategory, setSearchCategory] = useState("All");
  const [view, setView] = useState("active"); // active, drafts
  
  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (!userInfo) return;

    setIsLoading(true);
    const bookingsRef = ref(db, `users/${userInfo.uid}/bookings`);
    const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      setBookings(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
      setIsLoading(false);
    });

    const customersRef = ref(db, `users/${userInfo.uid}/customers`);
    const unsubscribeCustomers = onValue(customersRef, (snapshot) => {
        const data = snapshot.val();
        setCustomers(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    });

    return () => {
        unsubscribeBookings();
        unsubscribeCustomers();
    };
  }, [userInfo]);

  const { draftsCount, filteredBookings } = useMemo(() => {
    const statusOrder = {
      'Waiting for Delivery': 1,
      'Waiting for Return': 2,
      'Postponed': 3,
      'Completed': 4,
    };

    const draftBookings = bookings.filter(b => b.status === 'Draft');

    let displayBookings;

    if (view === 'drafts') {
      displayBookings = draftBookings;
    } else {
      displayBookings = bookings.filter(booking => {
        if (booking.status === 'Draft') return false;
        if (statusFilter !== "All" && booking.status !== statusFilter) {
          return false;
        }
        return true;
      });
    }

    const finalFiltered = displayBookings.filter(booking => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const customer = customers.find((c) => c.id === booking.customerId);

        switch (searchCategory) {
          case "Name":
            return customer?.name.toLowerCase().includes(query) || false;
          case "Phone":
            return customer?.phone.includes(query) || false;
          case "Booking ID":
            return booking.id.toLowerCase().includes(query);
          case "All":
          default:
            const customerName = customer?.name.toLowerCase() || "";
            const customerPhone = customer?.phone || "";
            const bookingId = booking.id.toLowerCase();
            return (
              customerName.includes(query) ||
              bookingId.includes(query) ||
              customerPhone.includes(query)
            );
        }
      }
      return true;
    });

    const sorted = finalFiltered.sort((a, b) => {
      const statusA = statusOrder[a.status] || 99;
      const statusB = statusOrder[b.status] || 99;

      if (statusA !== statusB) {
        return statusA - statusB;
      }

      const dateA = a.createdAt ? new Date(a.createdAt) : 0;
      const dateB = b.createdAt ? new Date(b.createdAt) : 0;
      return dateB - dateA;
    });

    return { draftsCount: draftBookings.length, filteredBookings: sorted };

  }, [bookings, searchQuery, statusFilter, customers, view]);

  const handleOpenAddModal = () => {
    setEditingBooking(null);
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => setAddModalOpen(false);

  const handleOpenInfoModal = (booking) => setSelectedBooking(booking);
  const handleCloseInfoModal = () => setSelectedBooking(null);

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setAddModalOpen(true);
  };

  const handleDeleteBooking = async (booking) => {
    if (window.confirm(`Are you sure you want to delete booking #${booking.id.slice(0, 6)}?`)) {
      try {
        const bookingRef = ref(db, `users/${userInfo.uid}/bookings/${booking.id}`);
        await remove(bookingRef);
        await updateCustomerStats(booking.customerId);
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  const handleStatusChange = async (booking, newStatus) => {
    if (window.confirm(`Change booking #${booking.id.slice(0, 6)} status to ${newStatus}?`)) {
      try {
        const bookingRef = ref(db, `users/${userInfo.uid}/bookings/${booking.id}`);
        await update(bookingRef, { status: newStatus });
        await updateCustomerStats(booking.customerId);
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    }
  };

  const updateCustomerStats = async (customerId) => {
    const bookingsRef = ref(db, `users/${userInfo.uid}/bookings`);
    const snapshot = await get(bookingsRef);
    const allBookings = snapshot.val() || {};

    const customerBookings = Object.values(allBookings).filter(b => b.customerId === customerId);

    const totalSpent = customerBookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
    const totalBookings = customerBookings.length;
    const totalOutstanding = customerBookings.reduce((acc, b) => acc + (b.dueAmount > 0 ? b.dueAmount : 0), 0);
    const activeBookings = customerBookings.filter(b => b.status !== 'Completed' && b.status !== 'Postponed').length;

    const customerRef = ref(db, `users/${userInfo.uid}/customers/${customerId}`);
    await update(customerRef, {
      totalSpent,
      totalBookings,
      totalOutstanding,
      activeBookings
    });
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (isSearching) setSearchQuery("");
  };

  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Bookings</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col md:flex-row items-start md:items-center gap-2">
            <div className="w-full md:w-auto flex items-center gap-2">
              <div className="relative flex-grow">
                <label htmlFor="searchQuery" className="sr-only">Search bookings</label>
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="searchQuery"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <label htmlFor="searchCategory" className="sr-only">Search category</label>
              <select
                id="searchCategory"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All</option>
                <option value="Name">Name</option>
                <option value="Phone">Phone</option>
                <option value="Booking ID">Booking ID</option>
              </select>
            </div>
            <div className="w-full md:w-auto flex items-center gap-2">
              {view === 'drafts' ? (
                <button
                  onClick={() => setView('active')}
                  className={`w-full md:w-auto flex items-center justify-center px-4 py-2 rounded-lg font-medium whitespace-nowrap bg-white border border-gray-300`}>
                  <FiArrowLeft className="mr-2" />
                  Back
                </button>
              ) : (
                <button
                  onClick={() => setView('drafts')}
                  className={`w-full md:w-auto flex items-center justify-center px-4 py-2 rounded-lg font-medium whitespace-nowrap ${view === 'drafts' ? 'bg-yellow-500 text-white' : 'bg-white border border-gray-300'}`}>
                  Drafts
                  {draftsCount > 0 && <span className="ml-2 bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 rounded-full">{draftsCount}</span>}
                </button>
              )}
              <label htmlFor="statusFilter" className="sr-only">Filter by status</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Statuses</option>
                <option value="Waiting for Delivery">Waiting for Delivery</option>
                <option value="Waiting for Return">Waiting for Return</option>
                <option value="Postponed">Postponed</option>
                <option value="Completed">Completed</option>
              </select>
              <button
                onClick={handleOpenAddModal}
                className="w-full md:w-auto flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium whitespace-nowrap"
              >
                <FiPlus className="mr-2" size={18} />
                <span>Add Booking</span>
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 px-0 md:px-0 pb-6">
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} height={230} className="rounded-xl" />
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 px-0 md:px-0 pb-6">
            <AnimatePresence>
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <BookingsCard 
                    booking={booking}
                    onView={() => handleOpenInfoModal(booking)}
                    onEdit={() => handleEditBooking(booking)}
                    onDelete={() => handleDeleteBooking(booking)}
                    onStatusChange={handleStatusChange}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState 
            title={searchQuery || statusFilter !== "All" ? 'No bookings found' : 'No bookings yet'}
            description={
              searchQuery 
                ? 'Try a different search term' 
                : statusFilter !== "All"
                  ? `No bookings with status "${statusFilter}"`
                  : 'Get started by adding your first booking'
            }
            buttonText="Add Booking"
            onButtonClick={handleOpenAddModal}
          />
        )}
      </div>

      <AddNewBookingForm 
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        booking={editingBooking}
      />
      
      <BookingInformationPopup 
        isOpen={!!selectedBooking}
        booking={selectedBooking}
        onClose={handleCloseInfoModal}
      />
    </Sidebar>
  );
};

export default Bookings;
