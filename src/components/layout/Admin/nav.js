import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UnorderedListOutlined, TagOutlined, FolderOutlined, HomeOutlined, } from "@ant-design/icons";
import logo from "../../../../public/logoacp.jpg";
import { useSelector } from "react-redux";
import { GiTeacher } from "react-icons/gi";
import { PiExamLight } from "react-icons/pi";
import { GrSchedule } from "react-icons/gr";
import { Menu } from "antd";
import { PiRankingThin } from "react-icons/pi";
import { PiShoppingBagOpenLight } from "react-icons/pi";
import { TbSettingsCode } from "react-icons/tb";
import { VscSettings } from "react-icons/vsc";
import { BiCategory } from "react-icons/bi";
import "./nav.scss";
const items = [
    { key: "1", icon: _jsx(HomeOutlined, {}), label: "Dashboard" },
    {
        key: "sub1",
        icon: _jsx(UnorderedListOutlined, {}),
        label: "Khoá học",
        children: [
            { key: "sub1_1", label: "Thông tin khoá học" },
            { key: "sub1_2", label: "Thông tin học sinh" },
        ],
    },
    { key: "2", icon: _jsx(TagOutlined, {}), label: "Banner" },
    { key: "3", icon: _jsx(FolderOutlined, {}), label: "Học sinh xuất sắc" },
    { key: "4", icon: _jsx(GiTeacher, {}), label: "Đội ngũ giảng viên" },
    { key: "5", icon: _jsx(PiExamLight, {}), label: "Đề thi" },
    { key: "6", icon: _jsx(BiCategory, {}), label: "Quản lý danh mục" },
    {
        type: "group",
        label: "Other Information",
        children: [
            { key: "7", icon: _jsx(GrSchedule, {}), label: "Lịch hẹn tư vấn" },
            { key: "8", icon: _jsx(PiRankingThin, {}), label: "Thông tin rank" },
            { key: "9", icon: _jsx(PiShoppingBagOpenLight, {}), label: "Orders" },
        ],
    },
    {
        type: "group",
        label: "Setting",
        children: [
            {
                key: "10",
                icon: _jsx(TbSettingsCode, {}),
                label: "Personal settings",
            },
            {
                key: "11",
                icon: _jsx(VscSettings, {}),
                label: "Global settings",
            },
        ],
    },
];
const Nav = () => {
    const collapsed = useSelector((state) => state.collapsed.collapsed);
    const [selectedKey, setSelectedKey] = useState("");
    const navigate = useNavigate();
    const location = useLocation(); // Lấy location hiện tại
    const routes = {
        "1": "/admin/dashboard",
        sub1_1: "/admin/courses",
        sub1_2: "/admin/courses/infor-student",
        "2": "/admin/banners",
        "3": "/admin/achievements",
        "4": "/admin/teachers",
        "5": "/admin/exams",
        "6": "/admin/categories",
        "7": "/admin/advisories",
        "8": "/admin/ranks",
        "9": "/admin/orders",
        "10": "/admin/personal-setting",
        "11": "/admin/global-setting",
    };
    useEffect(() => {
        const currentKey = Object.keys(routes).find((key) => routes[key] === location.pathname);
        if (currentKey) {
            setSelectedKey(currentKey);
        }
    }, [location.pathname]);
    const handleNavigation = (key) => {
        const route = routes[key];
        if (route) {
            navigate(route);
        }
    };
    return (_jsxs("div", { className: `nav-container bg-secondary rounded-br-lg pb-3 ${collapsed ? "collapsed" : ""}`, children: [_jsxs("div", { className: "flex items-center justify-center border-line-bottom px-5 py-2 mb-2", children: [_jsx("img", { src: logo, alt: "Logo", style: { borderWidth: "0.5px", cursor: "pointer" }, className: "h-10 w-auto rounded-full border-[#1e2753] mx-2" }), !collapsed && (_jsxs("div", { className: "flex", children: [_jsx("p", { style: { color: "#00FF66", fontSize: "24px" }, children: "A" }), _jsx("p", { style: { color: "#00FF66", fontSize: "24px" }, children: "C" }), _jsx("p", { style: { color: "#FFDD00", fontSize: "24px" }, children: "P" })] }))] }), _jsx(Menu, { selectedKeys: [selectedKey], mode: "inline", className: "bg-secondary", inlineCollapsed: collapsed, items: items, onClick: ({ key }) => handleNavigation(key) })] }));
};
export default Nav;
