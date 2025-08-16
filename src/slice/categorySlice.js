import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: localStorage.getItem('categories') ? JSON.parse(localStorage.getItem('categories')) : [],
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.value.push(action.payload);
      localStorage.setItem('categories', JSON.stringify(state.value));
    },
    removeCategory: (state, action) => {
      state.value = state.value.filter(category => category !== action.payload);
      localStorage.setItem('categories', JSON.stringify(state.value));
    },
    updateCategory: (state, action) => {
      const index = state.value.findIndex(category => category === action.payload.oldCategory);
      if (index !== -1) {
        state.value[index] = action.payload.newCategory;
        localStorage.setItem('categories', JSON.stringify(state.value));
      }
    },
    setCategories: (state, action) => {
      state.value = action.payload;
      localStorage.setItem('categories', JSON.stringify(action.payload));
    },
  },
});

export const { addCategory, removeCategory, updateCategory, setCategories } = categorySlice.actions;

export default categorySlice.reducer;
