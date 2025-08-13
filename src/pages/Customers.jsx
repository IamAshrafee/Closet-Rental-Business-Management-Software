import React from "react";
import Sidebar from "../layout/Sidebar";

const Customers = () => {
  return (
    <div>
      <Sidebar>
        <div className="mt-7 flex flex-col">
          <div className="flex flex-col">
            <p className="text-4xl font-bold font-poppins leading-12">
              Customers
            </p>
            <p className="font-poppins text-gray-500">
              Welcome to your customer management dashboard
            </p>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default Customers;
