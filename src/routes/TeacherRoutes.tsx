import { Routes, Route, Navigate } from 'react-router-dom'
// import TeacherDashboard from '../pages/teacher/Dashboard'
// import TeacherCourses from '../pages/teacher/Courses'
// import TeacherProfile from '../pages/teacher/Profile'

const TeacherRoutes = () => {
  const isTeacher = true // Kiểm tra logic thực tế.

  if (!isTeacher) {
    return <Navigate to="/login" />
  }

  return (
    <Routes>
      {/* <Route path="dashboard" element={<TeacherDashboard />} />
      <Route path="courses" element={<TeacherCourses />} />
      <Route path="profile" element={<TeacherProfile />} /> */}
      <Route path="*" element={<Navigate to="/teacher/dashboard" />} />
    </Routes>
  )
}

export default TeacherRoutes
