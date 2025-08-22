import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.value.push(action.payload);
    },
    removeCategory: (state, action) => {
      state.value = state.value.filter(category => category !== action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.value.findIndex(category => category === action.payload.oldCategory);
      if (index !== -1) {
        state.value[index] = action.payload.newCategory;
      }
    },
    setCategories: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { addCategory, removeCategory, updateCategory, setCategories } = categorySlice.actions;

export default categorySlice.reducer;