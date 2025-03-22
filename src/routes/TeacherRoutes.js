import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router-dom";
import TeacherDashboard from "../pages/teacher/Dashboard";
import TeacherCourses from "../pages/teacher/Courses";
const TeacherRoutes = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/teacher/dashboard", replace: true }) }), _jsx(Route, { path: "/dashboard", element: _jsx(TeacherDashboard, {}) }), _jsx(Route, { path: "/courses", element: _jsx(TeacherCourses, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/teacher/dashboard", replace: true }) })] }));
};
export default TeacherRoutes;
