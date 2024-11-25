// routes/index.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import AdminRoutes from './AdminRoutes'
// import TeacherRoutes from './TeacherRoutes'
// import UserRoutes from './UserRoutes'
import Login from "../pages/Login"
import NotFound from "../pages/NotFound"

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
