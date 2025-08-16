import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import currencySlice from "./slice/currencySlice";

export const store = configureStore({
  reducer: {
    userLogInfo: userSlice,
    currency: currencySlice,
  },
});