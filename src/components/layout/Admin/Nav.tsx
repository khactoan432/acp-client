import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UnorderedListOutlined,
  TagOutlined,
  FolderOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import logo from "../../../../public/logoacp.jpg";

import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

import { GiTeacher } from "react-icons/gi";
import { PiExamLight } from "react-icons/pi";
import { GrSchedule } from "react-icons/gr";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { PiRankingThin } from "react-icons/pi";
import { PiShoppingBagOpenLight } from "react-icons/pi";
import { TbSettingsCode } from "react-icons/tb";
import { VscSettings } from "react-icons/vsc";
import { BiCategory } from "react-icons/bi";
import "./nav.scss";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  { key: "1", icon: <HomeOutlined />, label: "Dashboard" },
  {
    key: "sub1",
    icon: <UnorderedListOutlined />,
    label: "Khoá học",
    children: [
      { key: "sub1_1", label: "Thông tin khoá học" },
      { key: "sub1_2", label: "Thông tin học sinh" },
    ],
  },
  { key: "2", icon: <TagOutlined />, label: "Banner" },
  { key: "3", icon: <FolderOutlined />, label: "Học sinh xuất sắc" },
  { key: "4", icon: <GiTeacher />, label: "Đội ngũ giảng viên" },
  { key: "5", icon: <PiExamLight />, label: "Đề thi" },
  { key: "6", icon: <BiCategory />, label: "Quản lý danh mục" },
  {
    type: "group",
    label: "Other Information",
    children: [
      { key: "7", icon: <GrSchedule />, label: "Lịch hẹn tư vấn" },
      { key: "8", icon: <PiRankingThin />, label: "Thông tin rank" },
      { key: "9", icon: <PiShoppingBagOpenLight />, label: "Orders" },
    ],
  },
  {
    type: "group",
    label: "Setting",
    children: [
      {
        key: "10",
        icon: <TbSettingsCode />,
        label: "Personal settings",
      },
      {
        key: "11",
        icon: <VscSettings />,
        label: "Global settings",
      },
    ],
  },
];

const Nav: React.FC = () => {
  const collapsed = useSelector(
    (state: RootState) => state.collapsed.collapsed
  );

  const [selectedKey, setSelectedKey] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation(); // Lấy location hiện tại

  const routes: Record<string, string> = {
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
    const currentKey = Object.keys(routes).find(
      (key) => routes[key] === location.pathname
    );
    if (currentKey) {
      setSelectedKey(currentKey);
    }
  }, [location.pathname]);

  const handleNavigation = (key: string) => {
    const route = routes[key];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div
      className={`nav-container bg-secondary rounded-br-lg pb-3 ${
        collapsed ? "collapsed" : ""
      }`}
    >
      <div className="flex items-center justify-center border-line-bottom px-5 py-2 mb-2">
        <img
          src={logo}
          alt="Logo"
          style={{ borderWidth: "0.5px", cursor: "pointer" }}
          className="h-10 w-auto rounded-full border-[#1e2753] mx-2"
        />
        {!collapsed && (
          <div className="flex">
            <p style={{ color: "#00FF66", fontSize: "24px" }}>A</p>
            <p style={{ color: "#00FF66", fontSize: "24px" }}>C</p>
            <p style={{ color: "#FFDD00", fontSize: "24px" }}>P</p>
          </div>
        )}
      </div>
      <Menu
        selectedKeys={[selectedKey]}
        mode="inline"
        className="bg-secondary"
        inlineCollapsed={collapsed}
        items={items}
        onClick={({ key }) => handleNavigation(key)}
      />
    </div>
  );
};

export default Nav;
