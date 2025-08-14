import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";

const Bookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
        {/* Content for bookings will go here */}
      </div>
      {/* {isModalOpen && <AddBookingPopup onClose={handleCloseModal} />} */}
    </Sidebar>
  );
};

export default Bookings;