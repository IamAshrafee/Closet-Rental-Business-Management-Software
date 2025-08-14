import React from 'react';
import { FiEdit, FiTrash2, FiPhone, FiMapPin } from 'react-icons/fi';

const CustomerCard = ({ customer }) => {
  if (!customer) {
    return null;
  }

  const {
    name,
    phone,
    address,
  } = customer;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1">
      <div className="p-5">
        <h3 className="text-xl font-bold font-poppins mb-3">{name}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <FiPhone className="mr-3" />
          <span>{phone}</span>
        </div>
        
        <div className="flex items-start text-gray-600 mb-4">
          <FiMapPin className="mr-3 mt-1" />
          <span className="flex-1">{address}</span>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
            <FiEdit className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
            <FiTrash2 className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;