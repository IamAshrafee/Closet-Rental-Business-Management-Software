import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: localStorage.getItem("userLoginInfo")
    ? JSON.parse(localStorage.getItem("userLoginInfo"))
    : null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogInfo: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { userLogInfo } = userSlice.actions;

export default userSlice.reducer;
