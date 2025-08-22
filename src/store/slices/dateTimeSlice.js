import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'hh:mm A',
    locale: 'en-US',
  },
};

export const dateTimeSlice = createSlice({
  name: 'dateTime',
  initialState,
  reducers: {
    setDateTimeFormat: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setDateTimeFormat } = dateTimeSlice.actions;

export default dateTimeSlice.reducer;