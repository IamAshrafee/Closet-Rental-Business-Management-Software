import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const AddItemsForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sizeOption: 'fixed',
    sizeValue: '',
    sizeFrom: '',
    sizeTo: '',
    long: '',
    colors: '',
    purchaseDate: '',
    purchaseFrom: '',
    itemCountry: '',
    purchasePrice: '',
    availability: 'available',
    availableFrom: '',
    condition: 'Completely new',
    rentOption: 'fixed',
    rentValue: '',
    rentPerDay: '',
    rentFrom: '',
    rentTo: '',
    target: '',
    description: '',
    photo: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleRadioChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'File size must be less than 10MB' }));
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setErrors(prev => ({ ...prev, photo: 'Only JPG, PNG, and GIF files are allowed' }));
        return;
      }
      setFormData(prev => ({ ...prev, photo: file }));
      setErrors(prev => ({ ...prev, photo: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.purchasePrice) newErrors.purchasePrice = 'Purchase price is required';
    if (!formData.target) newErrors.target = 'Target is required';
    if (formData.sizeOption === 'fixed' && !formData.sizeValue.trim()) {
      newErrors.sizeValue = 'Size value is required';
    }
    if (formData.sizeOption === 'range') {
      if (!formData.sizeFrom.trim()) newErrors.sizeFrom = 'From value is required';
      if (!formData.sizeTo.trim()) newErrors.sizeTo = 'To value is required';
    }
    if (formData.rentOption === 'fixed' && !formData.rentValue) {
      newErrors.rentValue = 'Rent price is required';
    }
    if (formData.rentOption === 'per-day' && !formData.rentPerDay) {
      newErrors.rentPerDay = 'Price per day is required';
    }
    if (formData.rentOption === 'range') {
      if (!formData.rentFrom) newErrors.rentFrom = 'From value is required';
      if (!formData.rentTo) newErrors.rentTo = 'To value is required';
    }
    if (formData.availability === 'not-available' && !formData.availableFrom) {
      newErrors.availableFrom = 'Available date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (onSubmit) onSubmit(formData);
      onClose();
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
        className="bg-white rounded-xl shadow-2xl w-11/12 md:w-full max-w-3xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Item</h2>
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
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="category" 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
          </div>
          
          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="fixed-size" 
                  name="sizeOption"
                  checked={formData.sizeOption === 'fixed'} 
                  onChange={() => handleRadioChange('sizeOption', 'fixed')} 
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="fixed-size" className="ml-3 block text-sm font-medium text-gray-700">Fixed size</label>
              </div>
              
              {formData.sizeOption === 'fixed' && (
                <div className="ml-7">
                  <input 
                    type="text" 
                    name="sizeValue"
                    value={formData.sizeValue}
                    onChange={handleChange}
                    placeholder="Enter size" 
                    className={`mt-1 block w-full border rounded-md shadow-sm sm:text-sm p-2 ${errors.sizeValue ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.sizeValue && <p className="mt-1 text-sm text-red-600">{errors.sizeValue}</p>}
                </div>
              )}
              
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="size-range" 
                  name="sizeOption"
                  checked={formData.sizeOption === 'range'} 
                  onChange={() => handleRadioChange('sizeOption', 'range')} 
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="size-range" className="ml-3 block text-sm font-medium text-gray-700">Size range</label>
              </div>
              
              {formData.sizeOption === 'range' && (
                <div className="ml-7 mt-1">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        name="sizeFrom"
                        value={formData.sizeFrom}
                        onChange={handleChange}
                        placeholder="From" 
                        className={`block w-full border rounded-md shadow-sm sm:text-sm p-2 ${errors.sizeFrom ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.sizeFrom && <p className="mt-1 text-sm text-red-600">{errors.sizeFrom}</p>}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="text" 
                        name="sizeTo"
                        value={formData.sizeTo}
                        onChange={handleChange}
                        placeholder="To" 
                        className={`block w-full border rounded-md shadow-sm sm:text-sm p-2 ${errors.sizeTo ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.sizeTo && <p className="mt-1 text-sm text-red-600">{errors.sizeTo}</p>}
                    </div>
                  </div>
                  {errors.sizeRange && <p className="mt-1 text-sm text-red-600">{errors.sizeRange}</p>}
                </div>
              )}
              
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="free-size" 
                  name="sizeOption"
                  checked={formData.sizeOption === 'free'} 
                  onChange={() => handleRadioChange('sizeOption', 'free')} 
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="free-size" className="ml-3 block text-sm font-medium text-gray-700">Free size</label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Long (optional) */}
            <div>
              <label htmlFor="long" className="block text-sm font-medium text-gray-700 mb-1">
                Long (optional)
              </label>
              <input 
                type="text" 
                id="long" 
                name="long"
                value={formData.long}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            
            {/* Colors */}
            <div>
              <label htmlFor="colors" className="block text-sm font-medium text-gray-700 mb-1">
                Colors
              </label>
              <input 
                type="text" 
                id="colors" 
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Purchase Date (optional) */}
            <div>
              <label htmlFor="purchase-date" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase date (optional)
              </label>
              <input 
                type="date" 
                id="purchase-date" 
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            
            {/* Purchase From (optional) */}
            <div>
              <label htmlFor="purchase-from" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase from (optional)
              </label>
              <input 
                type="text" 
                id="purchase-from" 
                name="purchaseFrom"
                value={formData.purchaseFrom}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item's Country (optional) */}
            <div>
              <label htmlFor="item-country" className="block text-sm font-medium text-gray-700 mb-1">
                Item's country (optional)
              </label>
              <input 
                type="text" 
                id="item-country" 
                name="itemCountry"
                value={formData.itemCountry}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            
            {/* Purchase Price */}
            <div>
              <label htmlFor="purchase-price" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase price <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                id="purchase-price" 
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.purchasePrice ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.purchasePrice && <p className="mt-1 text-sm text-red-600">{errors.purchasePrice}</p>}
            </div>
          </div>
          
          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="available" 
                  name="availability"
                  checked={formData.availability === 'available'} 
                  onChange={() => handleRadioChange('availability', 'available')} 
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="available" className="ml-3 block text-sm font-medium text-gray-700">Available</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="not-available" 
                  name="availability"
                  checked={formData.availability === 'not-available'} 
                  onChange={() => handleRadioChange('availability', 'not-available')} 
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="not-available" className="ml-3 block text-sm font-medium text-gray-700">Not available</label>
              </div>
              
              {formData.availability === 'not-available' && (
                <div className="ml-7">
                  <input 
                    type="date" 
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleChange}
                    placeholder="Available from" 
                    className={`mt-1 block w-full border rounded-md shadow-sm sm:text-sm p-2 ${errors.availableFrom ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.availableFrom && <p className="mt-1 text-sm text-red-600">{errors.availableFrom}</p>}
                </div>
              )}
            </div>
          </div>
          
          {/* Item's Condition */}
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
              Item's condition
            </label>
            <select 
              id="condition" 
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            >
              <option>Completely new</option>
              <option>Fresh</option>
              <option>Used 1 time</option>
              <option>Used 2 times</option>
              <option>Used 3 times</option>
              <option>Used too much</option>
              <option>Old</option>
              <option>Bad</option>
            </select>
          </div>
          
          {/* Rent Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rent price</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="fixed-price" 
                  name="rentOption"
                  checked={formData.rentOption === 'fixed'} 
                  onChange={() => handleRadioChange('rentOption', 'fixed')} 
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="fixed-price" className="ml-3 block text-sm font-medium text-gray-700">Fixed price</label>
              </div>
              
              {formData.rentOption === 'fixed' && (
                <div className="ml-7">
                  <input 
                    type="number" 
                    name="rentValue"
                    value={formData.rentValue}
                    onChange={handleChange}
                    placeholder="Enter price" 
                    min="0"
                    step="0.01"
                    className={`mt-1 block w-full border rounded-md shadow-sm sm:text-sm p-2 ${errors.rentValue ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.rentValue && <p className="mt-1 text-sm text-red-600">{errors.rentValue}</p>}
                </div>
              )}
              
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="per-day-price" 
                  name="rentOption"
                  checked={formData.rentOption === 'per-day'} 
                  onChange={() => handleRadioChange('rentOption', 'per-day')} 
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="per-day-price" className="ml-3 block text-sm font-medium text-gray-700">Price per day</label>
              </div>
              
              {formData.rentOption === 'per-day' && (
                <div className="ml-7">
                  <input 
                    type="number" 
                    name="rentPerDay"
                    value={formData.rentPerDay}
                    onChange={handleChange}
                    placeholder="Enter price per day" 
                    min="0"
                    step="0.01"
                    className={`mt-1 block w-full border rounded-md shadow-sm sm:text-sm p-2 ${errors.rentPerDay ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.rentPerDay && <p className="mt-1 text-sm text-red-600">{errors.rentPerDay}</p>}
                </div>
              )}
              
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="price-range" 
                  name="rentOption"
                  checked={formData.rentOption === 'range'} 
                  onChange={() => handleRadioChange('rentOption', 'range')} 
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor="price-range" className="ml-3 block text-sm font-medium text-gray-700">Price range</label>
              </div>
              
              {formData.rentOption === 'range' && (
                <div className="ml-7 mt-1">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input 
                        type="number" 
                        name="rentFrom"
                        value={formData.rentFrom}
                        onChange={handleChange}
                        placeholder="From" 
                        min="0"
                        step="0.01"
                        className={`block w-full border rounded-md shadow-sm sm:text-sm p-2 ${errors.rentFrom ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.rentFrom && <p className="mt-1 text-sm text-red-600">{errors.rentFrom}</p>}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="number" 
                        name="rentTo"
                        value={formData.rentTo}
                        onChange={handleChange}
                        placeholder="To" 
                        min="0"
                        step="0.01"
                        className={`block w-full border rounded-md shadow-sm sm:text-sm p-2 ${errors.rentTo ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.rentTo && <p className="mt-1 text-sm text-red-600">{errors.rentTo}</p>}
                    </div>
                  </div>
                  {errors.rentRange && <p className="mt-1 text-sm text-red-600">{errors.rentRange}</p>}
                </div>
              )}
            </div>
          </div>
          
          {/* Target */}
          <div>
            <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
              Target <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-1">How many times the item must be rented to get back the original purchase price.</p>
            <input 
              type="number" 
              id="target" 
              name="target"
              value={formData.target}
              onChange={handleChange}
              min="1"
              step="1"
              className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.target ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.target && <p className="mt-1 text-sm text-red-600">{errors.target}</p>}
          </div>
          
          {/* Item Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item photo</label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${errors.photo ? 'border-red-500' : 'border-gray-300'}`}>
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a file</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="sr-only" 
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/gif"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                {formData.photo && (
                  <p className="text-xs text-green-600 mt-1">
                    Selected: {formData.photo.name}
                  </p>
                )}
                {errors.photo && <p className="text-xs text-red-600 mt-1">{errors.photo}</p>}
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea 
              id="description" 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4" 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemsForm;