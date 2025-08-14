import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import AddNewBookingForm from "../modals/AddNewBookingForm";
import BookingsCard from "../cards/BookingsCard";
import BookingInformationPopup from "../modals/BookingInformationPopup";

const Bookings = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleOpenAddModal = () => setAddModalOpen(true);
  const handleCloseAddModal = () => setAddModalOpen(false);

  const handleOpenInfoModal = (booking) => setSelectedBooking(booking);
  const handleCloseInfoModal = () => setSelectedBooking(null);

  const handleEditBooking = (booking) => {
    console.log("Editing booking:", booking.id);
    // Here you would typically open an edit form
  };

  const handleDeleteBooking = (booking) => {
    console.log("Deleting booking:", booking.id);
    // Here you would typically show a confirmation dialog
  };

  const sampleBookings = [
    {
      id: 2024001,
      customerName: "Aarav Sharma",
      customerPhone: "+91 98765 43210",
      deliveryDate: "2025-09-01",
      returnDate: "2025-09-05",
      startDate: "2025-09-01",
      endDate: "2025-09-04",
      totalAmount: 2550,
      dueAmount: 550,
      deliveryType: "HomeDelivery",
      address: "123, Lotus Lane, Mumbai, Maharashtra, 400001",
      items: [
        { name: "Elegant Black Gown", price: 2000, startDate: "2025-09-01", endDate: "2025-09-04" },
        { name: "Matching Clutch", price: 500, startDate: "2025-09-01", endDate: "2025-09-04" },
      ],
      deliveryCharge: 50,
      otherCharges: 0,
      advances: [{ amount: 2000, date: "2025-08-28" }],
      notes: "Handle with care, fragile item. Deliver between 2-4 PM.",
    },
    {
      id: 2024002,
      customerName: "Diya Patel",
      customerPhone: "+91 87654 32109",
      deliveryDate: "2025-09-03",
      returnDate: "2025-09-10",
      startDate: "2025-09-03",
      endDate: "2025-09-09",
      totalAmount: 4500,
      dueAmount: 0,
      deliveryType: "CustomerPickup",
      address: "N/A",
      items: [{ name: "Red Floral Dress", price: 4500, startDate: "2025-09-03", endDate: "2025-09-09" }],
      deliveryCharge: 0,
      otherCharges: 0,
      advances: [
        { amount: 2000, date: "2025-08-25" },
        { amount: 2500, date: "2025-09-02" },
      ],
      notes: "",
    },
    {
      id: 2024003,
      customerName: "Rohan Das",
      customerPhone: "+91 76543 21098",
      deliveryDate: "2025-09-05",
      returnDate: "2025-09-08",
      startDate: "2025-09-05",
      endDate: "2025-09-07",
      totalAmount: 1200,
      dueAmount: 1200,
      deliveryType: "CustomerPickup",
      address: "N/A",
      items: [{ name: "Casual Blue Denim", price: 1200, startDate: "2025-09-05", endDate: "2025-09-07" }],
      deliveryCharge: 0,
      otherCharges: 0,
      advances: [],
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
            onClick={handleOpenAddModal}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-semibold"
          >
            Add Booking
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleBookings.map((booking) => (
                <BookingsCard 
                    key={booking.id} 
                    booking={booking}
                    onView={() => handleOpenInfoModal(booking)}
                    onEdit={() => handleEditBooking(booking)}
                    onDelete={() => handleDeleteBooking(booking)}
                />
            ))}
        </div>

      </div>
      {isAddModalOpen && <AddNewBookingForm onClose={handleCloseAddModal} />}
      {selectedBooking && <BookingInformationPopup booking={selectedBooking} onClose={handleCloseInfoModal} />}
    </Sidebar>
  );
};

export default Bookings;