import React, { useState } from "react";
// import components
import AdminModal from "../../components/popup/AdminModal";
import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
// import ant
import { Table, Button, Input, Checkbox, Pagination } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

import ExampleImageBanner from "../../assets/admin/addBanner/example.png";

const AdminBanner = () => {
  const [isModal, setIsModal] = useState(false);

  const data = Array.from({ length: 10 }, (_, index) => ({
    key: index,
    image: ExampleImageBanner,
    name: "banner học C++",
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
      title: "Name",
      dataIndex: "name",
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

  // handle click

  const handleSave = (data: any) => {
    console.log("Data saved:", data);
    // Gửi dữ liệu đến server hoặc xử lý thêm
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
              <Button type="primary" onClick={() => setIsModal(true)}>
                + Add Banner
              </Button>
              <AdminModal
                isOpen={isModal}
                onClose={() => setIsModal(false)}
                fields={[
                  { name: "Banner name", placeholder: "Banner Name ..." },
                ]}
                enableImageUpload={true}
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

export default AdminBanner;
