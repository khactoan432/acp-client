import { Routes, Route, Navigate } from 'react-router-dom'
// import UserDashboard from '../pages/user/Dashboard'
// import UserCourses from '../pages/user/Courses'
// import UserProfile from '../pages/user/Profile'

const UserRoutes = () => {
  const isUser = true // Kiểm tra logic thực tế.

  if (!isUser) {
    return <Navigate to="/login" />
  }

  return (
    <Routes>
      {/* <Route path="dashboard" element={<UserDashboard />} />
      <Route path="courses" element={<UserCourses />} />
      <Route path="profile" element={<UserProfile />} /> */}
      <Route path="*" element={<Navigate to="/user/dashboard" />} />
    </Routes>
  )
}

export default UserRoutes
