import React, { useState, useRef, useEffect } from "react";
import { Button } from "antd";
import { MessageOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slices/authSlice";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { RootState } from "../../../redux/store";
import { toggleCollapse } from "../../../redux/slices/collapsedSlice";

const AdminHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const collapsed = useSelector(
    (state: RootState) => state.collapsed.collapsed
  );
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

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center bg-primary px-5 py-3 mx-2">
      <div className="left">
        <Button
          className="rounded-full w-[32px] flex items-center justify-center"
          onClick={handleCollapse}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>

      <div className="right">
        <div className="flex">
          <MessageOutlined className="text-xl text-color-primary cursor-pointer hover:text-blue-600 mr-2" />
          <BellOutlined className="text-xl text-color-primary cursor-pointer hover:text-blue-600 mr-2" />
          <div
            className="relative flex items-center space-x-2 text-color-primary cursor-pointer hover:text-blue-600"
            onClick={toggleMenu}
            ref={menuRef}
          >
            <UserOutlined className="text-xl" />
            <span className="text-sm font-medium">Admin</span>
            {isMenuOpen && (
              <div className="absolute top-[24px] right-0 mt-2 w-40 bg-white rounded shadow-md z-10">
                <ul className="py-2">
                  <li
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
