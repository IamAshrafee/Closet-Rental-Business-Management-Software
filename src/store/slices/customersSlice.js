import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    customersLoading: (state) => {
      state.status = 'loading';
    },
    customersReceived: (state, action) => {
      state.status = 'succeeded';
      state.customers = action.payload;
    },
    customersError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { customersLoading, customersReceived, customersError } = customersSlice.actions;
export default customersSlice.reducer;
