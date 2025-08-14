import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import Home from "./pages/Home";
import Stock from "./pages/Stock";
import Customers from "./pages/Customers";
import Bookings from "./pages/Bookings";
import AddItemsForm from "./modals/AddItemsForm";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { store } from "./store";
import { Provider } from "react-redux";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
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
    path: "/add-item",
    element: <AddItemsForm />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
]);

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
