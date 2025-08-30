import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import currencySlice from "./slices/currencySlice";
import companySlice from "./slices/companySlice";
import dateTimeSlice from "./slices/dateTimeSlice";
import categorySlice from "./slices/categorySlice";
import colorSlice from "./slices/colorSlice";
import bookingsSlice from "./slices/bookingsSlice";
import customersSlice from "./slices/customersSlice";
import stockSlice from "./slices/stockSlice";

export const store = configureStore({
  reducer: {
    userLogInfo: userSlice,
    currency: currencySlice,
    company: companySlice,
    dateTime: dateTimeSlice,
    category: categorySlice,
    color: colorSlice,
    bookings: bookingsSlice,
    customers: customersSlice,
    stock: stockSlice,
  },
});
