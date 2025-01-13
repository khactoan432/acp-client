// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice";
import bannerReducer from './slices/bannerSlice';
import achievementReducer from './slices/achievementSlice';
import teacherReducer from './slices/teacherSlice';
import courseReducer from './slices/courseSlice';
import examReducer from './slices/examSlice';
import orderReducer from './slices/orderSlice';
import categoryReducer from './slices/categorySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    banners: bannerReducer,
    achievements: achievementReducer,
    teachers: teacherReducer,
    courses: courseReducer,
    exams: examReducer,
    orders: orderReducer,
    categories: categoryReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store
