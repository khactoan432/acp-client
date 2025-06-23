import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TeacherDashboard from "../pages/teacher/Dashboard";
import TeacherCourses from "../pages/teacher/Courses";

const TeacherRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />
      <Route path="/dashboard" element={<TeacherDashboard />} />
      <Route path="/courses" element={<TeacherCourses />} />
      <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
    </Routes>
  );
};

export default TeacherRoutes;
