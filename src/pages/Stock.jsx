import React, { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import AddItemsForm from "../modals/AddItemsForm";
import StockItemCard from "../cards/StockItemCard";
import ItemInformationPopup from "../modals/ItemInformationPopup";
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "../components/EmptyState";

const Stock = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (userInfo) {
      setIsLoading(true);
      const itemsRef = ref(db, `users/${userInfo.uid}/items`);
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

      onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const itemsList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setItems(itemsList);
        } else {
          setItems([]);
        }
        setIsLoading(false);
      });
    }
  }, [db, userInfo]);

  const itemsWithBookingCount = items.map(item => {
    const rented = bookings.filter(booking => booking.itemName === item.name).length;
    return { ...item, rented };
  });

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

  const handleEditItem = (item) => {
    setEditingItem(item);
    setAddModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const itemRef = ref(db, `users/${userInfo.uid}/items/${item.id}`);
      remove(itemRef)
        .then(() => {
          console.log("Item deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting item: ", error);
        });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
 <Sidebar>
      <div className="flex flex-col px-4 py-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-500 text-sm sm:text-base">
              {itemsWithBookingCount.length} {itemsWithBookingCount.length === 1 ? 'item' : 'items'} in stock
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenAddModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm sm:text-base font-medium shadow-sm w-full sm:w-auto"
          >
            Add New Item
          </motion.button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg h-40 animate-pulse"></div>
            ))}
          </div>
        ) : itemsWithBookingCount.length === 0 ? (
          <EmptyState 
            title="No Items Found"
            description="Add your first item to get started"
            buttonText="Add Item"
            onButtonClick={handleOpenAddModal}
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
          >
            <AnimatePresence>
              {itemsWithBookingCount.map((item) => (
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
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddItemsForm onClose={handleCloseAddModal} item={editingItem} />
        )}
      </AnimatePresence>

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
    </Sidebar>
  );
};

export default Stock;
