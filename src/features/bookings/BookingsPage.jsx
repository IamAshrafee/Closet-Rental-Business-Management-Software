import React, { useState, useMemo, useEffect, useRef } from "react";
import Sidebar from "../../layout/Sidebar";
import AddNewBookingForm from "./AddNewBookingForm";
import BookingsCard from "./BookingsCard";
import BookingInformationPopup from "./BookingInformationPopup";
import { useSelector } from "react-redux";
import { ref, remove, update } from "firebase/database";
import { db } from "../../lib/firebase";
import { FiPlus, FiSearch, FiFilter, FiX, FiChevronDown, FiArrowLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import EmptyState from "../../components/EmptyState";
import { useUpdateCustomerStats } from "../../hooks/useUpdateCustomerStats";

const CustomSelect = ({ options, value, onChange, className = "", isOpen, onToggle }) => {
  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        onClick={onToggle}
      >
        <span>{selectedOption.label}</span>
        <FiChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto"
          >
            {options.map((option) => (
              <button
                key={option.value}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${value === option.value ? "bg-indigo-50 text-indigo-700" : "text-gray-700"}`}
                onClick={() => { onChange(option.value); onToggle(); }}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Bookings = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView] = useState("active"); // active, drafts
  const [openDropdown, setOpenDropdown] = useState(null);
  const filtersContainerRef = useRef(null);

  const userInfo = useSelector((state) => state.userLogInfo.value);
  const { bookings, status: bookingsStatus } = useSelector((state) => state.bookings);
  const { customers, status: customersStatus } = useSelector((state) => state.customers);
  const { updateStats } = useUpdateCustomerStats();

  const isLoading = useMemo(() => 
    bookingsStatus === 'loading' || customersStatus === 'loading' || bookingsStatus === 'idle' || customersStatus === 'idle',
    [bookingsStatus, customersStatus]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersContainerRef.current && !filtersContainerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { draftsCount, filteredBookings } = useMemo(() => {
    const statusOrder = {
      'Waiting for Delivery': 1,
      'Waiting for Return': 2,
      'Postponed': 3,
      'Completed': 4,
    };

    const customerMap = new Map(customers.map(c => [c.id, c]));
    const enrichedBookings = bookings.map(b => ({
      ...b,
      customer: customerMap.get(b.customerId)
    }));

    const draftBookings = enrichedBookings.filter(b => b.status === 'Draft');
    let displayBookings = view === 'drafts' 
      ? draftBookings 
      : enrichedBookings.filter(b => b.status !== 'Draft');

    if (statusFilter !== "All") {
      displayBookings = displayBookings.filter(b => b.status === statusFilter);
    }

    const finalFiltered = displayBookings.filter(booking => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const customerName = booking.customer?.name.toLowerCase() || "";
      const customerPhone = booking.customer?.phone || "";
      const bookingId = booking.id.toLowerCase();
      return customerName.includes(query) || bookingId.includes(query) || customerPhone.includes(query);
    });

    const sorted = finalFiltered.sort((a, b) => {
      const statusA = statusOrder[a.status] || 99;
      const statusB = statusOrder[b.status] || 99;
      if (statusA !== statusB) return statusA - statusB;
      return new Date(b.createdAt) - new Date(a.createdAt);
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
        await updateStats(booking.customerId);
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
        await updateStats(booking.customerId);
      } catch (error) {
        console.error("Error updating booking status:", error);
      }
    }
  };

  const statusOptions = [
    { value: "All", label: "All Statuses" },
    { value: "Waiting for Delivery", label: "Waiting for Delivery" },
    { value: "Waiting for Return", label: "Waiting for Return" },
    { value: "Postponed", label: "Postponed" },
    { value: "Completed", label: "Completed" },
  ];

  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium whitespace-nowrap"
          >
            <FiPlus className="mr-2" size={18} />
            <span>Add Booking</span>
          </button>
        </div>

        <div ref={filtersContainerRef} className="mb-6 space-y-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, phone, or booking ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && <FiX onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" />}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CustomSelect
              options={[{ value: 'active', label: 'Active Bookings' }, { value: 'drafts', label: `Drafts (${draftsCount})` }]}
              value={view}
              onChange={setView}
              isOpen={openDropdown === 'view'}
              onToggle={() => setOpenDropdown(openDropdown === 'view' ? null : 'view')}
            />
            <CustomSelect
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              isOpen={openDropdown === 'status'}
              onToggle={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => <Skeleton key={index} height={230} className="rounded-xl" />)}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
                    customer={booking.customer}
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
            description={searchQuery ? 'Try a different search term' : 'Get started by adding your first booking'}
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