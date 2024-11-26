// src/routes/ProtectedRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

interface ProtectedRouteProps {
  children: JSX.Element
  allowedRoles: string[] // Danh sách các role được phép truy cập
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useSelector((state: any) => state.auth)
  if (!user) {
    // Người dùng chưa đăng nhập, chuyển hướng đến login
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    // Người dùng không có quyền truy cập, chuyển hướng đến NotFound hoặc một trang lỗi khác
    return <Navigate to="/not-found" replace />
  }

  // Người dùng có quyền, render route
  return children
}

export default ProtectedRoute
