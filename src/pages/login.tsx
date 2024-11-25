import React from 'react'
import { useDispatch } from 'react-redux'
import { setAuth } from './redux/slices/authSlice'

const Login: React.FC = () => {
  const dispatch = useDispatch()

  const handleLogin = () => {
    // Giả sử token và role được trả về từ API
    const token = 'fake-jwt-token'
    const role = 'admin'

    // Lưu vào Redux
    dispatch(setAuth({ role, token }))
  }

  return <button onClick={handleLogin}>Login</button>
}

export default Login
