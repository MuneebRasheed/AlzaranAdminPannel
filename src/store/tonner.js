import { createSlice } from '@reduxjs/toolkit';
import {
  get, add, del, put,
} from './tonner-actions';

const manufacturerSlice = createSlice({
  name: 'tonner',
  initialState: {
    isInitialize: false,
    tonners: [],
    status: 'idle',
    error: '',
    tSearchOptions: [],
    filteredTonners: [],
    searching: false,
  },
  reducers: {
    filter: (state, action) => {
      const name = action.payload;
      state.searching = true;
      state.filteredTonners = state.tonners.filter(
        (type) => type.tonner === name,
      );
    },
    resetSearch: (state) => {
      state.searching = false;
      state.filteredTonners = [];
    },
    addStaticTonner: (state, action) => {
      const newTonner = action.payload;
      state.tonners = [{ ...newTonner }, ...state.tonners];
      state.tSearchOptions.push({
        label: newTonner.tonner,
        value: newTonner.id,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(get.fulfilled, (state, action) => {
        const tonners = action.payload || [];
        state.tonners = tonners;
        state.tSearchOptions = tonners.map(({ id, tonner }) => ({
          label: tonner,
          value: id,
        }));
        state.status = 'succeeded';
      })
      .addCase(get.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(add.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(add.fulfilled, (state, action) => {
        const newTonner = action.payload;
        state.tonners = [{ ...newTonner }, ...state.tonners];
        state.tSearchOptions.push({
          label: newTonner.tonner,
          value: newTonner.id,
        });
        state.status = 'succeeded';
      })
      .addCase(add.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(del.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(del.fulfilled, (state, action) => {
        const id = action.payload;
        const filtered = state.tonners.filter((type) => type.id !== id);
        state.tonners = [...filtered];
        if (state.searching) {
          state.filteredTonners = [];
        }
        state.tSearchOptions = filtered.map(({ id: value, name }) => ({
          label: name,
          value,
        }));
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
        const newItems = state.tonners.map((item) => {
          if (id === item.id) return updated;
          return item;
        });
        state.tonners = newItems;
        if (state.searching) {
          state.filteredTonners = [{ ...updated }];
        }
        state.tSearchOptions = newItems.map(({ id: value, tonner }) => ({
          label: tonner,
          value,
        }));
        state.status = 'succeeded';
      })
      .addCase(put.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export actions
export const { filter, resetSearch, addStaticTonner } = manufacturerSlice.actions;

export default manufacturerSlice.reducer;
