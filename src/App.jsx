import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Stock from "./pages/Stock";
import Customers from "./pages/Customers";
import Bookings from "./pages/Bookings";
import Reminders from "./pages/Reminders";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import { store } from "./store";
import { Provider } from "react-redux";
import VerifyEmail from "./pages/VerifyEmail";
import PrivateRoute from "./authentication/PrivateRoute";
import Settings from "./pages/Settings";
import Partners from "./pages/Partners";
import PartnerPayouts from "./pages/PartnerPayouts";
import Todo from "./pages/Todo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <PrivateRoute />,
    children: [
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
        path: "/reminders",
        element: <Reminders />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/partners",
        element: <Partners />,
      },
      {
        path: "/payouts",
        element: <PartnerPayouts />,
      },
      {
        path: "/todo",
        element: <Todo />,
      },
    ],
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
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
