import React from 'react';
import Sidebar from '../layout/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency } from '../slice/currencySlice';
import { setCompanyName } from '../slice/companySlice';

const currencies = [
  { symbol: '$', code: 'USD' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: '¥', code: 'JPY' },
  { symbol: '₹', code: 'INR' },
  { symbol: '৳', code: 'BDT' },
];

const Settings = () => {
  const dispatch = useDispatch();
  const selectedCurrency = useSelector((state) => state.currency.value);
  const companyName = useSelector((state) => state.company.value);

  const handleCurrencyChange = (e) => {
    const currency = currencies.find(c => c.code === e.target.value);
    if (currency) {
      dispatch(setCurrency(currency));
    }
  };

  const handleCompanyNameChange = (e) => {
    dispatch(setCompanyName(e.target.value));
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
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default Settings;