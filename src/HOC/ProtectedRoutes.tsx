import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

interface ProtectedRouteProps {
  children: JSX.Element
  redirectPath?: string
  invertCheck?: boolean // Nếu true, chỉ render khi chưa đăng nhập (cho Login page)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/',
  invertCheck = false,
}) => {
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.access_token)

  // Nếu người dùng đã đăng nhập và invertCheck = true (trường hợp Login page)
  const { user } = useSelector((state: any) => state.auth)
  console.log("user: ", user);
  if (!user && !isAuthenticated && !invertCheck) {
    // Lưu lại path mà người dùng muốn truy cập vào trước khi bị chuyển hướng tới login
    const currentUrl = window.location.pathname + window.location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(currentUrl)}`} replace />
  }
  if(user && user.role){
    const redirectPathCurr = localStorage.getItem('redirectHistory');
    if(redirectPathCurr){
      redirectPath =redirectPathCurr
    }
    else if(user.role === "ADMIN") {
      console.log(redirectPathCurr, "redirectPath")
      redirectPath = "/admin/dashboard"
    }else if(user.role === "TEACHER"){
      redirectPath = "/teacher/dashboard"
    }else{
      redirectPath = "/"
    }
  }
  if (invertCheck && isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  // Nếu người dùng chưa đăng nhập và invertCheck = false (trường hợp các route bảo vệ)
  if (!invertCheck && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
