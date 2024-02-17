import { createSlice } from '@reduxjs/toolkit';
import {
  getManufacturers, addManufacture, del, put,
} from './manufacture-actions';

const manufacturerSlice = createSlice({
  name: 'manufacturer',
  initialState: {
    isInitialize: false,
    manufacturers: [],
    status: 'idle',
    error: '',
    mtSearchOptions: [],
    filteredManufacturers: [],
    searching: false,
  },
  reducers: {
    filter: (state, action) => {
      const name = action.payload;
      state.searching = true;
      state.filteredManufacturers = state.manufacturers.filter((type) => type.name === name);
    },
    resetSearch: (state) => {
      state.searching = false;
      state.filteredManufacturers = [];
    },
    addStaticManufacturer: (state, action) => {
      const newManufacturer = action.payload;
      state.manufacturers = [newManufacturer, ...state.manufacturers];
      state.mtSearchOptions.push({ label: newManufacturer.name, value: newManufacturer.id });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getManufacturers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getManufacturers.fulfilled, (state, action) => {
        const manufacturers = action.payload || [];
        state.manufacturers = manufacturers;
        state.mtSearchOptions = manufacturers.map(({ id, name }) => ({ label: name, value: id }));
        state.status = 'succeeded';
      })
      .addCase(getManufacturers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addManufacture.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addManufacture.fulfilled, (state, action) => {
        const newManufacturer = action.payload;
        state.manufacturers = [newManufacturer, ...state.manufacturers];
        state.mtSearchOptions.push({ label: newManufacturer.name, value: newManufacturer.id });
        state.status = 'succeeded';
      })
      .addCase(addManufacture.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.error('action.error.message', action.error.message);
      })
      .addCase(del.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(del.fulfilled, (state, action) => {
        const id = action.payload;
        const filtered = state.manufacturers.filter((type) => type.id !== id);
        state.manufacturers = [...filtered];
        if (state.searching) {
          state.filteredManufacturers = [];
        }
        state.mtSearchOptions = filtered.map(({ id: value, name }) => ({ label: name, value }));
        state.status = 'succeeded';
      })
      .addCase(del.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(put.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(put.fulfilled, (state, action) => {
        const { id, updated } = action.payload;
        const newItems = state.manufacturers.map((item) => {
          if (id === item.id) return updated;
          return item;
        });
        state.manufacturers = newItems;
        if (state.searching) {
          state.filteredManufacturers = [{ ...updated }];
        }
        state.mtSearchOptions = newItems.map(({ id: value, name }) => ({ label: name, value }));
        state.status = 'succeeded';
      })
      .addCase(put.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export actions
export const {
  filter, resetSearch, addStaticManufacturer,
} = manufacturerSlice.actions;

export default manufacturerSlice.reducer;
