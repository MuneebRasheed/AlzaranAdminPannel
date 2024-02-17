/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  AuthErrorCodes, getAuth, signInWithEmailAndPassword, updatePassword,
} from 'firebase/auth';
import toast from 'react-hot-toast';
import app from '../../firebase';

const auth = getAuth(app);

export const login = createAsyncThunk('user/login', async (params) => {
  const { username: email, password } = params;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast.success('Welcome!');
    const { accessToken } = userCredential.user;
    return { email, accessToken, password };
  } catch (err) {
    if (
      err.code === AuthErrorCodes.INVALID_PASSWORD ||
        err.code === AuthErrorCodes.USER_DELETED
    ) {
      toast.error('The email address or password is incorrect');
    } else {
      toast.error(err.code);
    }
  }
});

export const updatePasswordAction = createAsyncThunk(
  'user/updatePassword',
  async (payload, thunkAPI) => {
    try {
      const { oldPassword, newPassword } = payload;
      const user = auth.currentUser;

      const { user: userStore } = thunkAPI.getState();

      const currentUser = userStore.user;
      if (!currentUser || currentUser.password !== oldPassword) {
        throw new Error('Old password is incorrect.');
      }

      // Update the password
      await updatePassword(user, newPassword);

      toast.success('Password updated successfully.');
      return newPassword;
    } catch (err) {
      console.error('err', err);
      if (
        err.code === AuthErrorCodes.INVALID_PASSWORD ||
          err.code === AuthErrorCodes.USER_DELETED
      ) {
        toast.error('Invalid current password.');
      } else {
        toast.error('Failed to update password.');
      }
      throw err;
    }
  },
);
