// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bannerReducer from "./slices/bannerSlice";
import achievementReducer from "./slices/achievementSlice";
import teacherReducer from "./slices/teacherSlice";
import courseReducer from "./slices/courseSlice";
import examReducer from "./slices/examSlice";
import collapsedReducer from "./slices/collapsedSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    banners: bannerReducer,
    achievements: achievementReducer,
    teachers: teacherReducer,
    courses: courseReducer,
    exams: examReducer,
    collapsed: collapsedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
