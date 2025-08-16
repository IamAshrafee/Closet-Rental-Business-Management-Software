import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: localStorage.getItem('colors') ? JSON.parse(localStorage.getItem('colors')) : [],
};

export const colorSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {
    addColor: (state, action) => {
      state.value.push(action.payload);
      localStorage.setItem('colors', JSON.stringify(state.value));
    },
    removeColor: (state, action) => {
      state.value = state.value.filter(color => color.name !== action.payload.name);
      localStorage.setItem('colors', JSON.stringify(state.value));
    },
    updateColor: (state, action) => {
      const index = state.value.findIndex(color => color.name === action.payload.oldColorName);
      if (index !== -1) {
        state.value[index] = { name: action.payload.newColorName, hex: action.payload.newColorHex };
        localStorage.setItem('colors', JSON.stringify(state.value));
      }
    },
    setColors: (state, action) => {
      state.value = action.payload;
      localStorage.setItem('colors', JSON.stringify(action.payload));
    },
  },
});

export const { addColor, removeColor, updateColor, setColors } = colorSlice.actions;

export default colorSlice.reducer;
