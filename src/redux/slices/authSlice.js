// src/redux/slices/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    access_token: localStorage.getItem('access_token'),
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action) {
            state.user = action.payload.user;
            state.access_token = action.payload.access_token;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('access_token', action.payload.access_token);
        },
        logout(state) {
            state.user = null;
            state.access_token = null; // Sửa lại thành access_token thay vì token
        },
    },
});
export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
