/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllColorTypes } from '../../services/color-types';

export const getColorTypes = createAsyncThunk('color-type/getAllColorTypes', async () => {
  const colorTypes = await getAllColorTypes();
  return colorTypes;
});
