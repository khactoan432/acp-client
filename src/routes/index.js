import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(ProtectedRoute, { invertCheck: true, redirectPath: "/", children: _jsx(Login, {}) }) }), _jsx(Route, { path: "/register", element: _jsx(ProtectedRoute, { invertCheck: true, redirectPath: "/", children: _jsx(Register, {}) }) }), _jsx(Route, { path: "/admin/*", element: _jsx(ProtectedRoute, { redirectPath: "/login", children: _jsx(AdminRoutes, {}) }) }), _jsx(Route, { path: "/teacher/*", element: _jsx(ProtectedRoute, { redirectPath: "/login", children: _jsx(TeacherRoutes, {}) }) }), _jsx(Route, { path: "/*", element: _jsx(UserRoutes, {}) }), _jsx(Route, { path: "/not-found", element: _jsx(NotFound, {}) })] }));
};
export default AppRoutes;
