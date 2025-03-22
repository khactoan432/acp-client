import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import { MessageOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slices/authSlice";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { toggleCollapse } from "../../../redux/slices/collapsedSlice";
const AdminHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const collapsed = useSelector((state) => state.collapsed.collapsed);
    const dispatch = useDispatch();
    const handleCollapse = () => {
        dispatch(toggleCollapse()); // Thay đổi trạng thái collapse qua Redux
    };
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };
    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        navigate("/login");
    };
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (_jsxs("header", { className: "flex justify-between items-center bg-primary px-5 py-3 mx-2", children: [_jsx("div", { className: "left", children: _jsx(Button, { className: "rounded-full w-[32px] flex items-center justify-center", onClick: handleCollapse, children: collapsed ? _jsx(MenuUnfoldOutlined, {}) : _jsx(MenuFoldOutlined, {}) }) }), _jsx("div", { className: "right", children: _jsxs("div", { className: "flex", children: [_jsx(MessageOutlined, { className: "text-xl text-color-primary cursor-pointer hover:text-blue-600 mr-2" }), _jsx(BellOutlined, { className: "text-xl text-color-primary cursor-pointer hover:text-blue-600 mr-2" }), _jsxs("div", { className: "relative flex items-center space-x-2 text-color-primary cursor-pointer hover:text-blue-600", onClick: toggleMenu, ref: menuRef, children: [_jsx(UserOutlined, { className: "text-xl" }), _jsx("span", { className: "text-sm font-medium", children: "Admin" }), isMenuOpen && (_jsx("div", { className: "absolute top-[24px] right-0 mt-2 w-40 bg-white rounded shadow-md z-10", children: _jsx("ul", { className: "py-2", children: _jsx("li", { className: "px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer", onClick: handleLogout, children: "\u0110\u0103ng xu\u1EA5t" }) }) }))] })] }) })] }));
};
export default AdminHeader;
