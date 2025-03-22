import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const ProtectedRoute = ({ children, redirectPath = "/", invertCheck = false, }) => {
    const isAuthenticated = useSelector((state) => !!state.auth.access_token);
    // Nếu người dùng đã đăng nhập và invertCheck = true (trường hợp Login page)
    const { user } = useSelector((state) => state.auth);
    if (!user && !isAuthenticated && !invertCheck) {
        // Lưu lại path mà người dùng muốn truy cập vào trước khi bị chuyển hướng tới login
        const currentUrl = window.location.pathname + window.location.search;
        return (_jsx(Navigate, { to: `/login?redirect=${encodeURIComponent(currentUrl)}`, replace: true }));
    }
    if (user && user.role) {
        const redirectPathCurr = localStorage.getItem("redirectHistory");
        if (redirectPathCurr) {
            redirectPath = redirectPathCurr;
        }
        else if (user.role === "ADMIN") {
            redirectPath = "/admin/dashboard";
        }
        else if (user.role === "TEACHER") {
            redirectPath = "/teacher/dashboard";
        }
        else {
            redirectPath = "/";
        }
    }
    if (invertCheck && isAuthenticated) {
        return _jsx(Navigate, { to: redirectPath, replace: true });
    }
    // Nếu người dùng chưa đăng nhập và invertCheck = false (trường hợp các route bảo vệ)
    if (!invertCheck && !isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return children;
};
export default ProtectedRoute;
