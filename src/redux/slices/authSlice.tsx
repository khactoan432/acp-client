// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  role: string | null
  token: string | null
}

const initialState: AuthState = {
  role: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ role: string, token: string }>) {
      state.role = action.payload.role
      state.token = action.payload.token
    },
    logout(state) {
      state.role = null
      state.token = null
    },
  },
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer
