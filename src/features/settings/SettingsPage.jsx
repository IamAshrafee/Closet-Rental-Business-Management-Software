import React, { useState, useEffect } from 'react';
import Sidebar from '../../layout/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency } from '../../store/slices/currencySlice';
import { setCompanyName } from '../../store/slices/companySlice';
import { setDateTimeFormat } from '../../store/slices/dateTimeSlice';
import { setCategories } from '../../store/slices/categorySlice';
import { setColors } from '../../store/slices/colorSlice';
import { setNotificationSettings } from '../../store/slices/notificationSlice';
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiChevronDown, FiChevronUp, FiInfo, FiBell } from 'react-icons/fi';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../../lib/firebase';
import { requestNotificationPermission, showNotification } from '../../utils/notifications';

const currencies = [
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  { symbol: '৳', code: 'BDT', name: 'Bangladeshi Taka' },
];

const dateFormats = [
    { label: 'MM/dd/yyyy', format: 'MM/dd/yyyy', example: '12/31/2023' },
    { label: 'dd/MM/yyyy', format: 'dd/MM/yyyy', example: '31/12/2023' },
    { label: 'yyyy-MM-dd', format: 'yyyy-MM-dd', example: '2023-12-31' },
    { label: 'dd MMM yyyy', format: 'dd MMM yyyy', example: '31 Dec 2023' },
  ];
  
  const timeFormats = [
    { label: 'hh:mm a', format: 'hh:mm a', example: '02:30 PM' },
    { label: 'HH:mm', format: 'HH:mm', example: '14:30' },
  ];

const capitalize = (s) => s && s.charAt(0).toUpperCase() + s.slice(1);

