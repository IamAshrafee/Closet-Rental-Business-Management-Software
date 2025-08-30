import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    bookingsLoading: (state) => {
      state.status = 'loading';
    },
    bookingsReceived: (state, action) => {
      state.status = 'succeeded';
      state.bookings = action.payload;
    },
    bookingsError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { bookingsLoading, bookingsReceived, bookingsError } = bookingsSlice.actions;
export default bookingsSlice.reducer;
