import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/user/Home";
import Course from "../pages/user/Course";
import CourseDetail from "../pages/user/CourseDetail";
import Exam from "../pages/user/Exam";
import ExamDetail from "../pages/user/ExamDetail";
import About from "../pages/user/About";
import Layout from "../components/layout/User/Layout";

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Bọc tất cả các route trong Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/course" element={<Course />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/exam/:id" element={<ExamDetail />} />
        <Route path="/about" element={<About />} />

        {/* Chuyển hướng về trang chủ nếu không khớp route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;