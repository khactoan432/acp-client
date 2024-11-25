import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import Courses from "../pages/admin/Courses";
import Banners from "../pages/admin/Banners";
import Achievement from "../pages/admin/Achievement";
import Teacher from "../pages/admin/Teacher";
import Orders from "../pages/admin/Orders";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/banners" element={<Banners />} />
      <Route path="/achievement" element={<Achievement />} />
      <Route path="/teachers" element={<Teacher />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;