// routes/index.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../HOC/ProtectedRoutes'
import AdminRoutes from './AdminRoutes'
import TeacherRoutes from './TeacherRoutes'
import UserRoutes from './UserRoutes'
import Login from "../pages/login"
import NotFound from "../pages/NotFound"

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <ProtectedRoute invertCheck redirectPath="/">
            <Login />
          </ProtectedRoute>
        } />

        <Route path="/admin/*" element={
          <ProtectedRoute redirectPath="/login">
          <AdminRoutes />
        </ProtectedRoute>
        } />
        <Route path="/teacher/*" element={
          <ProtectedRoute redirectPath="/login">
          <TeacherRoutes />
        </ProtectedRoute>
        } />
        <Route path="/*" element={<UserRoutes />} />

        <Route path="/not-found" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
