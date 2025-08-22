import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "./features/home/HomePage";
import Stock from "./features/stock/StockPage";
import Customers from "./features/customers/CustomersPage";
import Bookings from "./features/bookings/BookingsPage";
import Reminders from "./features/reminders/RemindersPage";
import Login from "./features/auth/LoginPage";
import Registration from "./features/auth/RegistrationPage";
import { store } from "./store/index.js";
import { Provider } from "react-redux";
import VerifyEmail from "./features/auth/VerifyEmailPage";
import Settings from "./features/settings/SettingsPage";
import Partners from "./features/partners/PartnersPage";
import PartnerPayouts from "./features/partners/PartnerPayoutsPage";
import Todo from "./features/todo/TodoPage";
import AppLayout from "./layout/AppLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AppLayout />,
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