import { createSlice } from '@reduxjs/toolkit';
import { getColorTypes } from './color-type-actions';

const colorTypeSlice = createSlice({
  name: 'colorType',
  initialState: {
    isInitialize: false,
    colorTypes: [],
    status: 'idle',
    error: '',
    ctSearchOptions: [],
    filteredColorTypes: [],
    searching: false,
  },
  reducers: {
    addColorType: (state, action) => {
      const newItem = action.payload;
      state.colorTypes = [...state.colorTypes, { ...newItem }];
      state.ctSearchOptions.push({ label: newItem.name, value: newItem.id });
    },
    filterColorType: (state, action) => {
      const name = action.payload;
      state.searching = true;
      state.filteredColorTypes = state.colorTypes.filter((type) => type.name === name);
    },
    resetSearch: (state) => {
      state.searching = false;
      state.filteredColorTypes = [];
    },
    update: (state, action) => {
      const { id, updatedColorType } = action.payload;
      const newItems = state.colorTypes.map((item) => {
        if (id === item.id) return updatedColorType;
        return item;
      });
      state.colorTypes = newItems;
      if (state.searching) {
        state.filteredColorTypes = [{ ...updatedColorType }];
      }

      state.ctSearchOptions = newItems.map(({ id: value, name }) => ({ label: name, value }));
    },
    deleteType: (state, action) => {
      const id = action.payload;
      const filtered = state.colorTypes.filter((type) => type.id !== id);
      state.colorTypes = [...filtered];
      if (state.searching) {
        state.filteredColorTypes = [];
      }
      state.ctSearchOptions = filtered.map(({ id: value, name }) => ({ label: name, value }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getColorTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getColorTypes.fulfilled, (state, action) => {
        const colorTypes = action.payload || [];
        state.colorTypes = colorTypes;
        state.ctSearchOptions = colorTypes.map(({ id, name }) => ({ label: name, value: id }));
        state.status = 'succeeded';
      })
      .addCase(getColorTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export actions
export const {
  addColorType, filterColorType, resetSearch, update, deleteType,
} = colorTypeSlice.actions;

export default colorTypeSlice.reducer;
