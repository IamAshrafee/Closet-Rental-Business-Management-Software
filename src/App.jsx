import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Stock from "./pages/Stock";
import Customers from "./pages/Customers";
import Bookings from "./pages/Bookings";
import AddItemsForm from "./modals/AddItemsForm";
import { Navigate } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
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
    path: "/bookings",
    element: <Bookings />,
  },
  {
    path: "/add-item", // More descriptive route
    element: <AddItemsForm />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;