import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useSelector((state) => state.auth);
    if (!user) {
        // Người dùng chưa đăng nhập, chuyển hướng đến login
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (!allowedRoles.includes(user.role)) {
        // Người dùng không có quyền truy cập, chuyển hướng đến NotFound hoặc một trang lỗi khác
        return _jsx(Navigate, { to: "/not-found", replace: true });
    }
    // Người dùng có quyền, render route
    return children;
};
export default ProtectedRoute;
