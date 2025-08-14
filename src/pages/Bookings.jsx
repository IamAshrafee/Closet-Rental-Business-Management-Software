import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import AddNewBookingForm from "../modals/AddNewBookingForm";
import BookingsCard from "../cards/BookingsCard";

const Bookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const sampleBookings = [
    {
      id: 1,
      customerName: "Aarav Sharma",
      customerPhone: "+91 98765 43210",
      deliveryDate: "2025-09-01",
      returnDate: "2025-09-05",
      startDate: "2025-09-01",
      endDate: "2025-09-04",
      totalAmount: 2500,
      dueAmount: 500,
      notes: "Handle with care, fragile item.",
    },
    {
      id: 2,
      customerName: "Diya Patel",
      customerPhone: "+91 87654 32109",
      deliveryDate: "2025-09-03",
      returnDate: "2025-09-10",
      startDate: "2025-09-03",
      endDate: "2025-09-09",
      totalAmount: 4500,
      dueAmount: 0,
      notes: "",
    },
    {
        id: 3,
        customerName: "Rohan Das",
        customerPhone: "+91 76543 21098",
        deliveryDate: "2025-09-05",
        returnDate: "2025-09-08",
        startDate: "2025-09-05",
        endDate: "2025-09-07",
        totalAmount: 1200,
        dueAmount: 1200,
        notes: "Customer will pickup from the store.",
      },
  ];

  return (
    <Sidebar>
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold font-poppins">Bookings</h1>
            <p className="font-poppins text-gray-500 mt-2">
              Manage your rental bookings and schedules
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-semibold"
          >
            Add Booking
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleBookings.map((booking) => (
                <BookingsCard key={booking.id} booking={booking} />
            ))}
        </div>

      </div>
      {isModalOpen && <AddNewBookingForm onClose={handleCloseModal} />}
    </Sidebar>
  );
};

export default Bookings;