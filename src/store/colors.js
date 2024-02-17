import { createSlice } from '@reduxjs/toolkit';
import {
  addColor, getColors, deleteColor, deleteAllColor, put,
} from './colors-actions';

const colorSlice = createSlice({
  name: 'colors',
  initialState: {
    isInitialize: false,
    colors: [],
    status: 'idle',
    error: '',
    filteredColors: [],
    searching: false,
  },
  reducers: {
    filter: (state, action) => {
      const { manufacturer, colorName, colorCode } = action.payload;
      state.searching = true;
      state.filteredColors = state.colors.filter(
        (type) => {
          // Check if manufacturer matches if provided
          if (manufacturer && type.manufacturer !== manufacturer) {
            return false;
          }

          // Check if colorName matches if provided
          if (colorName && type.colorName !== colorName) {
            return false;
          }

          // Check if colorCode matches if provided
          if (colorCode && type.colorCode !== colorCode) {
            return false;
          }

          // If all conditions pass, include the item in the filtered array
          return true;
        },
      );
    },
    resetSearch: (state) => {
      state.searching = false;
      state.filteredColors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addColor.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addColor.fulfilled, (state, action) => {
        const newColor = action.payload;
        state.colors = [{ ...newColor }, ...state.colors];
        state.status = 'succeeded';
      })
      .addCase(addColor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getColors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getColors.fulfilled, (state, action) => {
        const colors = action.payload || [];
        state.colors = colors;
        state.status = 'succeeded';
        state.isInitialize = true;
      })
      .addCase(getColors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteColor.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteColor.fulfilled, (state, action) => {
        const id = action.payload;
        const filtered = state.colors.filter((type) => type.id !== id);
        state.colors = filtered;
        if (state.searching) {
          state.filteredColors = state.filteredColors.filter((type) => type.id !== id);
        }
        state.status = 'succeeded';
      })
      .addCase(deleteColor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteAllColor.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAllColor.fulfilled, (state) => {
        state.colors = [];
        state.filteredColors = [];
        state.status = 'succeeded';
      })
      .addCase(deleteAllColor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(put.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(put.fulfilled, (state, action) => {
        const { id, updated } = action.payload;
        const newItems = state.colors.map((item) => {
          if (id === item.id) return updated;
          return item;
        });
        state.colors = newItems;
        if (state.searching) {
          const newArray = state.filteredColors.map((item) => {
            if (id === item.id) return updated;
            return item;
          });
          state.filteredColors = newArray;
        }
        state.status = 'succeeded';
      })
      .addCase(put.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export actions
export const { filter, resetSearch } = colorSlice.actions;

export default colorSlice.reducer;
