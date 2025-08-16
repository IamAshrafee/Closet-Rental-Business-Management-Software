import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import currencySlice from "./slice/currencySlice";
import companySlice from "./slice/companySlice";
import dateTimeSlice from "./slice/dateTimeSlice";
import categorySlice from "./slice/categorySlice";

export const store = configureStore({
  reducer: {
    userLogInfo: userSlice,
    currency: currencySlice,
    company: companySlice,
    dateTime: dateTimeSlice,
    category: categorySlice,
  },
});
