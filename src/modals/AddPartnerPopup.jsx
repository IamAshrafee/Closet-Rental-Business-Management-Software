import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiUser, FiPhone, FiMail, FiMapPin, FiEdit2 } from 'react-icons/fi';
import { getDatabase, ref, push, set, update } from 'firebase/database';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const AddPartnerPopup = ({ isOpen, onClose, partner }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (isOpen) {
      if (partner) {
        setFormData({
          name: partner.name || '',
          phone: partner.phone || '',
          email: partner.email || '',
          address: partner.address || ''
        });
      } else {
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: ''
        });
      }
      setErrors({});
    }
  }, [partner, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (formData.email && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const partnerData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      if (partner) {
        const partnerRef = ref(db, `users/${userInfo.uid}/partners/${partner.id}`);
        await update(partnerRef, partnerData);
      } else {
        const partnersRef = ref(db, `users/${userInfo.uid}/partners`);
        const newPartnerRef = push(partnersRef);
        await set(newPartnerRef, {
          ...partnerData,
          createdAt: new Date().toISOString(),
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving partner:", error);
      setErrors({ submit: 'Failed to save partner. Please try again.' });
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
        className="fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-50 p-4"
        onClick={onClose}
      >
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${partner ? 'bg-yellow-100 text-yellow-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {partner ? <FiEdit2 size={24} /> : <FiUser size={24} />}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {partner ? 'Edit Partner' : 'Add New Partner'}
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

          <div className="overflow-y-auto p-6 flex-grow">
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {errors.submit}
              </div>
            )}

            <div className="space-y-6">
                <div>
                  <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Partner Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="partnerName"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm p-2 pl-9`}
                      placeholder="John Doe"
                    />
                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

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
                      className={`block w-full border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm p-2 pl-9`}
                      placeholder="01XXXXXXXXX"
                    />
                    <FiPhone className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm p-2 pl-9`}
                      placeholder="partner@example.com"
                    />
                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className={`block w-full border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm p-2 pl-9`}
                      placeholder="Full address"
                    />
                    <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : partner ? 'Update Partner' : 'Add Partner'}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddPartnerPopup;