const Settings = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userLogInfo.value);
  const selectedCurrency = useSelector((state) => state.currency.value);
  const companyName = useSelector((state) => state.company.value);
  const selectedDateTimeFormat = useSelector((state) => state.dateTime.value);
  const categories = useSelector((state) => state.category.value);
  const colors = useSelector((state) => state.color.value);
  const notificationSettings = useSelector((state) => state.notifications.value);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');

  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#3b82f6');
  const [editingColor, setEditingColor] = useState(null);
  const [editedColorName, setEditedColorName] = useState('');
  const [editedColorHex, setEditedColorHex] = useState('');

  const [expandedSections, setExpandedSections] = useState({
    general: true,
    notifications: true,
    categories: true,
    colors: true
  });

  useEffect(() => {
    if (userInfo) {
      const settingsRef = ref(db, `users/${userInfo.uid}/settings`);
      onValue(settingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          if (data.categories) dispatch(setCategories(data.categories));
          if (data.colors) dispatch(setColors(data.colors));
          if (data.currency) dispatch(setCurrency(data.currency));
          if (data.companyName) dispatch(setCompanyName(data.companyName));
          if (data.dateTimeFormat) {
            if (data.dateTimeFormat.timeFormat === 'hh:mm A') {
              data.dateTimeFormat.timeFormat = 'hh:mm a';
              const dateTimeFormatRef = ref(db, `users/${userInfo.uid}/settings/dateTimeFormat`);
              set(dateTimeFormatRef, data.dateTimeFormat);
            }
            dispatch(setDateTimeFormat(data.dateTimeFormat));
          }
          if (data.notifications) dispatch(setNotificationSettings(data.notifications));
        }
        setIsLoading(false);
      }, (error) => {
        setError(error.message);
        setIsLoading(false);
      });
    }
  }, [userInfo, dispatch]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleToggleNotifications = async () => {
    const newSettings = { ...notificationSettings, enabled: !notificationSettings.enabled };
    dispatch(setNotificationSettings(newSettings));
    try {
      const notificationsRef = ref(db, `users/${userInfo.uid}/settings/notifications`);
      await set(notificationsRef, newSettings);
    } catch (error) {
      setError("Failed to save notification settings.");
      console.error(error);
    }
  };

  const handleSendTestNotification = async () => {
    const hasPermission = await requestNotificationPermission();
    if (hasPermission) {
      showNotification('Test Notification', {
        body: 'This is a test notification from Rentiva.',
        icon: '/todo-icon.svg',
      });
    } else {
      alert('Notification permission is required. Please enable it in your browser settings.');
    }
  };

  const handleCurrencyChange = async (e) => {
    const currency = currencies.find(c => c.code === e.target.value);
    if (currency) {
      try {
        const currencyRef = ref(db, `users/${userInfo.uid}/settings/currency`);
        await set(currencyRef, currency);
      } catch (error) {
        setError("Failed to save currency settings.");
        console.error(error);
      }
    }
  };

  const handleCompanyNameChange = async (e) => {
    const newName = e.target.value;
    try {
      const companyNameRef = ref(db, `users/${userInfo.uid}/settings/companyName`);
      await set(companyNameRef, newName);
    } catch (error) {
      setError("Failed to save company name.");
      console.error(error);
    }
  };

  const handleDateFormatChange = async (e) => {
    const newFormat = e.target.value;
    const newDateTimeFormat = { ...selectedDateTimeFormat, dateFormat: newFormat };
    try {
      const dateTimeFormatRef = ref(db, `users/${userInfo.uid}/settings/dateTimeFormat`);
      await set(dateTimeFormatRef, newDateTimeFormat);
    } catch (error) {
      setError("Failed to save date format.");
      console.error(error);
    }
  };

  const handleTimeFormatChange = async (e) => {
    const newFormat = e.target.value;
    const newDateTimeFormat = { ...selectedDateTimeFormat, timeFormat: newFormat };
    try {
      const dateTimeFormatRef = ref(db, `users/${userInfo.uid}/settings/dateTimeFormat`);
      await set(dateTimeFormatRef, newDateTimeFormat);
    } catch (error) {
      setError("Failed to save time format.");
      console.error(error);
    }
  };

  const handleAddCategory = async () => {
    const capitalizedCategory = capitalize(newCategory.trim());
    if (capitalizedCategory !== '' && !categories.includes(capitalizedCategory)) {
      const newCategories = [...categories, capitalizedCategory];
      try {
        const categoriesRef = ref(db, `users/${userInfo.uid}/settings/categories`);
        await set(categoriesRef, newCategories);
        setNewCategory('');
      } catch (error) {
        setError("Failed to add category.");
        console.error(error);
      }
    }
  };

  const handleRemoveCategory = async (categoryToRemove) => {
    const newCategories = categories.filter(category => category !== categoryToRemove);
    try {
      const categoriesRef = ref(db, `users/${userInfo.uid}/settings/categories`);
      await set(categoriesRef, newCategories);
    } catch (error) {
      setError("Failed to remove category.");
      console.error(error);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditedCategoryName(category);
  };

  const handleSaveCategory = async () => {
    const capitalizedCategory = capitalize(editedCategoryName.trim());
    if (capitalizedCategory !== '' && capitalizedCategory !== editingCategory) {
      const newCategories = categories.map(c => (c === editingCategory ? capitalizedCategory : c));
      try {
        const categoriesRef = ref(db, `users/${userInfo.uid}/settings/categories`);
        await set(categoriesRef, newCategories);
        setEditingCategory(null);
        setEditedCategoryName('');
      } catch (error) {
        setError("Failed to save category.");
        console.error(error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditedCategoryName('');
  };

  const handleAddColor = async () => {
    const capitalizedColorName = capitalize(newColorName.trim());
    if (capitalizedColorName !== '' && !colors.some(color => color.name === capitalizedColorName)) {
      const newColors = [...colors, { name: capitalizedColorName, hex: newColorHex }];
      try {
        const colorsRef = ref(db, `users/${userInfo.uid}/settings/colors`);
        await set(colorsRef, newColors);
        setNewColorName('');
        setNewColorHex('#3b82f6');
      } catch (error) {
        setError("Failed to add color.");
        console.error(error);
      }
    }
  };

  const handleRemoveColor = async (colorToRemove) => {
    const newColors = colors.filter(color => color.name !== colorToRemove.name);
    try {
      const colorsRef = ref(db, `users/${userInfo.uid}/settings/colors`);
      await set(colorsRef, newColors);
    } catch (error) {
      setError("Failed to remove color.");
      console.error(error);
    }
  };

  const handleEditColor = (color) => {
    setEditingColor(color);
    setEditedColorName(color.name);
    setEditedColorHex(color.hex);
  };

  const handleSaveColor = async () => {
    const capitalizedColorName = capitalize(editedColorName.trim());
    if (capitalizedColorName !== '' && editedColorHex.trim() !== '') {
      const newColors = colors.map(c => (c.name === editingColor.name ? { name: capitalizedColorName, hex: editedColorHex } : c));
      try {
        const colorsRef = ref(db, `users/${userInfo.uid}/settings/colors`);
        await set(colorsRef, newColors);
        setEditingColor(null);
        setEditedColorName('');
        setEditedColorHex('');
      } catch (error) {
        setError("Failed to save color.");
        console.error(error);
      }
    }
  };

  const handleCancelColorEdit = () => {
    setEditingColor(null);
    setEditedColorName('');
    setEditedColorHex('');
  };

  if (isLoading) {
    return (
      <Sidebar>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="flex flex-col h-full pb-6">
        <div className="flex justify-between items-center mb-6 px-4 md:px-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Customize your application preferences
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}

        <div className="space-y-6 px-4 md:px-0">
          {/* General Settings Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button 
              className="flex items-center justify-between w-full p-5 text-left"
              onClick={() => toggleSection('general')}
              aria-expanded={expandedSections.general}
              aria-controls="general-settings-content"
            >
              <h2 className="text-xl font-semibold text-gray-800">General Settings</h2>
              {expandedSections.general ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </button>
            
            {expandedSections.general && (
              <div id="general-settings-content" className="px-5 pb-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <div className="relative">
                      <select
                        value={selectedCurrency.code}
                        onChange={handleCurrencyChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.name} ({currency.symbol})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <FiChevronDown />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 flex items-center">
                      <FiInfo className="mr-1" /> This will be used for all financial transactions
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      id="companyName"
                      value={companyName}
                      onChange={handleCompanyNameChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-5">
                  <h3 className="text-md font-medium text-gray-800 mb-4">Date & Time Format</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                      <div className="relative">
                        <select
                          value={selectedDateTimeFormat.dateFormat}
                          onChange={handleDateFormatChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                        >
                          {dateFormats.map(format => (
                            <option key={format.format} value={format.format}>
                              {format.label} - {format.example}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <FiChevronDown />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                      <div className="relative">
                        <select
                          value={selectedDateTimeFormat.timeFormat}
                          onChange={handleTimeFormatChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                        >
                          {timeFormats.map(format => (
                            <option key={format.format} value={format.format}>
                              {format.label} - {format.example}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <FiChevronDown />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notification Settings Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button 
              className="flex items-center justify-between w-full p-5 text-left"
              onClick={() => toggleSection('notifications')}
              aria-expanded={expandedSections.notifications}
              aria-controls="notifications-settings-content"
            >
              <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>
              {expandedSections.notifications ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </button>
            
            {expandedSections.notifications && (
              <div id="notifications-settings-content" className="px-5 pb-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium text-gray-800">To-do Reminders</h3>
                    <p className="text-sm text-gray-500">Enable hourly reminders for incomplete tasks.</p>
                  </div>
                  <button
                    onClick={handleToggleNotifications}
                    className={`${
                      notificationSettings.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    <span
                      className={`${
                        notificationSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                      } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                    />
                  </button>
                </div>
                <div className="border-t border-gray-200 pt-5">
                  <button
                    onClick={handleSendTestNotification}
                    className="w-full sm:w-auto bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <FiBell className="mr-2" size={16} />
                    Send Test Notification
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button 
              className="flex items-center justify-between w-full p-5 text-left"
              onClick={() => toggleSection('categories')}
              aria-expanded={expandedSections.categories}
              aria-controls="categories-content"
            >
              <h2 className="text-xl font-semibold text-gray-800">Manage Categories</h2>
              {expandedSections.categories ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </button>
            
            {expandedSections.categories && (
              <div id="categories-content" className="px-5 pb-5">
                <div className="flex flex-col md:flex-row gap-3 mb-5">
                  <input
                    type="text"
                    placeholder="Add a new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                  <button
                    onClick={handleAddCategory}
                    disabled={!newCategory.trim()}
                    className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiPlus className="mr-2" /> Add Category
                  </button>
                </div>

                {categories.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0 bg-gray-50 even:bg-white">
                        {editingCategory === category ? (
                          <input
                            type="text"
                            value={editedCategoryName}
                            onChange={(e) => setEditedCategoryName(e.target.value)}
                            className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            autoFocus
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveCategory()}
                          />
                        ) : (
                          <span className="text-gray-700 font-medium">{category}</span>
                        )}
                        <div className="flex space-x-2">
                          {editingCategory === category ? (
                            <>
                              <button
                                onClick={handleSaveCategory}
                                disabled={!editedCategoryName.trim() || editedCategoryName.trim() === category}
                                className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Save changes"
                              >
                                <FiSave size={18} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
                                title="Cancel editing"
                              >
                                <FiX size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100"
                                title="Edit category"
                              >
                                <FiEdit size={18} />
                              </button>
                              <button
                                onClick={() => handleRemoveCategory(category)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100"
                                title="Delete category"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FiInfo className="mx-auto text-gray-400 mb-2" size={24} />
                    <p>No categories yet. Add your first category above.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Colors Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button 
              className="flex items-center justify-between w-full p-5 text-left"
              onClick={() => toggleSection('colors')}
              aria-expanded={expandedSections.colors}
              aria-controls="colors-content"
            >
              <h2 className="text-xl font-semibold text-gray-800">Manage Colors</h2>
              {expandedSections.colors ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </button>
            
            {expandedSections.colors && (
              <div id="colors-content" className="px-5 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5">
                  <div className="md:col-span-5">
                    <input
                      type="text"
                      placeholder="Color name"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-4 flex items-center">
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-full h-12 p-1 border border-gray-300 rounded-lg cursor-pointer"
                      title="Pick a color"
                    />
                    <span className="ml-2 text-sm text-gray-600">{newColorHex}</span>
                  </div>
                  <div className="md:col-span-3">
                    <button
                      onClick={handleAddColor}
                      disabled={!newColorName.trim()}
                      className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiPlus className="mr-2" /> Add
                    </button>
                  </div>
                </div>

                {colors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {colors.map((color, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
                        {editingColor && editingColor.name === color.name ? (
                          <div className="flex-grow flex items-center space-x-3">
                            <input
                              type="text"
                              value={editedColorName}
                              onChange={(e) => setEditedColorName(e.target.value)}
                              className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              autoFocus
                            />
                            <div className="flex items-center">
                              <input
                                type="color"
                                value={editedColorHex}
                                onChange={(e) => setEditedColorHex(e.target.value)}
                                className="w-8 h-8 p-1 border border-gray-300 rounded-md cursor-pointer"
                              />
                              <span className="ml-2 text-xs text-gray-600">{editedColorHex}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: color.hex }}></div>
                            <div>
                              <p className="text-gray-700 font-medium">{color.name}</p>
                              <p className="text-xs text-gray-500">{color.hex}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex space-x-2">
                          {editingColor && editingColor.name === color.name ? (
                            <>
                              <button
                                onClick={handleSaveColor}
                                disabled={!editedColorName.trim() || !editedColorHex.trim()}
                                className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Save changes"
                              >
                                <FiSave size={18} />
                              </button>
                              <button
                                onClick={handleCancelColorEdit}
                                className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
                                title="Cancel editing"
                              >
                                <FiX size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditColor(color)}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100"
                                title="Edit color"
                              >
                                <FiEdit size={18} />
                              </button>
                              <button
                                onClick={() => handleRemoveColor(color)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100"
                                title="Delete category"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FiInfo className="mx-auto text-gray-400 mb-2" size={24} />
                    <p>No custom colors yet. Add your first color above.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default Settings;