import React, { useState, useEffect } from 'react';
import Sidebar from '../layout/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency } from '../slice/currencySlice';
import { setCompanyName } from '../slice/companySlice';
import { setDateTimeFormat } from '../slice/dateTimeSlice';
import { setCategories } from '../slice/categorySlice';
import { setColors } from '../slice/colorSlice';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const currencies = [
  { symbol: '$', code: 'USD' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: '¥', code: 'JPY' },
  { symbol: '₹', code: 'INR' },
  { symbol: '৳', code: 'BDT' },
];

const dateFormats = [
  { label: 'MM/DD/YYYY', format: 'MM/DD/YYYY' },
  { label: 'DD/MM/YYYY', format: 'DD/MM/YYYY' },
  { label: 'YYYY-MM-DD', format: 'YYYY-MM-DD' },
];

const timeFormats = [
  { label: 'hh:mm A (12-hour)', format: 'hh:mm A' },
  { label: 'HH:mm (24-hour)', format: 'HH:mm' },
];

const Settings = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userLogInfo.value);
  const db = getDatabase();
  const selectedCurrency = useSelector((state) => state.currency.value);
  const companyName = useSelector((state) => state.company.value);
  const selectedDateTimeFormat = useSelector((state) => state.dateTime.value);
  const categories = useSelector((state) => state.category.value);
  const colors = useSelector((state) => state.color.value);

  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');

  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [editingColor, setEditingColor] = useState(null);
  const [editedColorName, setEditedColorName] = useState('');
  const [editedColorHex, setEditedColorHex] = useState('');

  useEffect(() => {
    if (userInfo) {
      const settingsRef = ref(db, `users/${userInfo.uid}/settings`);
      onValue(settingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          if (data.categories) {
            dispatch(setCategories(data.categories));
          }
          if (data.colors) {
            dispatch(setColors(data.colors));
          }
          if (data.currency) {
            dispatch(setCurrency(data.currency));
          }
          if (data.companyName) {
            dispatch(setCompanyName(data.companyName));
          }
          if (data.dateTimeFormat) {
            dispatch(setDateTimeFormat(data.dateTimeFormat));
          }
        }
      });
    }
  }, [db, userInfo, dispatch]);

  const handleCurrencyChange = (e) => {
    const currency = currencies.find(c => c.code === e.target.value);
    if (currency) {
      const currencyRef = ref(db, `users/${userInfo.uid}/settings/currency`);
      set(currencyRef, currency);
    }
  };

  const handleCompanyNameChange = (e) => {
    const newName = e.target.value;
    const companyNameRef = ref(db, `users/${userInfo.uid}/settings/companyName`);
    set(companyNameRef, newName);
  };

  const handleDateFormatChange = (e) => {
    const newFormat = e.target.value;
    const newDateTimeFormat = { ...selectedDateTimeFormat, dateFormat: newFormat };
    const dateTimeFormatRef = ref(db, `users/${userInfo.uid}/settings/dateTimeFormat`);
    set(dateTimeFormatRef, newDateTimeFormat);
  };

  const handleTimeFormatChange = (e) => {
    const newFormat = e.target.value;
    const newDateTimeFormat = { ...selectedDateTimeFormat, timeFormat: newFormat };
    const dateTimeFormatRef = ref(db, `users/${userInfo.uid}/settings/dateTimeFormat`);
    set(dateTimeFormatRef, newDateTimeFormat);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '' && !categories.includes(newCategory.trim())) {
      const newCategories = [...categories, newCategory.trim()];
      const categoriesRef = ref(db, `users/${userInfo.uid}/settings/categories`);
      set(categoriesRef, newCategories);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    const newCategories = categories.filter(category => category !== categoryToRemove);
    const categoriesRef = ref(db, `users/${userInfo.uid}/settings/categories`);
    set(categoriesRef, newCategories);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditedCategoryName(category);
  };

  const handleSaveCategory = () => {
    if (editedCategoryName.trim() !== '' && editedCategoryName.trim() !== editingCategory) {
      const newCategories = categories.map(c => (c === editingCategory ? editedCategoryName.trim() : c));
      const categoriesRef = ref(db, `users/${userInfo.uid}/settings/categories`);
      set(categoriesRef, newCategories);
      setEditingCategory(null);
      setEditedCategoryName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditedCategoryName('');
  };

  const handleAddColor = () => {
    if (newColorName.trim() !== '' && !colors.some(color => color.name === newColorName.trim())) {
      const newColors = [...colors, { name: newColorName.trim(), hex: newColorHex }];
      const colorsRef = ref(db, `users/${userInfo.uid}/settings/colors`);
      set(colorsRef, newColors);
      setNewColorName('');
      setNewColorHex('#000000');
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    const newColors = colors.filter(color => color.name !== colorToRemove.name);
    const colorsRef = ref(db, `users/${userInfo.uid}/settings/colors`);
    set(colorsRef, newColors);
  };

  const handleEditColor = (color) => {
    setEditingColor(color);
    setEditedColorName(color.name);
    setEditedColorHex(color.hex);
  };

  const handleSaveColor = () => {
    if (editedColorName.trim() !== '' && editedColorHex.trim() !== '') {
      const newColors = colors.map(c => (c.name === editingColor.name ? { name: editedColorName.trim(), hex: editedColorHex } : c));
      const colorsRef = ref(db, `users/${userInfo.uid}/settings/colors`);
      set(colorsRef, newColors);
      setEditingColor(null);
      setEditedColorName('');
      setEditedColorHex('');
    }
  };

  const handleCancelColorEdit = () => {
    setEditingColor(null);
    setEditedColorName('');
    setEditedColorHex('');
  };

  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6 px-4 md:px-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Manage your application settings.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">General Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Currency</p>
              <select
                value={selectedCurrency.code}
                onChange={handleCurrencyChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="companyName" className="text-gray-600">Company Name</label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={handleCompanyNameChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Date Format</p>
              <select
                value={selectedDateTimeFormat.dateFormat}
                onChange={handleDateFormatChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {dateFormats.map(format => (
                  <option key={format.format} value={format.format}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Time Format</p>
              <select
                value={selectedDateTimeFormat.timeFormat}
                onChange={handleTimeFormatChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {timeFormats.map(format => (
                  <option key={format.format} value={format.format}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Categories</h2>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="New Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleAddCategory}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 flex items-center"
            >
              <FiPlus className="mr-2" /> Add
            </button>
          </div>

          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                {editingCategory === category ? (
                  <input
                    type="text"
                    value={editedCategoryName}
                    onChange={(e) => setEditedCategoryName(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                ) : (
                  <span className="text-gray-700 font-medium">{category}</span>
                )}
                <div className="flex space-x-2">
                  {editingCategory === category ? (
                    <>
                      <button
                        onClick={handleSaveCategory}
                        className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveCategory(category)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Colors</h2>
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="New Color Name"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-10 h-10 p-1 border border-gray-300 rounded-r-lg cursor-pointer"
              title="Pick a color"
            />
            <button
              onClick={handleAddColor}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 flex items-center ml-2"
            >
              <FiPlus className="mr-2" /> Add
            </button>
          </div>

          <ul className="space-y-2">
            {colors.map((color, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                {editingColor && editingColor.name === color.name ? (
                  <div className="flex-grow flex items-center space-x-2">
                    <input
                      type="text"
                      value={editedColorName}
                      onChange={(e) => setEditedColorName(e.target.value)}
                      className="flex-grow border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="color"
                      value={editedColorHex}
                      onChange={(e) => setEditedColorHex(e.target.value)}
                      className="w-8 h-8 p-1 border border-gray-300 rounded-md cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: color.hex }}></div>
                    <span className="text-gray-700 font-medium">{color.name} ({color.hex})</span>
                  </div>
                )}
                <div className="flex space-x-2">
                  {editingColor && editingColor.name === color.name ? (
                    <>
                      <button
                        onClick={handleSaveColor}
                        className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelColorEdit}
                        className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditColor(color)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveColor(color)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Sidebar>
  );
};

export default Settings;