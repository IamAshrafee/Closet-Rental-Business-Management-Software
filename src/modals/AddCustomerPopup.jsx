import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { getDatabase, ref, push, set } from 'firebase/database';
import { useSelector } from 'react-redux';

const AddCustomerPopup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    altPhone: '',
    nid: '',
    parentNidType: '',
    parentNid: '',
    husbandNid: '',
    fbId: '',
    address: ''
  });
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    setFormData(prev => ({ ...prev, parentNidType: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const customersRef = ref(db, `users/${userInfo.uid}/customers`);
      const newCustomerRef = push(customersRef);
      await set(newCustomerRef, formData);
      onClose();
    } catch (error) {
      console.error("Error adding customer to database:", error);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-50 p-4"
      onClick={onClose}
    >
      <form 
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-11/12 md:w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Customer</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close form"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Form Content (Scrollable) */}
        <div className="space-y-6 overflow-y-auto p-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Name */}
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input type="text" id="customerName" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" id="phoneNumber" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alternative Phone Number */}
            <div>
              <label htmlFor="altPhoneNumber" className="block text-sm font-medium text-gray-700">Alternative Phone Number <span className="text-gray-500">(Optional)</span></label>
              <input type="text" id="altPhoneNumber" name="altPhone" value={formData.altPhone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>

            {/* NID/Passport/Birth Certificate */}
            <div>
              <label htmlFor="nid" className="block text-sm font-medium text-gray-700">NID/Passport/Birth Certificate No.</label>
              <input type="text" id="nid" name="nid" value={formData.nid} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
          </div>

          {/* Parent's NID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Parent's NID Number <span className="text-gray-500">(Optional)</span></label>
            <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center">
                    <input type="radio" id="fatherNid" name="parentNidType" value="father" onChange={handleRadioChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <label htmlFor="fatherNid" className="ml-2 block text-sm font-medium text-gray-700">Father</label>
                </div>
                <div className="flex items-center">
                    <input type="radio" id="motherNid" name="parentNidType" value="mother" onChange={handleRadioChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <label htmlFor="motherNid" className="ml-2 block text-sm font-medium text-gray-700">Mother</label>
                </div>
            </div>
            <input type="text" id="parentNidInput" name="parentNid" value={formData.parentNid} onChange={handleChange} className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
          </div>

          {/* Husband's NID */}
          <div>
            <label htmlFor="husbandNid" className="block text-sm font-medium text-gray-700">Husband's NID <span className="text-gray-500">(Optional)</span></label>
            <input type="text" id="husbandNid" name="husbandNid" value={formData.husbandNid} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
          </div>

          {/* Facebook ID Link */}
          <div>
            <label htmlFor="fbId" className="block text-sm font-medium text-gray-700">Facebook ID Link <span className="text-gray-500">(Optional)</span></label>
            <input type="url" id="fbId" name="fbId" value={formData.fbId} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save</button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomerPopup;