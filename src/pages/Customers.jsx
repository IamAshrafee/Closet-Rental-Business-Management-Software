import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import AddCustomerPopup from "../modals/AddCustomerPopup";
import CustomerCard from "../cards/CustomerCard";

const Customers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const sampleCustomers = [
    {
      name: "Aarav Sharma",
      phone: "+91 98765 43210",
      address: "123, Lotus Lane, Mumbai, Maharashtra, 400001",
    },
    {
      name: "Diya Patel",
      phone: "+91 87654 32109",
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
            onClick={handleOpenModal}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-semibold"
          >
            Add Customer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleCustomers.map((customer, index) => (
            <CustomerCard key={index} customer={customer} />
          ))}
        </div>
      </div>
      {isModalOpen && <AddCustomerPopup onClose={handleCloseModal} />}
    </Sidebar>
  );
};

export default Customers;