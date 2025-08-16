import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../layout/Sidebar";
import AddCustomerPopup from "../modals/AddCustomerPopup";
import CustomerCard from "../cards/CustomerCard";
import CustomerInformationPopup from "../modals/CustomerInformationPopup";
import CustomerHistoryPopup from "../modals/CustomerHistoryPopup";
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { FiPlus, FiSearch } from "react-icons/fi";

const Customers = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (userInfo) {
      const customersRef = ref(db, `users/${userInfo.uid}/customers`);
      const unsubscribeCustomers = onValue(customersRef, (snapshot) => {
        const data = snapshot.val();
        setCustomers(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
      });

      const bookingsRef = ref(db, `users/${userInfo.uid}/bookings`);
      const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
        const data = snapshot.val();
        setBookings(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
      });

      const itemsRef = ref(db, `users/${userInfo.uid}/items`);
      const unsubscribeItems = onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        setStockItems(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
      });

      return () => {
        unsubscribeCustomers();
        unsubscribeBookings();
        unsubscribeItems();
      };
    }
  }, [db, userInfo]);

  const customerStats = useMemo(() => {
    return customers.map(customer => {
      const customerBookings = bookings.filter(b => b.customerId === customer.id);
      const totalSpent = customerBookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
      const totalBookings = customerBookings.length;
      const activeBookings = customerBookings.filter(b => b.status !== 'Completed').length;
      const totalOutstanding = customerBookings.reduce((acc, b) => acc + (b.dueAmount > 0 ? b.dueAmount : 0), 0);

      return {
        ...customer,
        totalSpent,
        totalBookings,
        activeBookings,
        totalOutstanding,
        bookings: customerBookings
      };
    });
  }, [customers, bookings]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customerStats;
    const query = searchQuery.toLowerCase();
    return customerStats.filter((customer) => {
      switch (searchCategory) {
        case "Name":
          return customer.name?.toLowerCase().includes(query) || false;
        case "Phone":
          return customer.phone?.includes(query) || false;
        default:
          return (
            customer.name?.toLowerCase().includes(query) ||
            customer.phone?.includes(query)
          );
      }
    });
  }, [customerStats, searchQuery, searchCategory]);

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => setAddModalOpen(false);

  const handleOpenInfoModal = (customer) => {
    setSelectedCustomer(customer);
    setInfoModalOpen(true);
  };

  const handleCloseInfoModal = () => setInfoModalOpen(false);

  const handleOpenHistoryModal = (customer) => {
    setSelectedCustomer(customer);
    setHistoryModalOpen(true);
  };

  const handleCloseHistoryModal = () => setHistoryModalOpen(false);

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setAddModalOpen(true);
  };

  const handleDeleteCustomer = async (customer) => {
    if (customer.totalBookings > 0) {
      alert("Cannot delete a customer with existing bookings. Please delete their bookings first.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      try {
        const customerRef = ref(db, `users/${userInfo.uid}/customers/${customer.id}`);
        await remove(customerRef);
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 px-4 md:px-0">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Customers</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'} registered
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All</option>
              <option value="Name">Name</option>
              <option value="Phone">Phone</option>
            </select>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium whitespace-nowrap"
            >
              <FiPlus className="mr-2" size={18} />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-0 pb-6">
          {filteredCustomers.map((customer) => (
            <div 
              key={customer.id} 
              onClick={() => handleOpenInfoModal(customer)} 
              className="cursor-pointer"
            >
              <CustomerCard 
                customer={customer} 
                onEdit={(e) => { e.stopPropagation(); handleEditCustomer(customer); }} 
                onDelete={(e) => { e.stopPropagation(); handleDeleteCustomer(customer); }} 
                onHistoryClick={(e) => { e.stopPropagation(); handleOpenHistoryModal(customer); }}
              />
            </div>
          ))}
        </div>
      </div>

      <AddCustomerPopup 
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal} 
        customer={editingCustomer} 
        customers={customers}
      />
      
      <CustomerInformationPopup 
        isOpen={isInfoModalOpen}
        customer={selectedCustomer} 
        onClose={handleCloseInfoModal} 
        onEdit={() => {
          handleCloseInfoModal();
          handleEditCustomer(selectedCustomer);
        }}
      />
      
      <CustomerHistoryPopup 
        isOpen={isHistoryModalOpen}
        customer={selectedCustomer} 
        bookings={selectedCustomer?.bookings || []} 
        stockItems={stockItems} 
        onClose={handleCloseHistoryModal} 
      />
    </Sidebar>
  );
};

export default Customers;