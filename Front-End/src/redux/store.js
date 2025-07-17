import { configureStore } from "@reduxjs/toolkit";
import centerReducer from "./slices/centerSlice";
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    center: centerReducer,
    user: userReducer,
  },
});
