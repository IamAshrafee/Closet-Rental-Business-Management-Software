import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import AddItemsForm from "../modals/AddItemsForm";
import StockItemCard from "../cards/StockItemCard";
import ItemInformationPopup from "../modals/ItemInformationPopup";

const Stock = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenAddModal = () => setAddModalOpen(true);
  const handleCloseAddModal = () => setAddModalOpen(false);

  const handleOpenInfoModal = (item) => {
    setSelectedItem(item);
    setInfoModalOpen(true);
  };
  const handleCloseInfoModal = () => {
    setSelectedItem(null);
    setInfoModalOpen(false);
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
      category: "Evening Wear",
      purchaseDate: "2023-01-15",
      purchaseFrom: "Designer Boutique",
      itemCountry: "France",
      purchasePrice: "₹10000",
      itemCondition: "Fresh",
      rentPrice: "₹500/day",
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
      category: "Jackets",
      purchaseDate: "2022-11-20",
      purchaseFrom: "Levi's Store",
      itemCountry: "USA",
      purchasePrice: "₹4000",
      itemCondition: "Used 3 times",
      rentPrice: "₹250/day",
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
        category: "Dresses",
        purchaseDate: "2023-05-10",
        purchaseFrom: "Zara",
        itemCountry: "Spain",
        purchasePrice: "₹3500",
        itemCondition: "Completely new",
        rentPrice: "₹400/day",
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
            onClick={handleOpenAddModal}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-semibold"
          >
            Add Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleItems.map((item, index) => (
            <div key={index} onClick={() => handleOpenInfoModal(item)} className="cursor-pointer">
                <StockItemCard item={item} />
            </div>
          ))}
        </div>
      </div>
      {isAddModalOpen && <AddItemsForm onClose={handleCloseAddModal} />}
      {isInfoModalOpen && <ItemInformationPopup item={selectedItem} onClose={handleCloseInfoModal} />}
    </Sidebar>
  );
};

export default Stock;