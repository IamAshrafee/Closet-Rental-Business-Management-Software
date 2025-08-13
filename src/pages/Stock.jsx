import React from "react";
import Sidebar from "../layout/Sidebar";

const Stock = () => {
  return (
    <Sidebar>
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold font-poppins">Stock</h1>
        <p className="font-poppins text-gray-500 mt-2">
          Welcome to your stock management dashboard
        </p>
      </div>
    </Sidebar>
  );
};

export default Stock;