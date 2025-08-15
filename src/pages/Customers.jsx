import React, { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import AddCustomerPopup from "../modals/AddCustomerPopup";
import CustomerCard from "../cards/CustomerCard";
import CustomerInformationPopup from "../modals/CustomerInformationPopup";
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue, remove } from "firebase/database";

const Customers = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (userInfo) {
      const customersRef = ref(db, `users/${userInfo.uid}/customers`);
      onValue(customersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const customersList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setCustomers(customersList);
        } else {
          setCustomers([]);
        }
      });
    }
  }, [db, userInfo]);

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setAddModalOpen(true);
  };
  const handleCloseAddModal = () => setAddModalOpen(false);

  const handleOpenInfoModal = (customer) => {
    setSelectedCustomer(customer);
    setInfoModalOpen(true);
  };
  const handleCloseInfoModal = () => {
    setSelectedCustomer(null);
    setInfoModalOpen(false);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setAddModalOpen(true);
  };

  const handleDeleteCustomer = (customer) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const customerRef = ref(db, `users/${userInfo.uid}/customers/${customer.id}`);
      remove(customerRef)
        .then(() => {
          console.log("Customer deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting customer: ", error);
        });
    }
  };

  return (
    <Sidebar>
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold font-poppins">Customers</h1>
            <p className="font-poppins text-gray-500 mt-2">
              Welcome to your customer management dashboard
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-semibold"
          >
            Add Customer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {customers.map((customer) => (
            <div key={customer.id} onClick={() => handleOpenInfoModal(customer)} className="cursor-pointer">
              <CustomerCard 
                customer={customer} 
                onEdit={(e) => { e.stopPropagation(); handleEditCustomer(customer); }} 
                onDelete={(e) => { e.stopPropagation(); handleDeleteCustomer(customer); }} 
              />
            </div>
          ))}
        </div>
      </div>
      {isAddModalOpen && <AddCustomerPopup onClose={handleCloseAddModal} customer={editingCustomer} />}
      {isInfoModalOpen && <CustomerInformationPopup customer={selectedCustomer} onClose={handleCloseInfoModal} />}
    </Sidebar>
  );
};

export default Customers;
