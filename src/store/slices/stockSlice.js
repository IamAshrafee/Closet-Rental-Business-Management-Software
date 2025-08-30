import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stockItems: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    stockLoading: (state) => {
      state.status = 'loading';
    },
    stockReceived: (state, action) => {
      state.status = 'succeeded';
      state.stockItems = action.payload;
    },
    stockError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { stockLoading, stockReceived, stockError } = stockSlice.actions;
export default stockSlice.reducer;
