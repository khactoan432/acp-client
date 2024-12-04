// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice";
import bannerReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    banners: bannerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store
