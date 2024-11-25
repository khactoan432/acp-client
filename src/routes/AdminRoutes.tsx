import { Routes, Route, Navigate } from 'react-router-dom'
// import AdminDashboard from '../pages/admin/Dashboard'
// import AdminUsers from '../pages/admin/Users'
// import AdminSettings from '../pages/admin/Settings'

const AdminRoutes = () => {
  // Giả sử bạn kiểm tra quyền admin tại đây (thay bằng logic thực tế)
  const isAdmin = true // Thay bằng logic kiểm tra token hoặc role.

  if (!isAdmin) {
    return <Navigate to="/login" />
  }

  return (
    <Routes>
      {/* <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="settings" element={<AdminSettings />} /> */}
      <Route path="*" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  )
}

export default AdminRoutes
