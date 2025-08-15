import React from 'react';
import { FiEdit, FiTrash2, FiPhone, FiMapPin, FiUser, FiLink, FiCreditCard } from 'react-icons/fi';

const CustomerCard = ({ customer, onEdit, onDelete }) => {
  if (!customer) {
    return null;
  }

  const {
    name,
    phone,
    altPhone,
    nid,
    parentNidType,
    parentNid,
    husbandNid,
    fbId,
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

        {altPhone && (
          <div className="flex items-center text-gray-600 mb-2">
            <FiPhone className="mr-3" />
            <span>{altPhone} (Alt)</span>
          </div>
        )}
        
        <div className="flex items-start text-gray-600 mb-4">
          <FiMapPin className="mr-3 mt-1" />
          <span className="flex-1">{address}</span>
        </div>

        {nid && (
          <div className="flex items-center text-gray-600 mb-2">
            <FiCreditCard className="mr-3" />
            <span>NID: {nid}</span>
          </div>
        )}

        {parentNid && (
          <div className="flex items-center text-gray-600 mb-2">
            <FiUser className="mr-3" />
            <span>{parentNidType === 'father' ? "Father's NID:" : "Mother's NID:"} {parentNid}</span>
          </div>
        )}

        {husbandNid && (
          <div className="flex items-center text-gray-600 mb-2">
            <FiUser className="mr-3" />
            <span>Husband's NID: {husbandNid}</span>
          </div>
        )}

        {fbId && (
          <div className="flex items-center text-gray-600 mb-2">
            <FiLink className="mr-3" />
            <a href={fbId} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Facebook Profile</a>
          </div>
        )}

        <div className="mt-4 flex justify-end space-x-3">
          <button onClick={onEdit} className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
            <FiEdit className="text-gray-600" />
          </button>
          <button onClick={onDelete} className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
            <FiTrash2 className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
