import React from "react";
import Sidebar from "../layout/Sidebar";

const Home = () => {
  return (
    <div>
      <Sidebar>
        <div className="mt-7 flex flex-col">
          <div className="flex flex-col">
            <p className="text-4xl font-bold font-poppins leading-12">
              Dashboard
            </p>
            <p className="font-poppins text-gray-500">
              Welcome to your closet rental business overview
            </p>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default Home;
