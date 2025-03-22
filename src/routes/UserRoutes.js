import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/user/Home";
import Course from "../pages/user/Course";
import CourseDetail from "../pages/user/CourseDetail";
import Exam from "../pages/user/Exam";
import ExamDetail from "../pages/user/ExamDetail";
import About from "../pages/user/About";
import Profile from "../pages/user/Profile";
import Layout from "../components/layout/User/Layout";
import Learning from "../pages/user/Learning";
const UserRoutes = () => {
    return (_jsxs(Routes, { children: [_jsxs(Route, { element: _jsx(Layout, {}), children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/course", element: _jsx(Course, {}) }), _jsx(Route, { path: "/course/:id", element: _jsx(CourseDetail, {}) }), _jsx(Route, { path: "/exams/:category", element: _jsx(Exam, {}) }), _jsx(Route, { path: "/exam/:id", element: _jsx(ExamDetail, {}) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }), _jsx(Route, { path: "/learning/:id", element: _jsx(Learning, {}) })] }));
};
export default UserRoutes;
