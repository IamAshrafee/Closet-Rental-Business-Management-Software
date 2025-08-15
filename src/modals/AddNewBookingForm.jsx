import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiPlus, FiTrash2, FiUser, FiBox, FiCalendar, FiDollarSign, FiFileText, FiChevronDown, FiCheck, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { getDatabase, ref, onValue, push, set, update } from 'firebase/database';
import { useSelector } from 'react-redux';

// Reusable UI Components
const FormSection = ({ title, icon, children, required = false }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
    <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-5">
      {icon}
      <span className="ml-3">{title}</span>
      {required && <span className="ml-2 text-red-500 text-sm">*</span>}
    </h3>
    <div className="space-y-5">{children}</div>
  </div>
);

const InputField = ({ label, error, required, icon, ...props }) => (
  <div>
    {label && (
      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      {...props}
      className={`w-full bg-transparent border-b py-2 px-1 focus:outline-none focus:border-b-2 transition-colors ${
        error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const SelectField = ({ label, error, required, icon, children, ...props }) => (
  <div>
    {label && (
      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <div className="relative">
      <select
        {...props}
        className={`w-full appearance-none bg-transparent border-b py-2 px-1 focus:outline-none focus:border-b-2 transition-colors ${
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
        }`}
      >
        {children}
      </select>
      <FiChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const TextareaField = ({ label, error, required, icon, ...props }) => (
  <div>
    {label && (
      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      {...props}
      className={`w-full bg-transparent border-b py-2 px-1 focus:outline-none focus:border-b-2 transition-colors ${
        error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'
      }`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const Alert = ({ type, message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg flex items-center ${
      type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}
  >
    {type === 'success' ? <FiCheck className="mr-2" /> : <FiInfo className="mr-2" />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
      <IoMdClose />
    </button>
  </motion.div>
);

const AddNewBookingForm = ({ onClose, booking }) => {
  const [bookingDetails, setBookingDetails] = useState({
    customerId: '',
    items: [],
    deliveryType: 'CustomerPickup',
    deliveryDate: '',
    returnDate: '',
    startDate: '',
    endDate: '',
    address: '',
    deliveryCharge: '',
    otherCharges: '',
    advances: [{ amount: '', date: new Date().toISOString().split('T')[0] }],
    notes: '',
  });
  
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (booking) {
      setBookingDetails(booking);
    }
  }, [booking]);

  useEffect(() => {
    if (userInfo) {
      const customersRef = ref(db, `users/${userInfo.uid}/customers`);
      onValue(customersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const customersList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setCustomers(customersList);
        } else {
          setCustomers([]);
        }
      });

      const itemsRef = ref(db, `users/${userInfo.uid}/items`);
      onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const itemsList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setStockItems(itemsList);
        } else {
          setStockItems([]);
        }
      });
    }
  }, [db, userInfo]);

  // Calculate price based on price type and dates
  const calculateItemPrice = useCallback((item) => {
    if (!bookingDetails.startDate || !bookingDetails.endDate || !item.price) return 0;
    
    const start = new Date(bookingDetails.startDate);
    const end = new Date(bookingDetails.endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
    
    return item.priceType === 'Per Day' ? days * Number(item.price) : Number(item.price);
  }, [bookingDetails.startDate, bookingDetails.endDate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Add new item
  const handleAddItem = () => {
    setBookingDetails(prev => ({
      ...prev,
      items: [...prev.items, { 
        itemId: '', 
        priceType: 'Fixed', 
        price: '',
        calculatedPrice: 0
      }]
    }));
  };

  // Handle item changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...bookingDetails.items];
    newItems[index] = { ...newItems[index], [name]: value };
    
    // Recalculate price when relevant fields change
    if (['price', 'priceType'].includes(name)) {
      newItems[index].calculatedPrice = calculateItemPrice(newItems[index]);
    }
    
    setBookingDetails(prev => ({ ...prev, items: newItems }));
    
    // Clear error
    if (errors[`items.${index}.${name}`]) {
      setErrors(prev => ({ ...prev, [`items.${index}.${name}`]: null }));
    }
  };

  // Remove item
  const handleRemoveItem = (index) => {
    const newItems = bookingDetails.items.filter((_, i) => i !== index);
    setBookingDetails(prev => ({ ...prev, items: newItems }));
  };

  // Add advance payment
  const handleAddAdvance = () => {
    setBookingDetails(prev => ({
      ...prev,
      advances: [...prev.advances, { amount: '', date: new Date().toISOString().split('T')[0] }]
    }));
  };

  // Handle advance changes
  const handleAdvanceChange = (index, e) => {
    const { name, value } = e.target;
    const newAdvances = [...bookingDetails.advances];
    newAdvances[index][name] = value;
    setBookingDetails(prev => ({ ...prev, advances: newAdvances }));
    
    // Clear error
    if (errors[`advances.${index}.${name}`]) {
      setErrors(prev => ({ ...prev, [`advances.${index}.${name}`]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Customer validation
    if (!bookingDetails.customerId) {
      newErrors.customerId = 'Please select a customer';
    }

    if (!bookingDetails.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    }

    if (!bookingDetails.returnDate) {
      newErrors.returnDate = 'Return date is required';
    }

    if (!bookingDetails.startDate) {
      newErrors.startDate = 'Rent Start date is required';
    }

    if (!bookingDetails.endDate) {
      newErrors.endDate = 'Rent End date is required';
    }

    if (bookingDetails.startDate && bookingDetails.endDate && new Date(bookingDetails.startDate) > new Date(bookingDetails.endDate)) {
      newErrors.endDate = 'Rent End date must be after Rent Start date';
    }

    if (bookingDetails.deliveryDate && bookingDetails.returnDate && new Date(bookingDetails.deliveryDate) > new Date(bookingDetails.returnDate)) {
      newErrors.returnDate = 'Return date must be after Delivery date';
    }
    
    // Items validation
    if (bookingDetails.items.length === 0) {
      newErrors.items = 'At least one item is required';
    } else {
      bookingDetails.items.forEach((item, index) => {
        if (!item.itemId) {
          newErrors[`items.${index}.itemId`] = 'Please select an item';
        }
        if (!item.price) {
          newErrors[`items.${index}.price`] = 'Price is required';
        }
      });
    }
    
    // Delivery validation
    if (bookingDetails.deliveryType === 'HomeDelivery' && !bookingDetails.address.trim()) {
      newErrors.address = 'Address is required for home delivery';
    }
    
    // Advance validation
    bookingDetails.advances.forEach((advance, index) => {
      if (advance.amount && isNaN(Number(advance.amount))) {
        newErrors[`advances.${index}.amount`] = 'Please enter a valid amount';
      }
    });
    
    // Numeric validation
    if (bookingDetails.deliveryCharge && isNaN(Number(bookingDetails.deliveryCharge))) {
      newErrors.deliveryCharge = 'Please enter a valid amount';
    }
    if (bookingDetails.otherCharges && isNaN(Number(bookingDetails.otherCharges))) {
      newErrors.otherCharges = 'Please enter a valid amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setAlert({ show: true, type: 'error', message: 'Please fix the errors in the form' });
      return;
    }
    
    setSubmitting(true);

    const totalRent = bookingDetails.items.reduce((total, item) => total + item.calculatedPrice, 0);
    const totalCharges = Number(bookingDetails.deliveryCharge || 0) + Number(bookingDetails.otherCharges || 0);
    const totalAmount = totalRent + totalCharges;
    const totalAdvance = bookingDetails.advances.reduce((total, advance) => total + Number(advance.amount || 0), 0);
    const dueAmount = totalAmount - totalAdvance;

    const dataToSave = {
      ...bookingDetails,
      totalRent,
      totalCharges,
      totalAmount,
      totalAdvance,
      dueAmount,
      status: booking ? booking.status : 'Waiting for Delivery' // Initial status
    };
    
    try {
      if (booking) {
        const bookingRef = ref(db, `users/${userInfo.uid}/bookings/${booking.id}`);
        await update(bookingRef, dataToSave);
        setAlert({ show: true, type: 'success', message: 'Booking updated successfully!' });
      } else {
        const bookingsRef = ref(db, `users/${userInfo.uid}/bookings`);
        const newBookingRef = push(bookingsRef);
        await set(newBookingRef, dataToSave);
        setAlert({ show: true, type: 'success', message: 'Booking updated successfully!' });
      }
      
      // Close form after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setAlert({ show: true, type: 'error', message: 'Failed to save booking. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setBookingDetails({
      customerId: '',
      items: [],
      deliveryType: 'CustomerPickup',
      deliveryDate: '',
      returnDate: '',
      startDate: '',
      endDate: '',
      address: '',
      deliveryCharge: '',
      otherCharges: '',
      advances: [{ amount: '', date: new Date().toISOString().split('T')[0] }],
      notes: '',
    });
    setErrors({});
  };

  // Calculate totals
  const totalRent = useMemo(() => 
    bookingDetails.items.reduce((total, item) => total + calculateItemPrice(item), 0), 
    [bookingDetails.items, calculateItemPrice]
  );
  
  const totalAdvance = useMemo(() => 
    bookingDetails.advances.reduce((total, advance) => total + Number(advance.amount || 0), 0), 
    [bookingDetails.advances]
  );
  
  const totalCharges = useMemo(() => 
    Number(bookingDetails.deliveryCharge || 0) + Number(bookingDetails.otherCharges || 0), 
    [bookingDetails.deliveryCharge, bookingDetails.otherCharges]
  );
  
  const dueAmount = useMemo(() => (totalRent + totalCharges) - totalAdvance, [totalRent, totalCharges, totalAdvance]);

  // Get selected customer
  const selectedCustomer = useMemo(() => 
    customers.find(c => c.id === bookingDetails.customerId), 
    [bookingDetails.customerId, customers]
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center backdrop-blur-sm z-50 p-4" onClick={onClose}>
      <AnimatePresence>
        {alert.show && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlert({ show: false, type: '', message: '' })} 
          />
        )}
      </AnimatePresence>
      
      <form 
        className="bg-gray-100 rounded-xl shadow-2xl w-11/12 max-w-5xl max-h-[90vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex justify-between items-center p-6 border-b bg-white rounded-t-xl sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800">{booking ? 'Edit Booking' : 'Create New Booking'}</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <IoMdClose size={24} />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <FormSection title="Customer Details" icon={<FiUser className="text-indigo-600" />} required>
              <SelectField 
                id="customer" 
                name="customerId" 
                value={bookingDetails.customerId} 
                onChange={handleInputChange}
                error={errors.customerId}
                required
              >
                <option value="">Select a customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
              </SelectField>
              
              {selectedCustomer && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                  <p className="text-sm text-blue-800"><span className="font-medium">Selected:</span> {selectedCustomer.name}</p>
                  <p className="text-sm text-blue-800"><span className="font-medium">Phone:</span> {selectedCustomer.phone}</p>
                </div>
              )}
            </FormSection>

            <FormSection title="Delivery & Dates" icon={<FiCalendar className="text-indigo-600" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                  name="deliveryType" 
                  value={bookingDetails.deliveryType} 
                  onChange={handleInputChange}
                  label="Delivery Type"
                >
                  <option value="CustomerPickup">Customer Pickup</option>
                  <option value="HomeDelivery">Home Delivery</option>
                </SelectField>
                
                <div />

                <InputField 
                  type="date" 
                  name="deliveryDate" 
                  value={bookingDetails.deliveryDate} 
                  onChange={handleInputChange} 
                  label="Delivery Date"
                  error={errors.deliveryDate}
                  required
                />
                
                <InputField 
                  type="date" 
                  name="returnDate" 
                  value={bookingDetails.returnDate} 
                  onChange={handleInputChange} 
                  label="Return Date"
                  error={errors.returnDate}
                  required
                />

                <InputField 
                  type="date" 
                  name="startDate" 
                  value={bookingDetails.startDate} 
                  onChange={handleInputChange} 
                  label="Rent Start Date"
                  error={errors.startDate}
                  required
                />
                
                <InputField 
                  type="date" 
                  name="endDate" 
                  value={bookingDetails.endDate} 
                  onChange={handleInputChange} 
                  label="Rent End Date"
                  error={errors.endDate}
                  required
                />

                <div className="md:col-span-2">
                  <TextareaField 
                    name="address" 
                    value={bookingDetails.address} 
                    onChange={handleInputChange} 
                    rows="2" 
                    label="Address"
                    error={errors.address}
                    required={bookingDetails.deliveryType === 'HomeDelivery'}
                  />
                </div>
              </div>
            </FormSection>
            
            <FormSection title="Rented Items" icon={<FiBox className="text-indigo-600" />} required>
              {errors.items && <p className="text-red-500 text-sm">{errors.items}</p>}
              
              <div className="space-y-4">
                {bookingDetails.items.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gray-50 p-4 rounded-lg border-2 border-dashed space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-600">Item #{index + 1}</h4>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveItem(index)} 
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    
                    <SelectField 
                      name="itemId" 
                      value={item.itemId} 
                      onChange={(e) => handleItemChange(index, e)}
                      error={errors[`items.${index}.itemId`]}
                      required
                    >
                      <option value="">Select an item</option>
                      {stockItems.map(i => <option key={i.id} value={i.id}>{i.name} - {i.category}</option>)}
                    </SelectField>
                                        
                    <div className="flex items-center gap-4">
                      <SelectField 
                        name="priceType" 
                        value={item.priceType} 
                        onChange={(e) => handleItemChange(index, e)}
                        label="Price Type"
                      >
                        <option>Fixed</option>
                        <option>Per Day</option>
                      </SelectField>
                      <InputField 
                        type="number" 
                        name="price" 
                        value={item.price} 
                        onChange={(e) => handleItemChange(index, e)} 
                        placeholder="Price (₹)"
                        label="Price"
                        error={errors[`items.${index}.price`]}
                        required
                      />
                    </div>
                    
                    {item.calculatedPrice > 0 && (
                      <div className="text-right text-sm font-medium text-green-700">
                        Calculated Price: ₹{item.calculatedPrice.toFixed(2)}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <button 
                type="button" 
                onClick={handleAddItem} 
                className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold text-sm py-3 px-4 rounded-md transition-colors"
              >
                <FiPlus /> Add Another Item
              </button>
            </FormSection>
            
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            <FormSection title="Financials" icon={<FiDollarSign className="text-indigo-600" />}>
              <InputField 
                type="number" 
                name="deliveryCharge" 
                value={bookingDetails.deliveryCharge} 
                onChange={handleInputChange} 
                placeholder="e.g., 50"
                label="Delivery Charge (₹)"
                error={errors.deliveryCharge}
              />
              
              <InputField 
                type="number" 
                name="otherCharges" 
                value={bookingDetails.otherCharges} 
                onChange={handleInputChange} 
                placeholder="e.g., 20"
                label="Other Charges (₹)"
                error={errors.otherCharges}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Advance Payments</label>
                
                {bookingDetails.advances.map((adv, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <InputField 
                      type="number" 
                      name="amount" 
                      value={adv.amount} 
                      onChange={(e) => handleAdvanceChange(index, e)} 
                      placeholder="Amount (₹)"
                      error={errors[`advances.${index}.amount`]}
                    />
                    <InputField 
                      type="date" 
                      name="date" 
                      value={adv.date} 
                      onChange={(e) => handleAdvanceChange(index, e)} 
                    />
                  </div>
                ))}
                
                <button 
                  type="button" 
                  onClick={handleAddAdvance} 
                  className="mt-1 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors"
                >
                  <FiPlus /> Add Advance
                </button>
              </div>
            </FormSection>
            
            <FormSection title="Notes" icon={<FiFileText className="text-indigo-600" />}>
              <TextareaField 
                name="notes" 
                value={bookingDetails.notes} 
                onChange={handleInputChange} 
                rows="3" 
                placeholder="Add any special instructions..."
              />
            </FormSection>
            
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-lg sticky top-0">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <FiDollarSign className="mr-2" /> Booking Summary
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between opacity-80">
                  <p>Total Rent:</p>
                  <p>₹{totalRent.toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between opacity-80">
                  <p>Total Charges:</p>
                  <p>₹{totalCharges.toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between opacity-80 border-b border-indigo-400 pb-2 mb-2">
                  <p>Subtotal:</p>
                  <p>₹{(totalRent + totalCharges).toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between text-green-300 font-medium">
                  <p>Total Advance:</p>
                  <p>- ₹{totalAdvance.toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between font-bold text-xl mt-3 pt-3 border-t border-indigo-400">
                  <p>Due Amount:</p>
                  <p>₹{dueAmount.toFixed(2)}</p>
                </div>
              </div>
              
              {dueAmount > 0 && (
                <div className="mt-4 text-xs bg-indigo-700 bg-opacity-50 p-2 rounded">
                  <p>Payment due on or before return date</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 p-6 border-t bg-white rounded-b-xl sticky bottom-0 z-10">
          <button 
            type="button" 
            onClick={handleReset} 
            className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-md hover:bg-gray-300 font-semibold transition-colors"
          >
            Reset
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-md hover:bg-gray-300 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-md hover:bg-indigo-700 font-semibold transition-colors flex items-center disabled:opacity-70"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : booking ? 'Save Changes' : 'Save Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewBookingForm;