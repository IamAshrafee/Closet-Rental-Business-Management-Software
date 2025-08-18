import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: 'Rentiva - Rental',
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanyName: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setCompanyName } = companySlice.actions;

export default companySlice.reducer;