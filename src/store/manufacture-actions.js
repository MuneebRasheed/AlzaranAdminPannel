import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllManuFacturers,
  create,
  deleteManuFacturer,
  updateManuFacturer,
} from '../../services/manufactuer';

export const getManufacturers = createAsyncThunk(
  'manufacturer/getAllManufacturers',
  async () => {
    const manuFacturers = await getAllManuFacturers();
    return manuFacturers;
  },
);

export const addManufacture = createAsyncThunk(
  'manufacturer/addManufacturers',
  async (name) => {
    const manuFacturer = await create(name);
    return manuFacturer;
  },
);

export const del = createAsyncThunk(
  'manufacturer/deleteManufacturers',
  async (id) => {
    await deleteManuFacturer(id);
    return id;
  },
);

export const put = createAsyncThunk(
  'manufacturer/editManufacturers',
  async (params) => {
    const { id, data } = params;
    const updated = await updateManuFacturer(id, data);
    return { id, updated };
  },
);
