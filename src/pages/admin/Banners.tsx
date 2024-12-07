import React, { useState } from "react";
import { Buffer } from "buffer";
// import axios
import { postData } from "../../axios";
// import components
import AdminModal from "../../components/popup/AdminModal";
import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
import Loading from "../../components/loading";
// import ant
import { Table, Button, Input, Checkbox, Pagination } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

import ExampleImageBanner from "../../assets/admin/addBanner/example.png";

const AdminBanner: React.FC = () => {
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = Array.from({ length: 10 }, (_, index) => ({
    key: index,
    image: ExampleImageBanner,
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

  const convertImageData = async (image: any) => {
    return new Promise((resolve, reject) => {
      // Kiểm tra xem image.originFileObj có phải là đối tượng File hay không
      if (!(image.originFileObj instanceof File)) {
        reject(new Error("originFileObj is not a valid File object"));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const buffer = Buffer.from(
          new Uint8Array(reader.result as ArrayBuffer)
        );
        resolve({
          fieldname: "file",
          originalname: image.name,
          encoding: "7bit", // Encoding mặc định
          mimetype: image.type,
          buffer: buffer,
          size: image.size,
        });
      };

      reader.onerror = (error) => {
        reject(error);
      };

      // Đọc file thực sự từ originFileObj (chắc chắn rằng nó là File)
      reader.readAsArrayBuffer(image.originFileObj);
    });
  };

  // Sử dụng hàm này để xử lý toàn bộ danh sách ảnh
  const processImages = async (images: any) => {
    const processedImages = await Promise.all(images.map(convertImageData));
    console.log(processedImages);
    return processedImages;
  };

  // Gọi hàm xử lý

  const handleSave = async (data: any) => {
    setIsLoading(true);
    console.log(data);
    const imagesArray = Array.isArray(data) ? data : [data];
    processImages(imagesArray).then((result) => {
      console.log("Kết quả:", result);
    });
    return;
    try {
      const header = localStorage.getItem("access_token");
      const res = await postData(
        "/api/admin/banner",
        {
          image: data,
        },
        {
          headers: {
            Authorization: `${header}`,
          },
        }
      );
      console.log("res banner: ", res);
    } catch (err) {
      console.error("Error saving banner", err);
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <Loading message="Đang tải dữ liệu..." size="large" />;
  }
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
