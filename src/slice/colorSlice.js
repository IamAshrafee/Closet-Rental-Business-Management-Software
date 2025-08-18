import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const colorSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {
    addColor: (state, action) => {
      state.value.push(action.payload);
    },
    removeColor: (state, action) => {
      state.value = state.value.filter(color => color.name !== action.payload.name);
    },
    updateColor: (state, action) => {
      const index = state.value.findIndex(color => color.name === action.payload.oldColorName);
      if (index !== -1) {
        state.value[index] = { name: action.payload.newColorName, hex: action.payload.newColorHex };
      }
    },
    setColors: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { addColor, removeColor, updateColor, setColors } = colorSlice.actions;

export default colorSlice.reducer;