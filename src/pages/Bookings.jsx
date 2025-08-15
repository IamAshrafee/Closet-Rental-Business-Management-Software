import React, { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import AddNewBookingForm from "../modals/AddNewBookingForm";
import BookingsCard from "../cards/BookingsCard";
import BookingInformationPopup from "../modals/BookingInformationPopup";
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";

const Bookings = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (userInfo) {
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
    }
  }, [db, userInfo]);

  const handleOpenAddModal = () => {
    setEditingBooking(null);
    setAddModalOpen(true);
  };
  const handleCloseAddModal = () => setAddModalOpen(false);

  const handleOpenInfoModal = (booking) => setSelectedBooking(booking);
  const handleCloseInfoModal = () => setSelectedBooking(null);

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setAddModalOpen(true);
  };

  const handleDeleteBooking = (booking) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const bookingRef = ref(db, `users/${userInfo.uid}/bookings/${booking.id}`);
      remove(bookingRef)
        .then(() => {
          console.log("Booking deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting booking: ", error);
        });
    }
  };

  const handleStatusChange = (booking, newStatus) => {
    if (window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
      const bookingRef = ref(db, `users/${userInfo.uid}/bookings/${booking.id}`);
      update(bookingRef, { status: newStatus })
        .then(() => {
          console.log(`Booking status updated to ${newStatus}`);
        })
        .catch((error) => {
          console.error("Error updating booking status: ", error);
        });
    }
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
            onClick={handleOpenAddModal}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-semibold"
          >
            Add Booking
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => (
                <BookingsCard 
                    key={booking.id} 
                    booking={booking}
                    onView={() => handleOpenInfoModal(booking)}
                    onEdit={() => handleEditBooking(booking)}
                    onDelete={() => handleDeleteBooking(booking)}
                    onStatusChange={handleStatusChange}
                />
            ))}
        </div>

      </div>
      {isAddModalOpen && <AddNewBookingForm onClose={handleCloseAddModal} booking={editingBooking} />}
      {selectedBooking && <BookingInformationPopup booking={selectedBooking} onClose={handleCloseInfoModal} />}
    </Sidebar>
  );
};

export default Bookings;
