import React from "react";
import { Input } from "antd";
import { MessageOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../../../../public/logoacp.jpg";

const AdminHeader: React.FC = () => {
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
        <div className="flex text-white  items-center space-x-2 cursor-pointer hover:text-blue-600">
          <UserOutlined className="text-xl" />
          <span className="text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
