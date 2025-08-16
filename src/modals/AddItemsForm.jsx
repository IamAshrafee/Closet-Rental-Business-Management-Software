import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiUploadCloud } from 'react-icons/fi';
import { getDatabase, ref, push, set, update } from 'firebase/database';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = ({ label, name, type = 'text', required = false, placeholder = '', min, step, formData, errors, handleChange, children }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children || (
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        step={step}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
    )}
    {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
  </div>
);

const RadioGroup = ({ label, name, options, formData, handleRadioChange, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="space-y-2">
      {options.map((option) => (
        <div key={option.value} className="flex items-center">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            checked={formData[name] === option.value}
            onChange={() => handleRadioChange(name, option.value)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
          />
          <label htmlFor={`${name}-${option.value}`} className="ml-3 block text-sm text-gray-700">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  </div>
);

const AddItemsForm = ({ isOpen, onClose, item }) => {
  const initialFormData = {
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
    photo: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = getDatabase();
  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData(item);
        if (item.photo) {
          setImageUrl(item.photo);
        }
      } else {
        setFormData(initialFormData);
        setImageUrl("");
      }
    }
  }, [isOpen, item]);

  useEffect(() => {
    const { purchasePrice, rentOption, rentValue, rentFrom } = formData;
    if (purchasePrice > 0) {
      let rent = 0;
      if (rentOption === 'fixed' && rentValue > 0) {
        rent = rentValue;
      } else if (rentOption === 'range' && rentFrom > 0) {
        rent = rentFrom;
      }

      if (rent > 0) {
        setFormData(prev => ({
          ...prev,
          target: Math.ceil(purchasePrice / rent)
        }));
      } else {
        setFormData(prev => ({ ...prev, target: '' }));
      }
    }
  }, [formData.purchasePrice, formData.rentOption, formData.rentValue, formData.rentFrom]);

  const uploadImage = async (file) => {
    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ItemImages");
    data.append("folder", "react/images");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dlwwb5ir0/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();
      setImageUrl(result.secure_url);
      setFormData(prev => ({ ...prev, photo: result.secure_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors(prev => ({ ...prev, photo: 'Failed to upload image' }));
    } finally {
      setIsUploading(false);
    }
  };

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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
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
      uploadImage(file);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      if (item) {
        const itemRef = ref(db, `users/${userInfo.uid}/items/${item.id}`);
        await update(itemRef, formData);
      } else {
        const itemsRef = ref(db, `users/${userInfo.uid}/items`);
        const newItemRef = push(itemsRef);
        await set(newItemRef, { ...formData, rented: 0 });
      }
      onClose();
    } catch (error) {
      console.error("Error saving item to database:", error);
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
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-bold text-gray-800">
              {item ? 'Edit Item' : 'Add New Item'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Close form"
            >
              <IoMdClose size={24} />
            </button>
          </div>

          {/* Form Content */}
          <div className="overflow-y-auto p-6 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <InputField label="Name" name="name" required formData={formData} errors={errors} handleChange={handleChange} />
                <InputField label="Category" name="category" required formData={formData} errors={errors} handleChange={handleChange} />
                
                <RadioGroup
                  label="Size"
                  name="sizeOption"
                  options={[
                    { value: 'fixed', label: 'Fixed size' },
                    { value: 'range', label: 'Size range' },
                    { value: 'free', label: 'Free size' }
                  ]}
                  formData={formData}
                  handleRadioChange={handleRadioChange}
                />
                
                {formData.sizeOption === 'fixed' && (
                  <InputField label="Size Value" name="sizeValue" required formData={formData} errors={errors} handleChange={handleChange} />
                )}
                
                {formData.sizeOption === 'range' && (
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="From" name="sizeFrom" required formData={formData} errors={errors} handleChange={handleChange} />
                    <InputField label="To" name="sizeTo" required formData={formData} errors={errors} handleChange={handleChange} />
                  </div>
                )}
                
                <InputField label="Length (optional)" name="long" formData={formData} errors={errors} handleChange={handleChange} />
                <InputField label="Colors" name="colors" formData={formData} errors={errors} handleChange={handleChange} />
              </div>

              {/* Right Column */}
              <div>
                <InputField label="Purchase Date" name="purchaseDate" type="date" formData={formData} errors={errors} handleChange={handleChange} />
                <InputField label="Purchased From" name="purchaseFrom" formData={formData} errors={errors} handleChange={handleChange} />
                <InputField label="Item's Country" name="itemCountry" formData={formData} errors={errors} handleChange={handleChange} />
                <InputField 
                  label="Purchase Price" 
                  name="purchasePrice" 
                  type="number" 
                  required 
                  min="0" 
                  step="0.01" 
                  formData={formData} errors={errors} handleChange={handleChange}
                />
                
                <RadioGroup
                  label="Availability"
                  name="availability"
                  options={[
                    { value: 'available', label: 'Available' },
                    { value: 'not-available', label: 'Not available' }
                  ]}
                  formData={formData}
                  handleRadioChange={handleRadioChange}
                />
                
                {formData.availability === 'not-available' && (
                  <InputField 
                    label="Available From" 
                    name="availableFrom" 
                    type="date" 
                    required={formData.availability === 'not-available'}
                    formData={formData} errors={errors} handleChange={handleChange}
                  />
                )}
                
                <div className="mb-4">
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                    Item's Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              </div>
            </div>

            {/* Rent Price Section */}
            <div className="mt-6 border-t pt-6">
              <RadioGroup
                label="Rent Price"
                name="rentOption"
                options={[
                  { value: 'fixed', label: 'Fixed price' },
                  { value: 'per-day', label: 'Price per day' },
                  { value: 'range', label: 'Price range' }
                ]}
                formData={formData}
                handleRadioChange={handleRadioChange}
              />
              
              {formData.rentOption === 'fixed' && (
                <InputField
                  label="Rent Price"
                  name="rentValue"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  formData={formData} errors={errors} handleChange={handleChange}
                />
              )}
              
              {formData.rentOption === 'per-day' && (
                <InputField
                  label="Price Per Day"
                  name="rentPerDay"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  formData={formData} errors={errors} handleChange={handleChange}
                />
              )}
              
              {formData.rentOption === 'range' && (
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="From" name="rentFrom" type="number" required min="0" step="0.01" formData={formData} errors={errors} handleChange={handleChange} />
                  <InputField label="To" name="rentTo" type="number" required min="0" step="0.01" formData={formData} errors={errors} handleChange={handleChange} />
                </div>
              )}
            </div>

            {/* Target */}
            <InputField
              label="Target"
              name="target"
              type="number"
              required
              min="1"
              step="1"
              formData={formData} errors={errors} handleChange={handleChange}
            >
              <div>
                <input
                  type="number"
                  id="target"
                  name="target"
                  value={formData.target}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  readOnly={formData.rentOption !== 'per-day'}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.target ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <p className="mt-1 text-sm text-gray-500">
                  How many times the item must be rented to get back the original purchase price.
                </p>
                {errors.target && <p className="mt-1 text-sm text-red-600">{errors.target}</p>}
              </div>
            </InputField>

            {/* Item Photo */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Photo</label>
              <div
                className={`mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                  errors.photo ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-2"></div>
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </div>
                ) : imageUrl ? (
                  <div className="relative group">
                    <img
                      src={imageUrl}
                      alt="Uploaded preview"
                      className="h-40 object-contain rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <FiUploadCloud className="text-white text-2xl" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 mt-3">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
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
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
                {errors.photo && <p className="mt-2 text-sm text-red-600">{errors.photo}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Add any additional details about the item..."
              ></textarea>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isUploading || isSubmitting}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : isSubmitting ? 'Saving...' : 'Save Item'}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddItemsForm;