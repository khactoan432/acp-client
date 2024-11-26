import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import Courses from "../pages/admin/Courses";
import Banners from "../pages/admin/Banners";
import Achievement from "../pages/admin/Achievement";
import Teacher from "../pages/admin/Teacher";
import Orders from "../pages/admin/Orders";

import ProtectedRoute from './ProtectedRoutes'

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
        <Dashboard />
      </ProtectedRoute>
      } />
      <Route path="/courses" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
        <Courses />
      </ProtectedRoute>
      } />
      <Route path="/banners" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
        <Banners />
      </ProtectedRoute>
      } />
      <Route path="/achievement" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
        <Achievement />
      </ProtectedRoute>
      } />
      <Route path="/teachers" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
        <Teacher />
      </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
        <Orders />
      </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;