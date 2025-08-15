import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../layout/Sidebar";
import AddNewBookingForm from "../modals/AddNewBookingForm";
import BookingsCard from "../cards/BookingsCard";
import BookingInformationPopup from "../modals/BookingInformationPopup";
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { FiPlus, FiSearch, FiCalendar, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Bookings = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (!userInfo) return;

    const bookingsRef = ref(db, `users/${userInfo.uid}/bookings`);
    const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      setBookings(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
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
  }, [db, userInfo]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      if (statusFilter !== "All" && booking.status !== statusFilter) {
        return false;
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const customer = customers.find(c => c.id === booking.customerId);
        const customerName = customer?.name.toLowerCase() || '';
        const customerPhone = customer?.phone || '';
        const bookingId = booking.id.toLowerCase();
        
        return (
          customerName.includes(query) ||
          bookingId.includes(query) ||
          customerPhone.includes(query)
        );
      }
      
      return true;
    });
  }, [bookings, searchQuery, statusFilter, customers]);

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
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    }
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (isSearching) setSearchQuery("");
  };

  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 px-4 md:px-0">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Bookings</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
            </p>
          </div>
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
            {isSearching ? (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                className="relative flex-grow"
              >
                <input
                  type="text"
                  placeholder="Search bookings..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <button 
                  onClick={toggleSearch}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </motion.div>
            ) : (
              <>
                <button
                  onClick={toggleSearch}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
                  aria-label="Search bookings"
                >
                  <FiSearch size={20} />
                </button>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Waiting for Delivery">Waiting for Delivery</option>
                  <option value="Waiting for Return">Waiting for Return</option>
                  <option value="Completed">Completed</option>
                </select>
                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  <FiPlus className="mr-2" size={18} />
                  <span>Add Booking</span>
                </button>
              </>
            )}
          </div>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-0 pb-6">
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
          <div className="flex flex-col items-center justify-center flex-grow text-center py-12 px-4">
            <div className="max-w-md">
              <div className="bg-indigo-100 p-5 rounded-full inline-block mb-4">
                <FiCalendar size={40} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchQuery || statusFilter !== "All" ? 'No bookings found' : 'No bookings yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? 'Try a different search term' 
                  : statusFilter !== "All"
                    ? `No bookings with status "${statusFilter}"`
                    : 'Get started by adding your first booking'}
              </p>
              {!searchQuery && statusFilter === "All" && (
                <button
                  onClick={handleOpenAddModal}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 font-medium"
                >
                  <FiPlus className="inline mr-2" />
                  Add Booking
                </button>
              )}
            </div>
          </div>
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
