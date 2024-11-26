// src/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  username: string | null
  role: string | null
  email: string | null
  image: string | null
  phone_number: string | null
  codeforce_name: string | null
}

interface AuthState {
  user: User | null // Khởi tạo user là null khi chưa có dữ liệu
  access_token: string | null
}

const initialState: AuthState = {
  user: null,
  access_token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: User, access_token: string }>) {
      state.user = action.payload.user
      state.access_token = action.payload.access_token
    },
    logout(state) {
      state.user = null
      state.access_token = null // Sửa lại thành access_token thay vì token
    },
  },
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer
