import React, { useState } from "react";

// import component
import Nav from "../../components/layout/Admin/nav";
import AdminHeader from "../../components/layout/Admin/header";
import AdminModal from "../../components/popup/AdminModal";

import { Table, Button, Input, Checkbox, Pagination } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

import ExampleImageBanner from "../../assets/admin/addBanner/example.png";

const AdminAchievement = () => {
  const [isModal, setIsModal] = useState(false);

  const data = Array.from({ length: 10 }, (_, index) => ({
    key: index,
    image: ExampleImageBanner,
    school: "Chuyên Lê quý đôn",
    province: "Hà Nội",
    achivement: "Giải nhất",
    competition: "Olympic tin học",
  }));

  const columns = [
    {
      title: <Checkbox />,
      dataIndex: "checkbox",
      render: (_: any, record: any) => <Checkbox />,
      width: 50,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (src: string) => (
        <img
          src={src}
          alt="banner"
          style={{ width: "100px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "School",
      dataIndex: "school",
    },
    {
      title: "Province",
      dataIndex: "province",
    },
    {
      title: "Achivement",
      dataIndex: "achivement",
    },
    {
      title: "Competition",
      dataIndex: "competition",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" icon={<DeleteOutlined />} danger />
        </div>
      ),
      width: 100,
    },
  ];

  const handleSave = (data: any) => {
    console.log("Data saved:", data);
    // Gửi dữ liệu đến server & xử lý thêm
  };
  return (
    <div className="flex flex-col h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <Nav />
        {/* content */}
        <div
          style={{ padding: "20px", backgroundColor: "#f9f9f9", width: "100%" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <Input placeholder="Search..." style={{ width: "200px" }} />
              <Button>Filter</Button>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button>Export</Button>
              <Button type="primary" onClick={() => setIsModal(true)}>
                + Add student
              </Button>
              <AdminModal
                isOpen={isModal}
                onClose={() => setIsModal(false)}
                fields={[
                  { name: "studentName", placeholder: "Student Name ..." },
                  { name: "class", placeholder: "Class ..." },
                  { name: "school", placeholder: "School ..." },
                  { name: "province", placeholder: "Province ..." },
                  { name: "achievement", placeholder: "Achievement ..." },
                  { name: "competition", placeholder: "Competition ..." },
                ]}
                enableImageUpload={true} // Bật upload ảnh
                onSave={handleSave}
              />
            </div>
          </div>

          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            bordered
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "16px",
            }}
          >
            <span>150 Results</span>
            <Pagination defaultCurrent={2} total={150} pageSize={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAchievement;
