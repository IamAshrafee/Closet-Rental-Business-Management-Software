import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiUser, FiPhone, FiLink, FiMapPin, FiEdit2 } from 'react-icons/fi';
import { getDatabase, ref, push, set, update } from 'firebase/database';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const AddCustomerPopup = ({ isOpen, onClose, customer, customers }) => {
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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (isOpen) {
      if (customer) {
        setFormData({
          name: customer.name || '',
          phone: customer.phone || '',
          altPhone: customer.altPhone || '',
          nid: customer.nid || '',
          parentNidType: customer.parentNidType || '',
          parentNid: customer.parentNid || '',
          husbandNid: customer.husbandNid || '',
          fbId: customer.fbId || '',
          address: customer.address || ''
        });
      } else {
        // Reset form when opening for new customer
        setFormData({
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
      }
      setErrors({});
      setSuggestions([]);
    }
  }, [customer, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.phone && !/^\d+$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (formData.altPhone && !/^\d+$/.test(formData.altPhone)) newErrors.altPhone = 'Invalid phone number';
    if (formData.parentNidType && !formData.parentNid) newErrors.parentNid = 'Parent NID is required when type is selected';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    // Check for duplicate phone number
    if (customers && customers.some(c => c.phone === formData.phone && c.id !== (customer && customer.id))) {
      newErrors.phone = 'A customer with this phone number already exists.';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'name' || name === 'phone') {
      if (value.trim() === '') {
        setSuggestions([]);
      } else {
        const filteredSuggestions = customers.filter(c => {
          const nameMatch = c.name && c.name.toLowerCase().includes(value.toLowerCase());
          const phoneMatch = c.phone && c.phone.includes(value);
          return nameMatch || phoneMatch;
        });
        setSuggestions(filteredSuggestions);
      }
    }


    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRadioChange = (e) => {
    setFormData(prev => ({ ...prev, parentNidType: e.target.value }));
    if (errors.parentNid) {
      setErrors(prev => ({ ...prev, parentNid: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const customerData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      if (customer) {
        // Update existing customer
        const customerRef = ref(db, `users/${userInfo.uid}/customers/${customer.id}`);
        await update(customerRef, customerData);
      } else {
        // Add new customer
        const customersRef = ref(db, `users/${userInfo.uid}/customers`);
        const newCustomerRef = push(customersRef);
        await set(newCustomerRef, {
          ...customerData,
          createdAt: new Date().toISOString(),
          totalSpent: 0,
          totalBookings: 0,
          activeBookings: 0,
          totalOutstanding: 0
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving customer:", error);
      setErrors({ submit: 'Failed to save customer. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-50 p-4"
        onClick={onClose}
      >
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${customer ? 'bg-yellow-100 text-yellow-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {customer ? <FiEdit2 size={24} /> : <FiUser size={24} />}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {customer ? 'Edit Customer' : 'Add New Customer'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors p-1"
              aria-label="Close form"
              disabled={isSubmitting}
            >
              <IoMdClose size={24} />
            </button>
          </div>

          {/* Form Content (Scrollable) */}
          <div className="overflow-y-auto p-6 flex-grow">
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {errors.submit}
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Name */}
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="customerName"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 pl-9`}
                      placeholder="John Doe"
                    />
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`block w-full border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 pl-9`}
                      placeholder="01XXXXXXXXX"
                    />
                    <FiPhone className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>
              {suggestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestions.map(c => (
                    <div key={c.id} className="bg-gray-100 p-4 rounded-lg">
                      <p className="font-bold">{c.name}</p>
                      <p>{c.phone}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Alternative Phone Number */}
                <div>
                  <label htmlFor="altPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Alternative Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="altPhoneNumber"
                      name="altPhone"
                      value={formData.altPhone}
                      onChange={handleChange}
                      className={`block w-full border ${errors.altPhone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 pl-9`}
                      placeholder="01XXXXXXXXX"
                    />
                    <FiPhone className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.altPhone && <p className="mt-1 text-sm text-red-600">{errors.altPhone}</p>}
                </div>

                {/* NID/Passport/Birth Certificate */}
                <div>
                  <label htmlFor="nid" className="block text-sm font-medium text-gray-700 mb-1">
                    NID/Passport/Birth Certificate No.
                  </label>
                  <input
                    type="text"
                    id="nid"
                    name="nid"
                    value={formData.nid}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    placeholder="Enter ID number"
                  />
                </div>
              </div>

              {/* Parent's NID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent's NID Number
                </label>
                <div className="mt-1 flex items-center gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="fatherNid"
                      name="parentNidType"
                      value="father"
                      checked={formData.parentNidType === 'father'}
                      onChange={handleRadioChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="fatherNid" className="ml-2 block text-sm text-gray-700">Father</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="motherNid"
                      name="parentNidType"
                      value="mother"
                      checked={formData.parentNidType === 'mother'}
                      onChange={handleRadioChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="motherNid" className="ml-2 block text-sm text-gray-700">Mother</label>
                  </div>
                </div>
                <input
                  type="text"
                  id="parentNidInput"
                  name="parentNid"
                  value={formData.parentNid}
                  onChange={handleChange}
                  className={`mt-2 block w-full border ${errors.parentNid ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2`}
                  placeholder="Enter parent's NID"
                  disabled={!formData.parentNidType}
                />
                {errors.parentNid && <p className="mt-1 text-sm text-red-600">{errors.parentNid}</p>}
              </div>

              {/* Husband's NID */}
              <div>
                <label htmlFor="husbandNid" className="block text-sm font-medium text-gray-700 mb-1">
                  Husband's NID
                </label>
                <input
                  type="text"
                  id="husbandNid"
                  name="husbandNid"
                  value={formData.husbandNid}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  placeholder="Enter husband's NID"
                />
              </div>

              {/* Facebook ID Link */}
              <div>
                <label htmlFor="fbId" className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook ID Link
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="fbId"
                    name="fbId"
                    value={formData.fbId}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 pl-9"
                    placeholder="https://facebook.com/username"
                  />
                  <FiLink className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className={`block w-full border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 pl-9`}
                    placeholder="Full address with area details"
                  />
                  <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                </div>
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {customer ? 'Updating...' : 'Adding...'}
                </span>
              ) : customer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddCustomerPopup;
