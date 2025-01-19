import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
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

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Courses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course/:idCourse/introduce"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Introduce />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course/:idCourse/topics"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Topic />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course/:idCourse/topic/:idTopic/content"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Content />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/infor-student"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Courses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banners"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Banners />
          </ProtectedRoute>
        }
      />
      <Route
        path="/achievements"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Achievement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Teacher />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Exam />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/exam/:idExam/introduce"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <IntroduceExam />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/exam/:idExam/videos"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <VideoExam />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/categories"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Categories />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/advisories"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Advisories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ranks"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Ranks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/personal-setting"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <PersonalSetting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/global-setting"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <GlobalSetting />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
