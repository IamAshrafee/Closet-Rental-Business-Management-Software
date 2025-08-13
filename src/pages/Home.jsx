import React from "react";
import Sidebar from "../layout/Sidebar";

const Home = () => {
  return (
    <Sidebar>
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold font-poppins">Dashboard</h1>
        <p className="font-poppins text-gray-500 mt-2">
          Welcome to your closet rental business overview
        </p>
      </div>
    </Sidebar>
  );
};

export default Home;