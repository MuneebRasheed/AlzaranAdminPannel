import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllTonner,
  create,
  deleteTonner,
  updateTonner,
} from '../../services/tonner';

export const get = createAsyncThunk(
  'tonners/get',
  async () => {
    const tonners = await getAllTonner();
    return tonners;
  },
);

export const add = createAsyncThunk(
  'tonners/add',
  async (values) => {
    const manuFacturer = await create(values);
    return manuFacturer;
  },
);

export const del = createAsyncThunk(
  'tonners/delete',
  async (id) => {
    await deleteTonner(id);
    return id;
  },
);

export const put = createAsyncThunk(
  'tonners/edit',
  async (params) => {
    const { id, data } = params;
    const updated = await updateTonner(id, data);
    return { id, updated };
  },
);
