import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../layout/Sidebar";
import AddItemsForm from "./AddItemsForm";
import StockItemCard from "./StockItemCard";
import ItemInformationPopup from "./ItemInformationPopup";
import BookingInformationPopup from "../bookings/BookingInformationPopup";
import { useSelector } from "react-redux";
import { ref, onValue, remove } from "firebase/database";
import { db } from "../../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "../../components/EmptyState";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const getRepresentativePrice = (item) => {
  switch (item.rentOption) {
    case "fixed":
      return Number(item.rentValue) || 0;
    case "per-day":
      return Number(item.rentPerDay) || 0;
    case "range":
      return Number(item.rentFrom) || 0;
    default:
      return 0;
  }
};

const CustomSelect = ({
  options,
  value,
  onChange,
  icon: Icon,
  className = "",
  isOpen,
  onToggle,
}) => {
  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-gray-400" size={16} />}
          <span>{selectedOption.label}</span>
        </div>
        <FiChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            {options.map((option) => (
              <button
                key={option.value}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center ${
                  value === option.value
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700"
                }`}
                onClick={() => {
                  onChange(option.value);
                  onToggle();
                }}
              >
                {option.hex && (
                  <span
                    className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                    style={{ backgroundColor: option.hex }}
                  ></span>
                )}
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
  const [colorFilter, setColorFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewFilter, setViewFilter] = useState("published"); // published, drafts
  const [sortOption, setSortOption] = useState("name-asc");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const userInfo = useSelector((state) => state.userLogInfo.value);
  const colorsList = useSelector((state) => state.color.value);
  const categoriesList = useSelector((state) => state.category.value);

  // Fetch data from Firebase
  useEffect(() => {
    if (userInfo) {
      setIsLoading(true);
      const itemsRef = ref(db, `users/${userInfo.uid}/items`);
      const bookingsRef = ref(db, `users/${userInfo.uid}/bookings`);
      const customersRef = ref(db, `users/${userInfo.uid}/customers`);

      const unsubscribeCustomers = onValue(customersRef, (snapshot) => {
        const data = snapshot.val();
        setCustomers(
          data
            ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
            : []
        );
      });

      const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
        const data = snapshot.val();
        setBookings(
          data
            ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
            : []
        );
      });

      const unsubscribeItems = onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        setItems(
          data
            ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
            : []
        );
        setIsLoading(false);
      });

      return () => {
        unsubscribeCustomers();
        unsubscribeBookings();
        unsubscribeItems();
      };
    }
  }, [userInfo, refreshKey]);

  // Process items with booking data
  const itemsWithBookingData = useMemo(() => {
    const bookingsByItem = {};
    const customerMap = new Map(customers.map((c) => [c.id, c.name]));

    // Initialize for all items
    items.forEach((item) => {
      bookingsByItem[item.id] = {
        activeBookings: [],
        allBookings: [],
      };
    });

    // Populate booking data
    bookings.forEach((booking) => {
      const enrichedBooking = {
        ...booking,
        customerName: customerMap.get(booking.customerId) || "Unknown Customer",
      };

      if (enrichedBooking.items?.length) {
        enrichedBooking.items.forEach((bookingItem) => {
          if (bookingItem.itemId && bookingsByItem[bookingItem.itemId]) {
            bookingsByItem[bookingItem.itemId].allBookings.push(
              enrichedBooking
            );
            if (enrichedBooking.status !== "Completed") {
              bookingsByItem[bookingItem.itemId].activeBookings.push(
                enrichedBooking
              );
            }
          }
        });
      }
    });

    return items.map((item) => ({
      ...item,
      rented: bookingsByItem[item.id]?.allBookings.length || 0,
      activeBookings: bookingsByItem[item.id]?.activeBookings || [],
      activeBookingsCount: bookingsByItem[item.id]?.activeBookings.length || 0,
    }));
  }, [items, bookings, customers]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return itemsWithBookingData
      .filter((item) => {
        // View filter (published vs. drafts)
        if (viewFilter === "published") {
          if (item.status === 'draft') return false;
        } else if (viewFilter === "drafts") {
          if (item.status !== 'draft') return false;
        }

        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesAvailability =
          availabilityFilter === "all" ||
          item.availability === availabilityFilter;
        const matchesColor =
          colorFilter === "all" ||
          (item.colors && item.colors.includes(colorFilter));
        const matchesCategory =
          categoryFilter === "all" || item.category === categoryFilter;

        return (
          matchesSearch &&
          matchesAvailability &&
          matchesColor &&
          matchesCategory
        );
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "price-asc":
            return getRepresentativePrice(a) - getRepresentativePrice(b);
          case "price-desc":
            return getRepresentativePrice(b) - getRepresentativePrice(a);
          case "popularity":
            return (b.rented || 0) - (a.rented || 0);
          default:
            return 0;
        }
      });
  }, [
    itemsWithBookingData,
    searchTerm,
    availabilityFilter,
    colorFilter,
    categoryFilter,
    sortOption,
    viewFilter,
  ]);

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
      alert(
        "Cannot delete an item with active bookings. Please complete or delete the active bookings first."
      );
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      const itemRef = ref(db, `users/${userInfo.uid}/items/${item.id}`);
      remove(itemRef).catch((error) =>
        console.error("Error deleting item:", error)
      );
    }
  };

  const handleRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setAvailabilityFilter("all");
    setColorFilter("all");
    setCategoryFilter("all");
    setSortOption("name-asc");
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

  // Filter options
  const availabilityOptions = [
    { value: "all", label: "All Statuses" },
    { value: "available", label: "Available" },
    { value: "unavailable", label: "Unavailable" },
  ];

  const colorOptions = [
    { value: "all", label: "All Colors" },
    ...(colorsList?.map((color) => ({
      value: color.name,
      label: color.name,
      hex: color.hex,
    })) || []),
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...(categoriesList?.map((category) => ({
      value: category,
      label: category,
    })) || []),
  ];

  const sortOptions = [
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "popularity", label: "Most Popular" },
  ];

  const viewOptions = [
    { value: "published", label: "Published" },
    { value: "drafts", label: "Drafts" },
  ];

  return (
    <Sidebar>
      <div className="flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Inventory
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "item" : "items"} displayed
              {itemsWithBookingData.length !== filteredItems.length &&
                ` (of ${itemsWithBookingData.length} total)`}
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenAddModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium shadow-sm flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <FiPlus size={16} />
              <span className="hidden xs:inline">Add Item</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex sm:hidden items-center justify-center"
            >
              <FiFilter size={18} />
            </motion.button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-4 sm:mb-6">
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search items..."
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="text-gray-400 hover:text-gray-600" size={18} />
              </button>
            )}
          </div>

          {/* Mobile Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden bg-gray-50 p-3 rounded-lg mb-3 space-y-3"
              >
                <CustomSelect
                  options={viewOptions}
                  value={viewFilter}
                  onChange={setViewFilter}
                  isOpen={openDropdown === "view"}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === "view" ? null : "view")
                  }
                />
                <CustomSelect
                  options={availabilityOptions}
                  value={availabilityFilter}
                  onChange={setAvailabilityFilter}
                  icon={FiFilter}
                  isOpen={openDropdown === "availability"}
                  onToggle={() =>
                    setOpenDropdown(
                      openDropdown === "availability" ? null : "availability"
                    )
                  }
                />
                <CustomSelect
                  options={colorOptions}
                  value={colorFilter}
                  onChange={setColorFilter}
                  isOpen={openDropdown === "color"}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === "color" ? null : "color")
                  }
                />
                <CustomSelect
                  options={categoryOptions}
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  isOpen={openDropdown === "category"}
                  onToggle={() =>
                    setOpenDropdown(
                      openDropdown === "category" ? null : "category"
                    )
                  }
                />
                <CustomSelect
                  options={sortOptions}
                  value={sortOption}
                  onChange={setSortOption}
                  isOpen={openDropdown === "sort"}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === "sort" ? null : "sort")
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Filters */}
          <div className="hidden w-full sm:flex gap-3">
            <CustomSelect
              options={viewOptions}
              value={viewFilter}
              onChange={setViewFilter}
              isOpen={openDropdown === "view"}
              className="flex-1"
              onToggle={() =>
                setOpenDropdown(openDropdown === "view" ? null : "view")
              }
            />
            <CustomSelect
              options={availabilityOptions}
              value={availabilityFilter}
              onChange={setAvailabilityFilter}
              icon={FiFilter}
              isOpen={openDropdown === "availability"}
              className="flex-1"
              onToggle={() =>
                setOpenDropdown(
                  openDropdown === "availability" ? null : "availability"
                )
              }
            />
            <CustomSelect
              options={colorOptions}
              value={colorFilter}
              className="flex-1"
              onChange={setColorFilter}
              isOpen={openDropdown === "color"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "color" ? null : "color")
              }
            />
            <CustomSelect
              className="flex-1"
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
              isOpen={openDropdown === "category"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "category" ? null : "category")
              }
            />
            <CustomSelect
              className="flex-1"
              options={sortOptions}
              value={sortOption}
              onChange={setSortOption}
              isOpen={openDropdown === "sort"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "sort" ? null : "sort")
              }
            />
          </div>
        </div>

        {/* Active Filters Indicator */}
        {(searchTerm ||
          availabilityFilter !== "all" ||
          colorFilter !== "all" ||
          categoryFilter !== "all") && (
          <div className="mb-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1.5">
                  <FiX size={14} />
                </button>
              </span>
            )}
            {availabilityFilter !== "all" && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Status:{" "}
                {
                  availabilityOptions.find(
                    (opt) => opt.value === availabilityFilter
                  )?.label
                }
                <button
                  onClick={() => setAvailabilityFilter("all")}
                  className="ml-1.5"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
            {colorFilter !== "all" && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Color:{" "}
                {colorOptions.find((opt) => opt.value === colorFilter)?.label}
                <button
                  onClick={() => setColorFilter("all")}
                  className="ml-1.5"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
            {categoryFilter !== "all" && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Category:{" "}
                {
                  categoryOptions.find((opt) => opt.value === categoryFilter)
                    ?.label
                }
                <button
                  onClick={() => setCategoryFilter("all")}
                  className="ml-1.5"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(10)].map((_, index) => (
              <Skeleton key={index} height={176} className="rounded-xl" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title={
              searchTerm ||
              availabilityFilter !== "all" ||
              colorFilter !== "all"
                ? "No matching items found"
                : "Your inventory is empty"
            }
            description={
              searchTerm ||
              availabilityFilter !== "all" ||
              colorFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Add your first item to get started"
            }
            buttonText="Add Item"
            onButtonClick={handleOpenAddModal}
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols- gap-3 sm:gap-4"
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  role="button"
                  tabIndex="0"
                  onClick={() => handleOpenInfoModal(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpenInfoModal(item);
                    }
                  }}
                >
                  <StockItemCard
                    item={item}
                    onClick={() => handleOpenInfoModal(item)}
                    onEdit={(e) => {
                      e.stopPropagation();
                      handleEditItem(item);
                    }}
                    onDelete={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item);
                    }}
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
          stockItems={items}
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