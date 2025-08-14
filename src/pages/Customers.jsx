import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import AddCustomerPopup from "../modals/AddCustomerPopup";
import CustomerCard from "../cards/CustomerCard";
import CustomerInformationPopup from "../modals/CustomerInformationPopup";

const Customers = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleOpenAddModal = () => setAddModalOpen(true);
  const handleCloseAddModal = () => setAddModalOpen(false);

  const handleOpenInfoModal = (customer) => {
    setSelectedCustomer(customer);
    setInfoModalOpen(true);
  };
  const handleCloseInfoModal = () => {
    setSelectedCustomer(null);
    setInfoModalOpen(false);
  };

  const sampleCustomers = [
    {
      name: "Aarav Sharma",
      phone: "+91 98765 43210",
      altPhone: "+91 98765 11111",
      nid: "1234 5678 9012",
      parentNid: "9876 5432 1098",
      parentType: "Father",
      husbandNid: "N/A",
      fbId: "https://facebook.com/aarav.sharma",
      address: "123, Lotus Lane, Mumbai, Maharashtra, 400001",
    },
    {
      name: "Diya Patel",
      phone: "+91 87654 32109",
      altPhone: "",
      nid: "2345 6789 0123",
      parentNid: "8765 4321 0987",
      parentType: "Mother",
      husbandNid: "3456 7890 1234",
      fbId: "https://facebook.com/diya.patel",
      address: "456, Rose Garden, Ahmedabad, Gujarat, 380009",
    },
    {
      name: "Rohan Das",
      phone: "+91 76543 21098",
      address: "789, Orchid Street, Kolkata, West Bengal, 700016",
    },
  ];

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
          {sampleCustomers.map((customer, index) => (
            <div key={index} onClick={() => handleOpenInfoModal(customer)} className="cursor-pointer">
              <CustomerCard customer={customer} />
            </div>
          ))}
        </div>
      </div>
      {isAddModalOpen && <AddCustomerPopup onClose={handleCloseAddModal} />}
      {isInfoModalOpen && <CustomerInformationPopup customer={selectedCustomer} onClose={handleCloseInfoModal} />}
    </Sidebar>
  );
};

export default Customers;