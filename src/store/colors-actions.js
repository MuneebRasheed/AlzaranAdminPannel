/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import {
  create, get, del, deleteAllDocuments, updateColor,
} from '../../services/colors';

export const addColor = createAsyncThunk(
  'colors/add',
  async (values) => {
    const color = await create(values);
    return color;
  },
);

export const getColors = createAsyncThunk(
  'colors/get',
  async () => {
    const colors = await get();
    return colors;
  },
);

export const deleteColor = createAsyncThunk(
  'colors/delete',
  async (id) => {
    await del(id);
    return id;
  },
);

export const deleteAllColor = createAsyncThunk(
  'colors/allDelete',
  async (payload, thunkAPI) => {
    const toastId = toast.loading('Deleting Color');
    const { colors } = thunkAPI.getState();
    try {
      await deleteAllDocuments(colors.colors);
      toast.success('Deleted !', {
        id: toastId,
      });
    } catch (error) {
      toast.error('Failed to delete', { id: toastId });
      throw error;
    }
  },
);

export const put = createAsyncThunk(
  'colors/edit',
  async (params) => {
    const { id, data } = params;
    const updated = await updateColor(id, data);
    return { id, updated };
  },
);
