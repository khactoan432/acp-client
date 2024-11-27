import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UnorderedListOutlined,
  TagOutlined,
  FolderOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
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
  { key: "4", icon: <UsergroupDeleteOutlined />, label: "Đội ngũ giảng viên" },
  {
    type: "group",
    label: "Other Information",
    children: [
      { key: "5", icon: <UsergroupDeleteOutlined />, label: "Lịch hẹn tư vấn" },
      { key: "6", icon: <UsergroupDeleteOutlined />, label: "Thông tin rank" },
      { key: "7", icon: <UsergroupDeleteOutlined />, label: "Orders" },
    ],
  },
  {
    type: "group",
    label: "Setting",
    children: [
      {
        key: "8",
        icon: <UsergroupDeleteOutlined />,
        label: "Personal settings",
      },
      { key: "9", icon: <UsergroupDeleteOutlined />, label: "Global settings" },
    ],
  },
];

const Nav: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
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
    "5": "/admin/schedules",
    "6": "/admin/ranks",
    "7": "/admin/orders",
    "8": "/admin/personal-setting",
    "9": "/admin/global-setting",
  };

  useEffect(() => {
    // Cập nhật selectedKey khi location thay đổi
    const currentKey = Object.keys(routes).find(
      (key) => routes[key] === location.pathname
    );
    if (currentKey) {
      setSelectedKey(currentKey);
    }
  }, [location.pathname]); // Chạy lại mỗi khi location thay đổi

  const handleNavigation = (key: string) => {
    const route = routes[key];
    if (route) {
      navigate(route); // Điều hướng tới route
    }
  };

  return (
    <div
      className={`nav-container ${
        collapsed ? "collapsed" : ""
      } bg-[#1e2753] rounded-br-lg pb-3`}
    >
      <Button
        className="rounded-none rounded-br-lg flex items-center justify-center"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>

      <Menu
        selectedKeys={[selectedKey]} // Chọn mục theo selectedKey
        defaultOpenKeys={["sub1"]}
        mode="inline"
        style={{
          backgroundColor: "#1e2753",
        }}
        inlineCollapsed={collapsed}
        items={items}
        onClick={({ key }) => handleNavigation(key)} // Điều hướng khi click vào menu
      />
    </div>
  );
};

export default Nav;
