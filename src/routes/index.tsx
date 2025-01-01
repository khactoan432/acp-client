// routes/index.tsx
import { useNavigate, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../HOC/ProtectedRoutes";
import AdminRoutes from "./AdminRoutes";
import TeacherRoutes from "./TeacherRoutes";
import UserRoutes from "./UserRoutes";
import Login from "../pages/login";
import Register from "../pages/register";
import NotFound from "../pages/NotFound";

import { setNavigate } from "../helpers/navigation";

import React from "react";

const AppRoutes = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ProtectedRoute invertCheck redirectPath="/">
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute invertCheck redirectPath="/">
            <Register />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute redirectPath="/login">
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute redirectPath="/login">
            <TeacherRoutes />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<UserRoutes />} />

      <Route path="/not-found" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
