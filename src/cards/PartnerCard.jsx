import React from 'react';
import { FiEdit, FiTrash2, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const PartnerCard = ({ partner, onEdit, onDelete }) => {
  if (!partner) return null;

  const { name, phone, email, address } = partner;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden border border-gray-100 hover:border-gray-200 flex flex-col h-full">
      <div className="p-5 pb-3 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 font-poppins">{name}</h3>
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={onEdit} 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-indigo-600"
              aria-label="Edit partner"
            >
              <FiEdit size={18} />
            </button>
            <button 
              onClick={onDelete} 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-red-600"
              aria-label="Delete partner"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="space-y-3 pl-2">
          <div className="flex items-center text-gray-600">
            <FiPhone className="mr-3 text-gray-500" size={16} />
            <a href={`tel:${phone}`} className="hover:text-indigo-600 transition-colors">
              {phone}
            </a>
          </div>
          {email && (
            <div className="flex items-center text-gray-600">
              <FiMail className="mr-3 text-gray-500" size={16} />
              <a href={`mailto:${email}`} className="hover:text-indigo-600 transition-colors">
                {email}
              </a>
            </div>
          )}
          <div className="flex items-start text-gray-600">
            <FiMapPin className="mr-3 mt-0.5 text-gray-500" size={16} />
            <span className="flex-1 text-sm">{address || 'No address provided'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerCard;
