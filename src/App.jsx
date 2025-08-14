import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Stock from "./pages/Stock";
import Customers from "./pages/Customers";
import AddItemsForm from "./modals/AddItemsForm";
import StockItemCard from "./cards/StockItemCard";


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
  {
    path: "/AddItemsForm",
    element: <StockItemCard />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
