import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const AddItemsForm = ({ onClose }) => {
  const [sizeOption, setSizeOption] = useState('fixed');
  const [availability, setAvailability] = useState('available');
  const [rentOption, setRentOption] = useState('fixed');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Item</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <IoMdClose size={24} />
          </button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <input type="text" id="category" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Size</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input type="radio" id="fixed-size" name="sizeOption" value="fixed" checked={sizeOption === 'fixed'} onChange={() => setSizeOption('fixed')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                <label htmlFor="fixed-size" className="ml-3 block text-sm font-medium text-gray-700">Fixed size</label>
              </div>
              {sizeOption === 'fixed' && (
                <input type="text" placeholder="Enter size" className="mt-1 ml-7 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
              )}
              <div className="flex items-center">
                <input type="radio" id="size-range" name="sizeOption" value="range" checked={sizeOption === 'range'} onChange={() => setSizeOption('range')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                <label htmlFor="size-range" className="ml-3 block text-sm font-medium text-gray-700">Size range</label>
              </div>
              {sizeOption === 'range' && (
                <div className="flex gap-4 ml-7 mt-1">
                  <input type="text" placeholder="From" className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
                  <input type="text" placeholder="To" className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
                </div>
              )}
              <div className="flex items-center">
                <input type="radio" id="free-size" name="sizeOption" value="free" checked={sizeOption === 'free'} onChange={() => setSizeOption('free')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                <label htmlFor="free-size" className="ml-3 block text-sm font-medium text-gray-700">Free size</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Long (optional) */}
            <div>
                <label htmlFor="long" className="block text-sm font-medium text-gray-700">Long (optional)</label>
                <input type="text" id="long" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>

            {/* Colors */}
            <div>
                <label htmlFor="colors" className="block text-sm font-medium text-gray-700">Colors</label>
                <input type="text" id="colors" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Purchase Date (optional) */}
            <div>
              <label htmlFor="purchase-date" className="block text-sm font-medium text-gray-700">Purchase date (optional)</label>
              <input type="date" id="purchase-date" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>

            {/* Purchase From (optional) */}
            <div>
              <label htmlFor="purchase-from" className="block text-sm font-medium text-gray-700">Purchase from (optional)</label>
              <input type="text" id="purchase-from" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item's Country (optional) */}
            <div>
                <label htmlFor="item-country" className="block text-sm font-medium text-gray-700">Item's country (optional)</label>
                <input type="text" id="item-country" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>

            {/* Purchase Price */}
            <div>
                <label htmlFor="purchase-price" className="block text-sm font-medium text-gray-700">Purchase price</label>
                <input type="number" id="purchase-price" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Availability</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input type="radio" id="available" name="availability" value="available" checked={availability === 'available'} onChange={() => setAvailability('available')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                <label htmlFor="available" className="ml-3 block text-sm font-medium text-gray-700">Available</label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="not-available" name="availability" value="not-available" checked={availability === 'not-available'} onChange={() => setAvailability('not-available')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                <label htmlFor="not-available" className="ml-3 block text-sm font-medium text-gray-700">Not available</label>
              </div>
              {availability === 'not-available' && (
                <input type="date" placeholder="Available from" className="mt-1 ml-7 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
              )}
            </div>
          </div>

          {/* Item's Condition */}
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Item's condition</label>
            <select id="condition" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2">
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
            <label className="block text-sm font-medium text-gray-700">Rent price</label>
            <div className="mt-2 space-y-2">
                <div className="flex items-center">
                    <input type="radio" id="fixed-price" name="rentOption" value="fixed" checked={rentOption === 'fixed'} onChange={() => setRentOption('fixed')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <label htmlFor="fixed-price" className="ml-3 block text-sm font-medium text-gray-700">Fixed price</label>
                </div>
                {rentOption === 'fixed' && (
                    <input type="number" placeholder="Enter price" className="mt-1 ml-7 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
                )}

                <div className="flex items-center">
                    <input type="radio" id="per-day-price" name="rentOption" value="per-day" checked={rentOption === 'per-day'} onChange={() => setRentOption('per-day')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <label htmlFor="per-day-price" className="ml-3 block text-sm font-medium text-gray-700">Price per day</label>
                </div>
                {rentOption === 'per-day' && (
                    <input type="number" placeholder="Enter price per day" className="mt-1 ml-7 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
                )}

                <div className="flex items-center">
                    <input type="radio" id="price-range" name="rentOption" value="range" checked={rentOption === 'range'} onChange={() => setRentOption('range')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <label htmlFor="price-range" className="ml-3 block text-sm font-medium text-gray-700">Price range</label>
                </div>
                {rentOption === 'range' && (
                    <div className="flex gap-4 ml-7 mt-1">
                        <input type="number" placeholder="From" className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
                        <input type="number" placeholder="To" className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
                    </div>
                )}
            </div>
          </div>

          {/* Target */}
          <div>
            <label htmlFor="target" className="block text-sm font-medium text-gray-700">Target</label>
            <p className="text-sm text-gray-500">How many times the item must be rented to get back the original purchase price.</p>
            <input type="number" id="target" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
          </div>

          {/* Item Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Item photo</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemsForm;