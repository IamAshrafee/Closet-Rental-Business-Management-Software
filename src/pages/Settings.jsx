import React from 'react';
import Sidebar from '../layout/Sidebar';

const Settings = () => {
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
          {/* Add your settings content here */}
          <p className="text-gray-600">Settings content will go here.</p>
        </div>
      </div>
    </Sidebar>
  );
};

export default Settings;
