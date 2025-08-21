import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../layout/Sidebar";
import AddPartnerPopup from "../modals/AddPartnerPopup";
import PartnerCard from "../cards/PartnerCard";
import { useSelector } from "react-redux";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { FiPlus, FiSearch } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import EmptyState from "../components/EmptyState";

const Partners = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [partners, setPartners] = useState([]);
  const [editingPartner, setEditingPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (userInfo) {
      setIsLoading(true);
      const partnersRef = ref(db, `users/${userInfo.uid}/partners`);
      const unsubscribePartners = onValue(partnersRef, (snapshot) => {
        const data = snapshot.val();
        setPartners(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
        setIsLoading(false);
      });

      return () => {
        unsubscribePartners();
      };
    }
  }, [db, userInfo]);

  const filteredPartners = useMemo(() => {
    if (!searchQuery) return partners;
    const query = searchQuery.toLowerCase();
    return partners.filter((partner) => {
        return (
            partner.name?.toLowerCase().includes(query) ||
            partner.phone?.includes(query) ||
            partner.email?.toLowerCase().includes(query)
        );
    });
  }, [partners, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingPartner(null);
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => setAddModalOpen(false);

  const handleEditPartner = (partner) => {
    setEditingPartner(partner);
    setAddModalOpen(true);
  };

  const handleDeletePartner = async (partner) => {
    // TODO: Add check to prevent deleting a partner with active items.
    if (window.confirm(`Are you sure you want to delete ${partner.name}?`)) {
      try {
        const partnerRef = ref(db, `users/${userInfo.uid}/partners/${partner.id}`);
        await remove(partnerRef);
      } catch (error) {
        console.error("Error deleting partner:", error);
      }
    }
  };

  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 px-4 md:px-0">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Partners</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              {filteredPartners.length} {filteredPartners.length === 1 ? 'partner' : 'partners'} registered
            </p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <label htmlFor="searchQuery" className="sr-only">Search partners</label>
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="searchQuery"
                placeholder="Search by name, phone, or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium whitespace-nowrap"
            >
              <FiPlus className="mr-2" size={18} />
              <span>Add Partner</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-0 pb-6">
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} height={200} className="rounded-xl" />
            ))}
          </div>
        ) : filteredPartners.length === 0 ? (
          <EmptyState 
            title={searchQuery ? "No matching partners found" : "You haven't added any partners yet"}
            description={searchQuery ? "Try a different search term" : "Add your first partner to get started"}
            buttonText="Add Partner"
            onButtonClick={handleOpenAddModal}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-0 pb-6">
            {filteredPartners.map((partner) => (
              <div 
                key={partner.id} 
                onClick={() => handleEditPartner(partner)} 
                className="cursor-pointer"
                role="button"
                tabIndex="0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleEditPartner(partner);
                  }
                }}
              >
                <PartnerCard 
                  partner={partner} 
                  onEdit={(e) => { e.stopPropagation(); handleEditPartner(partner); }}
                  onDelete={(e) => { e.stopPropagation(); handleDeletePartner(partner); }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <AddPartnerPopup 
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal} 
        partner={editingPartner} 
      />
      
    </Sidebar>
  );
};

export default Partners;