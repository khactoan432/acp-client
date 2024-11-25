import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/user/Home";
import Course from "../pages/user/Course";
import CourseDetail from "../pages/user/CourseDetail";
import Exam from "../pages/user/Exam";
import ExamDetail from "../pages/user/ExamDetail";
import About from "../pages/user/About";

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/course" element={<Course />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      <Route path="/exam" element={<Exam />} />
      <Route path="/exam/:id" element={<ExamDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default UserRoutes;