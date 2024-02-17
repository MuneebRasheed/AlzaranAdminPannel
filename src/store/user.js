import { createSlice } from '@reduxjs/toolkit';
import {
  login,
  updatePasswordAction,
} from './user-actions';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: 'idle',
    error: '',
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        const user = action.payload;
        state.user = user;
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updatePasswordAction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePasswordAction.fulfilled, (state, action) => {
        const newPassword = action.payload;
        state.user = { ...state.user, password: newPassword };
        state.status = 'succeeded';
      })
      .addCase(updatePasswordAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
