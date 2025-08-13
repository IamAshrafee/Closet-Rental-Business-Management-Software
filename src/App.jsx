import React from "react";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router";
import Stock from "./pages/Stock";
import Customers from "./pages/Customers";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Home />,
  },
  {
    path: "/stock",
    element: <Stock />,
  },
  {
    path: "/customers",
    element: <Customers />,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />,
    </>
  );
};

export default App;
