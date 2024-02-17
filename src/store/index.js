import { configureStore } from '@reduxjs/toolkit';
import colorType from './color-type';
import manufacture from './manufacture';
import tonner from './tonner';
import colors from './colors';
import user from './user';

const store = configureStore({
  reducer: {
    colorType,
    manufacture,
    tonner,
    colors,
    user,
  },
});
export default store;
