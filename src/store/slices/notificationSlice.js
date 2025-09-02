import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    enabled: true, // Notifications are enabled by default
  },
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotificationSettings: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setNotificationSettings } = notificationSlice.actions;

export default notificationSlice.reducer;
