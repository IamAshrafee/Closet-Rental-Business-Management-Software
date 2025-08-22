import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import currencySlice from "./slices/currencySlice";
import companySlice from "./slices/companySlice";
import dateTimeSlice from "./slices/dateTimeSlice";
import categorySlice from "./slices/categorySlice";
import colorSlice from "./slices/colorSlice";

export const store = configureStore({
  reducer: {
    userLogInfo: userSlice,
    currency: currencySlice,
    company: companySlice,
    dateTime: dateTimeSlice,
    category: categorySlice,
    color: colorSlice,
  },
});