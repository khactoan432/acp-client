// routes/index.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminRoutes from './AdminRoutes'
import TeacherRoutes from './TeacherRoutes'
import UserRoutes from './UserRoutes'
import Login from "../pages/login"
import NotFound from "../pages/NotFound"

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/teacher/*" element={<TeacherRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
