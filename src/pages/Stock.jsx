import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../layout/Sidebar";
import AddItemsForm from "../modals/AddItemsForm";
import StockItemCard from "../cards/StockItemCard";
import ItemInformationPopup from "../modals/ItemInformationPopup";
import BookingInformationPopup from "../modals/BookingInformationPopup";
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "../components/EmptyState";
import { FiPlus, FiSearch, FiFilter, FiRefreshCw } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Stock = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sortOption, setSortOption] = useState("name-asc");
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  // Fetch data from Firebase
  useEffect(() => {
    if (userInfo) {
      setIsLoading(true);
      const itemsRef = ref(db, `users/${userInfo.uid}/items`);
      const bookingsRef = ref(db, `users/${userInfo.uid}/bookings`);
      const customersRef = ref(db, `users/${userInfo.uid}/customers`);

      const unsubscribeCustomers = onValue(customersRef, (snapshot) => {
        const data = snapshot.val();
        setCustomers(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
      });

      const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
        const data = snapshot.val();
        setBookings(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
      });

      const unsubscribeItems = onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        setItems(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
        setIsLoading(false);
      });

      return () => {
        unsubscribeCustomers();
        unsubscribeBookings();
        unsubscribeItems();
      };
    }
  }, [db, userInfo]);

  // Process items with booking data
  const itemsWithBookingData = useMemo(() => {
    const bookingsByItem = {};
    const customerMap = new Map(customers.map(c => [c.id, c.name]));

    // Initialize for all items
    items.forEach(item => {
      bookingsByItem[item.id] = {
        activeBookings: [],
        allBookings: []
      };
    });

    // Populate booking data
    bookings.forEach(booking => {
      const enrichedBooking = {
        ...booking,
        customerName: customerMap.get(booking.customerId) || 'Unknown Customer',
      };

      if (enrichedBooking.items?.length) {
        enrichedBooking.items.forEach(bookingItem => {
          if (bookingItem.itemId && bookingsByItem[bookingItem.itemId]) {
            bookingsByItem[bookingItem.itemId].allBookings.push(enrichedBooking);
            if (enrichedBooking.status !== 'Completed') {
              bookingsByItem[bookingItem.itemId].activeBookings.push(enrichedBooking);
            }
          }
        });
      }
    });

    return items.map(item => ({
      ...item,
      rented: bookingsByItem[item.id]?.allBookings.length || 0,
      activeBookings: bookingsByItem[item.id]?.activeBookings || [],
      activeBookingsCount: bookingsByItem[item.id]?.activeBookings.length || 0,
    }));
  }, [items, bookings, customers]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return itemsWithBookingData
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAvailability = 
          availabilityFilter === "all" || 
          item.availability === availabilityFilter;
        return matchesSearch && matchesAvailability;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "name-asc": return a.name.localeCompare(b.name);
          case "name-desc": return b.name.localeCompare(a.name);
          case "price-asc": return (a.rentValue || 0) - (b.rentValue || 0);
          case "price-desc": return (b.rentValue || 0) - (a.rentValue || 0);
          case "popularity": return (b.rented || 0) - (a.rented || 0);
          default: return 0;
        }
      });
  }, [itemsWithBookingData, searchTerm, availabilityFilter, sortOption]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => setAddModalOpen(false);

  const handleOpenInfoModal = (item) => {
    setSelectedItem(item);
    setInfoModalOpen(true);
  };

  const handleCloseInfoModal = () => {
    setSelectedItem(null);
    setInfoModalOpen(false);
  };

  const handleOpenBookingInfoModal = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseBookingInfoModal = () => {
    setSelectedBooking(null);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setAddModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    if (item.activeBookingsCount > 0) {
      alert("Cannot delete an item with active bookings. Please complete or delete the active bookings first.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      const itemRef = ref(db, `users/${userInfo.uid}/items/${item.id}`);
      remove(itemRef).catch(error => console.error("Error deleting item:", error));
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500); // Simulate refresh
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Sidebar>
      <div className="flex flex-col px-4 py-6 sm:px-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-500 text-sm sm:text-base">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} displayed
              {itemsWithBookingData.length !== filteredItems.length && 
                ` (of ${itemsWithBookingData.length} total)`}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenAddModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-medium shadow-sm flex items-center justify-center gap-2"
            >
              <FiPlus size={18} />
              Add New Item
            </motion.button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            
            <div className="relative flex-1">
              <select
                className="pl-4 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="name-asc">Sort: A-Z</option>
                <option value="name-desc">Sort: Z-A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>
          
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <FiRefreshCw size={18} />
            <span className="hidden sm:inline">Refresh</span>
          </motion.button>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} height={176} className="rounded-xl" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState 
            title={searchTerm ? "No matching items found" : "Your inventory is empty"}
            description={searchTerm ? "Try adjusting your search or filters" : "Add your first item to get started"}
            buttonText="Add Item"
            onButtonClick={handleOpenAddModal}
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <StockItemCard 
                    item={item} 
                    onClick={() => handleOpenInfoModal(item)}
                    onEdit={(e) => { e.stopPropagation(); handleEditItem(item); }}
                    onDelete={(e) => { e.stopPropagation(); handleDeleteItem(item); }}
                    onViewBookingDetails={handleOpenBookingInfoModal}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Modals */}
        <AddItemsForm
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          item={editingItem}
        />

        <AnimatePresence>
          {isInfoModalOpen && (
            <ItemInformationPopup
              item={selectedItem}
              onClose={handleCloseInfoModal}
              onEdit={() => {
                handleCloseInfoModal();
                handleEditItem(selectedItem);
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedBooking && (
            <BookingInformationPopup
              booking={selectedBooking}
              onClose={handleCloseBookingInfoModal}
            />
          )}
        </AnimatePresence>
      </div>
    </Sidebar>
  );
};

export default Stock;