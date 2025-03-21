import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/admin/DashBoard";
import GlobalSetting from "../pages/admin/GlobalSetting";
import PersonalSetting from "../pages/admin/PersonalSetting";
import Courses from "../pages/admin/Courses";
import Topic from "../pages/admin/course/Topic";
import Content from "../pages/admin/course/Content";
import Introduce from "../pages/admin/course/Introduce";
import Banners from "../pages/admin/Banners";
import Achievement from "../pages/admin/Achievement";
import Teacher from "../pages/admin/Teacher";
import Exam from "../pages/admin/Exam";
import Categories from "../pages/admin/categories/Categories";
import VideoExam from "../pages/admin/exam/VideoExam";
import IntroduceExam from "../pages/admin/exam/Introduce";
import Advisories from "../pages/admin/Advisories";
import Ranks from "../pages/admin/InforRank";
import Orders from "../pages/admin/Orders";
import ProtectedRoute from "./ProtectedRoutes";
const AdminRoutes = () => {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/admin/dashboard", replace: true }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/courses", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Courses, {}) }) }), _jsx(Route, { path: "/course/:idCourse/introduce", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Introduce, {}) }) }), _jsx(Route, { path: "/course/:idCourse/topics", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Topic, {}) }) }), _jsx(Route, { path: "/course/:idCourse/topic/:idTopic/content", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Content, {}) }) }), _jsx(Route, { path: "/courses/infor-student", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Courses, {}) }) }), _jsx(Route, { path: "/banners", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Banners, {}) }) }), _jsx(Route, { path: "/achievements", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Achievement, {}) }) }), _jsx(Route, { path: "/teachers", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Teacher, {}) }) }), _jsx(Route, { path: "/exams", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Exam, {}) }) }), _jsx(Route, { path: "/exam/:idExam/introduce", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(IntroduceExam, {}) }) }), _jsx(Route, { path: "/exam/:idExam/videos", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(VideoExam, {}) }) }), _jsx(Route, { path: "/categories", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Categories, {}) }) }), _jsx(Route, { path: "/advisories", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Advisories, {}) }) }), _jsx(Route, { path: "/ranks", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Ranks, {}) }) }), _jsx(Route, { path: "/orders", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(Orders, {}) }) }), _jsx(Route, { path: "/personal-setting", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(PersonalSetting, {}) }) }), _jsx(Route, { path: "/global-setting", element: _jsx(ProtectedRoute, { allowedRoles: ["ADMIN"], children: _jsx(GlobalSetting, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/admin/dashboard", replace: true }) })] }));
};
export default AdminRoutes;
