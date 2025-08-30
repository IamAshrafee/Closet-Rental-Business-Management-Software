import React, { useState, useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FiUploadCloud } from 'react-icons/fi';
import { ref, onValue, push, set, update } from 'firebase/database';
import { db } from '../../lib/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import CreatableSelect from 'react-select/creatable';
import { setColors } from '../../store/slices/colorSlice';
import { setCategories } from '../../store/slices/categorySlice';
import useAutoscrollOnFocus from '../../hooks/useAutoscrollOnFocus';

import CustomDatePicker from '../../components/CustomDatePicker';

const capitalize = (s) => s && s.charAt(0).toUpperCase() + s.slice(1);

const InputField = ({ label, name, type = 'text', required = false, placeholder = '', min, step, formData, errors, handleChange, children }) => (
  <div class="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span class="text-red-500">*</span>}
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
    {errors[name] && <p class="mt-1 text-sm text-red-600">{errors[name]}</p>}
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

const AddItemsForm = ({ isOpen, onClose, item, stockItems }) => {
  const currency = useSelector((state) => state.currency.value);
  const categories = useSelector((state) => state.category.value);
  const colors = useSelector((state) => state.color.value);
  const dispatch = useDispatch();
  const formRef = useRef(null);
  useAutoscrollOnFocus(formRef);
  const initialFormData = {
    name: '',
    category: '',
    sizeOption: 'fixed',
    sizeValue: '',
    sizeFrom: '',
    sizeTo: '',
    long: '',
    colors: [],
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
    photo: '',
    isCollaborated: false,
    ownerId: '',
    status: 'published'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [purchaseFromSuggestions, setPurchaseFromSuggestions] = useState([]);
  const [lengthSuggestions, setLengthSuggestions] = useState([]);
  const [partners, setPartners] = useState([]);
  
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#3b82f6');

  const userInfo = useSelector((state) => state.userLogInfo.value);

  useEffect(() => {
    if (userInfo) {
        const partnersRef = ref(db, `users/${userInfo.uid}/partners`);
        onValue(partnersRef, (snapshot) => {
            const data = snapshot.val();
            setPartners(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
        });
    }
  }, [userInfo]);

  useEffect(() => {
    if (stockItems && stockItems.length > 0) {
      const countryCounts = stockItems.reduce((acc, item) => {
        if (item.itemCountry) {
          acc[item.itemCountry] = (acc[item.itemCountry] || 0) + 1;
        }
        return acc;
      }, {});

      const sortedCountries = Object.keys(countryCounts).sort(
        (a, b) => countryCounts[a] - countryCounts[b]
      );

      setCountrySuggestions(sortedCountries.slice(0, 2));

      const purchaseFromCounts = stockItems.reduce((acc, item) => {
        if (item.purchaseFrom) {
          acc[item.purchaseFrom] = (acc[item.purchaseFrom] || 0) + 1;
        }
        return acc;
      }, {});

      const sortedPurchaseFrom = Object.keys(purchaseFromCounts).sort(
        (a, b) => purchaseFromCounts[b] - purchaseFromCounts[a]
      );

      setPurchaseFromSuggestions(sortedPurchaseFrom.slice(0, 2));

      const lengthCounts = stockItems.reduce((acc, item) => {
        if (item.long) {
          acc[item.long] = (acc[item.long] || 0) + 1;
        }
        return acc;
      }, {});

      const sortedLength = Object.keys(lengthCounts).sort(
        (a, b) => lengthCounts[b] - lengthCounts[a]
      );

      setLengthSuggestions(sortedLength.slice(0, 2));
    }
  }, [stockItems]);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({ ...initialFormData, ...item });
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDateChange = (name, date) => {
    const dateString = date ? date.toISOString().split('T')[0] : '';
    setFormData(prev => ({ ...prev, [name]: dateString }));
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

  const handleCountrySuggestionClick = (country) => {
    if (formData.itemCountry === country) {
      setFormData(prev => ({ ...prev, itemCountry: '' }));
    } else {
      setFormData(prev => ({ ...prev, itemCountry: country }));
    }
  };

  const handleCreateCategory = async (inputValue) => {
    const capitalizedCategory = capitalize(inputValue.trim());
    if (capitalizedCategory && !categories.includes(capitalizedCategory)) {
      const updatedCategories = [...categories, capitalizedCategory];
      const categoriesRef = ref(db, `users/${userInfo.uid}/settings/categories`);
      await set(categoriesRef, updatedCategories);
      dispatch(setCategories(updatedCategories));
      setFormData(prev => ({ ...prev, category: capitalizedCategory }));
    }
  };

  const handleCreateColor = (inputValue) => {
    setNewColorName(capitalize(inputValue));
    setIsColorModalOpen(true);
  };

  const handleSaveNewColor = async () => {
    if (newColorName.trim() === '') return;

    const capitalizedName = capitalize(newColorName.trim());
    const newColor = { name: capitalizedName, hex: newColorHex };
    const updatedColors = [...colors, newColor];
    
    const colorsRef = ref(db, `users/${userInfo.uid}/settings/colors`);
    await set(colorsRef, updatedColors);
    
    dispatch(setColors(updatedColors));
    
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, newColor.name]
    }));

    setIsColorModalOpen(false);
    setNewColorName('');
    setNewColorHex('#3b82f6');
  };

  const validateForm = (isDraft = false) => {
    const newErrors = {};

    if (isDraft) {
      // For drafts, check if at least one field has a value.
      const hasAnyValue = Object.values(formData).some(value => {
        if (typeof value === 'string') return value.trim() !== '';
        if (typeof value === 'number') return value !== '';
        if (Array.isArray(value)) return value.length > 0;
        return value !== false && value !== null && value !== undefined;
      });

      if (!hasAnyValue) {
        // You can set a generic error or a specific one
        newErrors.name = 'At least one field is required to save a draft.';
      }
    } else {
      // Stricter validation for publishing
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (formData.isCollaborated && !formData.ownerId) newErrors.ownerId = 'Please select a partner';
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
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (isDraft = false) => {
    if (!validateForm(isDraft)) return;
    
    setIsSubmitting(true);
    const dataToSave = {
      ...formData,
      status: isDraft ? 'draft' : 'published',
    };

    try {
      if (item) {
        const itemRef = ref(db, `users/${userInfo.uid}/items/${item.id}`);
        await update(itemRef, dataToSave);
      } else {
        const itemsRef = ref(db, `users/${userInfo.uid}/items`);
        const newItemRef = push(itemsRef);
        await set(newItemRef, { ...dataToSave, rented: 0 });
      }
      onClose();
    } catch (error) {
      console.error("Error saving item to database:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(false);
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    handleSave(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center backdrop-blur-sm z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.form
          ref={formRef}
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
                
                {/* Category Select Field */}
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span class="text-red-500">*</span>
                  </label>
                  <CreatableSelect
                    isClearable
                    onCreateOption={handleCreateCategory}
                    options={categories.map(c => ({ value: c, label: c }))}
                    value={formData.category ? { value: formData.category, label: formData.category } : null}
                    onChange={(selectedOption) => {
                      setFormData(prev => ({ ...prev, category: selectedOption ? selectedOption.value : '' }));
                    }}
                    className="basic-single-select"
                    classNamePrefix="select"
                  />
                  {errors.category && <p class="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>
                
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
                  <InputField label="Size Value (inch)" name="sizeValue" required formData={formData} errors={errors} handleChange={handleChange} />
                )}
                
                {formData.sizeOption === 'range' && (
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="From (inch)" name="sizeFrom" required formData={formData} errors={errors} handleChange={handleChange} />
                    <InputField label="To (inch)" name="sizeTo" required formData={formData} errors={errors} handleChange={handleChange} />
                  </div>
                )}
                
                <InputField 
                  label={formData.category === 'Top-Skirt Set Dress' ? 'Length (Top, Skirt) (inch)' : 'Length (inch)'} 
                  name="long" 
                  formData={formData} 
                  errors={errors} 
                  handleChange={handleChange}
                >
                  <div className="relative">
                    <input
                      type="text"
                      id="long"
                      name="long"
                      value={formData.long}
                      onChange={handleChange}
                      placeholder={formData.category === 'Top-Skirt Set Dress' ? 'e.g., 25,40' : ''}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        errors.long ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formData.long === '' && lengthSuggestions.length > 0 && (
                      <div className="absolute top-1/2 right-3 -translate-y-1/2 flex gap-2">
                        {lengthSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, long: suggestion }))}
                            className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </InputField>
                <div className="mb-4">
                  <label htmlFor="colors" className="block text-sm font-medium text-gray-700 mb-1">
                    Colors
                  </label>
                  <CreatableSelect
                    isMulti
                    isClearable
                    onCreateOption={handleCreateColor}
                    options={colors.map(c => ({ value: c.name, label: c.name, color: c.hex }))}
                    value={colors.filter(c => formData.colors.includes(c.name)).map(c => ({ value: c.name, label: c.name, color: c.hex }))}
                    onChange={(selectedOptions) => {
                      const selectedColors = selectedOptions ? selectedOptions.map(option => option.value) : [];
                      setFormData(prev => ({ ...prev, colors: selectedColors }));
                    }}
                    formatOptionLabel={({ label, color }) => (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          backgroundColor: color,
                          borderRadius: '50%',
                          width: '12px',
                          height: '12px',
                          marginRight: '8px',
                          border: '1px solid #ccc'
                        }} />
                        {label}
                      </div>
                    )}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                  {errors.colors && <p class="mt-1 text-sm text-red-600">{errors.colors}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="mb-4 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            id="isCollaborated" 
                            name="isCollaborated"
                            checked={formData.isCollaborated}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isCollaborated" className="ml-2 block text-sm font-medium text-gray-900">
                            Collaborated Item?
                        </label>
                    </div>
                    {formData.isCollaborated && (
                        <div className="mt-4">
                            <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-1">Partner/Owner</label>
                            <select
                                id="ownerId"
                                name="ownerId"
                                value={formData.ownerId}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                    errors.ownerId ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select a partner</option>
                                {partners.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            {errors.ownerId && <p class="mt-1 text-sm text-red-600">{errors.ownerId}</p>}
                        </div>
                    )}
                </div>

                <CustomDatePicker 
                  label="Purchase Date" 
                  selected={formData.purchaseDate} 
                  onChange={date => handleDateChange('purchaseDate', date)} 
                  error={errors.purchaseDate} 
                />
                <InputField label="Purchased From" name="purchaseFrom" formData={formData} errors={errors} handleChange={handleChange}>
                  <div className="relative">
                    <input
                      type="text"
                      id="purchaseFrom"
                      name="purchaseFrom"
                      value={formData.purchaseFrom}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        errors.purchaseFrom ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formData.purchaseFrom === '' && purchaseFromSuggestions.length > 0 && (
                      <div className="absolute top-1/2 right-3 -translate-y-1/2 flex gap-2">
                        {purchaseFromSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, purchaseFrom: suggestion }))}
                            className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </InputField>
                <div>
                  <label htmlFor="itemCountry" className="block text-sm font-medium text-gray-700 mb-1">
                    Item's Country
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="itemCountry"
                      name="itemCountry"
                      value={formData.itemCountry}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                        errors.itemCountry ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formData.itemCountry === '' && countrySuggestions.length > 0 && (
                      <div className="absolute top-1/2 right-3 -translate-y-1/2 flex gap-2">
                        {countrySuggestions.map((country, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleCountrySuggestionClick(country)}
                            className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                          >
                            {country}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.itemCountry && <p class="mt-1 text-sm text-red-600">{errors.itemCountry}</p>}
                </div>
                <InputField 
                  label={`Purchase Price (${currency.symbol})`}
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
                  <CustomDatePicker 
                    label="Available From" 
                    selected={formData.availableFrom} 
                    onChange={date => handleDateChange('availableFrom', date)} 
                    error={errors.availableFrom} 
                    required={formData.availability === 'not-available'}
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
                  label={`Rent Price (${currency.symbol})`}
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
                  label={`Price Per Day (${currency.symbol})`}
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
                  <InputField label={`From (${currency.symbol})`} name="rentFrom" type="number" required min="0" step="0.01" formData={formData} errors={errors} handleChange={handleChange} />
                  <InputField label={`To (${currency.symbol})`} name="rentTo" type="number" required min="0" step="0.01" formData={formData} errors={errors} handleChange={handleChange} />
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
                <p class="mt-1 text-sm text-gray-500">
                  How many times the item must be rented to get back the original purchase price.
                </p>
                {errors.target && <p class="mt-1 text-sm text-red-600">{errors.target}</p>}
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
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <img
                        src={imageUrl}
                        alt="Uploaded preview"
                        className="h-40 object-contain rounded-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <FiUploadCloud className="text-white text-2xl" />
                      </div>
                    </label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/gif"
                    />
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
                {errors.photo && <p class="mt-2 text-sm text-red-600">{errors.photo}</p>}
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
              type="button"
              onClick={handleSaveDraft}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isUploading || isSubmitting}
              className="px-4 py-2 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isUploading || isSubmitting}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : isSubmitting ? 'Saving...' : (item && item.status === 'draft' ? 'Publish' : 'Save Item')}
            </motion.button>
          </div>
        </motion.form>
        
        {isColorModalOpen && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-[60]"
            >
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm"
            >
                <h3 className="text-lg font-semibold mb-4">Add New Color</h3>
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Color Name</label>
                <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    readOnly
                />
                </div>
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Color Hex Code</label>
                <div className="flex items-center mt-1">
                    <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-10 h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                    type="text"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="ml-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                <button
                    type="button"
                    onClick={() => setIsColorModalOpen(false)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSaveNewColor}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white"
                >
                    Save Color
                </button>
                </div>
            </motion.div>
            </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AddItemsForm;