import React from "react";
import Sidebar from "../layout/Sidebar";

const Customers = () => {
  return (
    <Sidebar>
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold font-poppins">Customers</h1>
        <p className="font-poppins text-gray-500 mt-2">
          Welcome to your customer management dashboard
        </p>
      </div>
    </Sidebar>
  );
};

export default Customers;