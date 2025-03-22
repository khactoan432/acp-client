import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";
import Button from "../../common/Button";
import Logo from "../../../assets/logoacp.jpg";
import User from "../../../assets/user3.png";
const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const path = window.location.pathname;
    const segments = path.split("/");
    const title = segments[1];
    const { user, access_token } = useSelector((state) => state.auth);
    const isLogin = !!user && !!access_token;
    const [isOpen, setIsOpen] = useState(false); // Trạng thái mở menu di động
    const [isUserOpen, setIsUserOpen] = useState(false);
    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        navigate("/login");
    };
    return (_jsxs("header", { className: "bg-white shadow-[0_4px_4px_-4px_rgba(0,0,0,0.2)] sticky top-0 z-50", children: [_jsxs("div", { className: "container max-w-[1228px] mx-auto px-4 sm:px-4 lg:px-2 flex items-center justify-between h-16", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("img", { className: "w-[50px] h-[50px]", src: Logo, alt: "alt" }), _jsxs("div", { className: "text-2xl font-bold", children: [_jsx("span", { className: "text-green-500", children: "AC" }), _jsx("span", { className: "text-yellow-400", children: "P" })] })] }), _jsx("nav", { className: "hidden md:flex space-x-6", children: [
                            { name: "Trang chủ", to: "/", title: "" },
                            { name: "Chương trình học", to: "/course", title: "course" },
                            { name: "Đề thi online", to: "/exams/all", title: "exams" },
                            { name: "Về chúng tôi", to: "/about", title: "about" },
                            { name: "Liên hệ", to: "/profile", title: "profile" },
                        ].map((item, index) => item.title === title ? (_jsx(Link, { to: item.to, className: "text-color-secondary active font-semibold link", children: item.name }, index)) : (_jsx(Link, { to: item.to, className: "text-color-secondary font-semibold link", children: item.name }, index))) }), isLogin ? (_jsxs("div", { className: "hidden md:block relative", children: [_jsx("div", { className: " w-[110px] flex justify-end", children: _jsx("button", { className: "flex items-center focus:outline-none", onClick: () => setIsUserOpen(!isUserOpen), children: _jsx("img", { src: User, alt: "User Avatar", className: "w-10 h-10 rounded-full bg-gray-200" }) }) }), isUserOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg border border-gray-200", children: [_jsxs("div", { className: "p-4 border-b border-gray-300", children: [_jsx("h3", { className: "text-gray-700", children: "Th\u00F4ng b\u00E1o" }), _jsx("p", { className: "text-color-secondary text-sm mt-1", children: "B\u1EA1n ch\u01B0a c\u00F3 th\u00F4ng b\u00E1o m\u1EDBi." }), _jsx("a", { href: "#", className: "text-blue-500 text-sm mt-1 block", children: "Xem t\u1EA5t c\u1EA3 >>" })] }), _jsxs("ul", { className: "p-4 text-gray-700", children: [_jsx("li", { className: "mb-2", children: _jsx("a", { href: "/profile", className: "hover:text-blue-500", children: "L\u1ECBch h\u1ECDc c\u1EE7a t\u00F4i" }) }), _jsx("li", { className: "mb-2", children: _jsx("a", { href: "/profile", className: "hover:text-blue-500", children: "Trang c\u00E1 nh\u00E2n" }) }), _jsx("li", { children: _jsx("button", { className: "hover:text-blue-500", onClick: handleLogout, children: "\u0110\u0103ng xu\u1EA5t" }) })] })] }))] })) : (_jsx(Button, { className: "hidden md:block h-[36px] rounded-[17px]", onClick: () => navigate("/login"), children: "\u0110\u0103ng nh\u1EADp" })), _jsx("button", { className: "md:hidden text-gray-700 focus:outline-none", onClick: () => setIsOpen(!isOpen), children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16" }) }) })] }), isOpen && (_jsx("nav", { className: "md:hidden bg-white shadow-md px-8", children: _jsxs("div", { className: "flex flex-col items-start space-y-4 pb-4", children: [[
                            { name: "Trang chủ", to: "/", title: "" },
                            { name: "Chương trình học", to: "/course", title: "course" },
                            { name: "Đề thi online", to: "/exams/all", title: "exams" },
                            { name: "Về chúng tôi", to: "/about", title: "about" },
                            { name: "Liên hệ", to: "/profile", title: "profile" },
                        ].map((item, index) => item.title === title ? (_jsx(Link, { to: item.to, className: "text-color-secondary active font-semibold link", children: item.name }, index)) : (_jsx(Link, { to: item.to, className: "text-color-secondary font-semibold link", children: item.name }, index))), isLogin ? (_jsx(Button, { onClick: handleLogout, className: "md::hidden h-[36px] w-full rounded-[17px]", children: "\u0110\u0103ng xu\u1EA5t" })) : (_jsx(Button, { onClick: () => navigate("/login"), className: "md::hidden h-[36px] w-full rounded-[17px]", children: "\u0110\u0103ng nh\u1EADp" }))] }) }))] }));
};
export default Header;
