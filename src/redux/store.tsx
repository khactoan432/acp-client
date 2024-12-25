// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice";
import bannerReducer from './slices/bannerSlice';
import achievementReducer from './slices/achievementSlice';
import teacherReducer from './slices/teacherSlice';
import courseReducer from './slices/courseSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    banners: bannerReducer,
    achievements: achievementReducer,
    teachers: teacherReducer,
    courses: courseReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store
