import React, { useState, useRef, useEffect } from "react";
import { Input } from "antd";
import { MessageOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../../../public/logoacp.jpg";
import { logout } from "../../../redux/slices/authSlice";

const AdminHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      setIsMenuOpen(false); // Đóng menu nếu click bên ngoài
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center bg-[#070B1D] px-4 py-2 shadow-md">
      {/* Logo */}
      <div className="flex items-center w-[17.5%]">
        <img
          src={logo}
          alt="Logo"
          style={{ borderWidth: "0.5px", cursor: "pointer" }}
          className="h-10 w-auto rounded-full border-[#1e2753] mx-2"
        />
        <p style={{ color: "#00FF66", fontSize: "24px" }}>A</p>
        <p style={{ color: "#00FF66", fontSize: "24px" }}>C</p>
        <p style={{ color: "#FFDD00", fontSize: "24px" }}>P</p>
      </div>

      {/* Search */}
      <div className="flex items-center w-[55%]">
        <Input.Search
          placeholder="Search..."
          className="w-full"
          enterButton
          allowClear
        />
      </div>

      {/* Icons */}
      <div className="flex items-center justify-end w-[27.5%] space-x-6">
        {/* Tin nhắn */}
        <MessageOutlined className="text-xl text-white cursor-pointer hover:text-blue-600" />

        {/* Thông báo */}
        <BellOutlined className="text-xl text-white cursor-pointer hover:text-blue-600" />

        {/* User */}
        <div
          className="relative flex items-center space-x-2 text-white cursor-pointer hover:text-blue-600"
          onClick={toggleMenu}
          ref={menuRef}
        >
          <UserOutlined className="text-xl" />
          <span className="text-sm font-medium">Admin</span>
          {/* Dropdown Menu */}
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
    </header>
  );
};

export default AdminHeader;
