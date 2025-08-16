import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: localStorage.getItem('companyName') ? JSON.parse(localStorage.getItem('companyName')) : 'Rentiva - Rental',
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanyName: (state, action) => {
      state.value = action.payload;
      localStorage.setItem('companyName', JSON.stringify(action.payload));
    },
  },
});

export const { setCompanyName } = companySlice.actions;

export default companySlice.reducer;
