import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import AddItemsForm from "../modals/AddItemsForm";
import StockItemCard from "../cards/StockItemCard";

const Stock = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const sampleItems = [
    {
      name: "Elegant Black Gown",
      availability: "Available",
      size: "M",
      color: "Black",
      long: "60 inches",
      price: "₹50/day",
      description: "A stunning black gown perfect for evening events. Features a sleek silhouette and fine detailing.",
      target: 10,
      rented: 4,
      imageUrl: "https://via.placeholder.com/300x200.png?text=Black+Gown",
    },
    {
      name: "Casual Blue Denim",
      availability: "Rented",
      size: "L",
      color: "Blue",
      price: "₹25/day",
      description: "Comfortable and stylish blue denim jacket. A versatile piece for any casual occasion.",
      target: 15,
      rented: 15,
      imageUrl: "https://via.placeholder.com/300x200.png?text=Blue+Denim",
    },
    {
        name: "Red Floral Dress",
        availability: "Available",
        size: "S",
        color: "Red",
        long: "45 inches",
        price: "₹40/day",
        description: "A beautiful red floral dress, perfect for summer outings and parties.",
        target: 8,
        rented: 2,
        imageUrl: "https://via.placeholder.com/300x200.png?text=Red+Dress",
      },
  ];

  return (
    <Sidebar>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold font-poppins">Stock</h1>
            <p className="font-poppins text-gray-500 mt-2">
              Welcome to your stock management dashboard
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-semibold"
          >
            Add Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleItems.map((item, index) => (
            <StockItemCard key={index} item={item} />
          ))}
        </div>
      </div>
      {isModalOpen && <AddItemsForm onClose={handleCloseModal} />}
    </Sidebar>
  );
};

export default Stock;