import React, { useState, useEffect } from "react";
import Sidebar from "../layout/Sidebar";
import AddItemsForm from "../modals/AddItemsForm";
import StockItemCard from "../cards/StockItemCard";
import ItemInformationPopup from "../modals/ItemInformationPopup";
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue } from "firebase/database";

const Stock = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (userInfo) {
      const itemsRef = ref(db, `users/${userInfo.uid}/items`);
      onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const itemsList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setItems(itemsList);
        } else {
          setItems([]);
        }
      });
    }
  }, [db, userInfo]);

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
          {items.map((item) => (
            <div key={item.id} onClick={() => handleOpenInfoModal(item)} className="cursor-pointer">
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
