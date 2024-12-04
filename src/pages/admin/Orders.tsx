import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";

import { Table, Button, Input, Checkbox, Pagination } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

import ExampleImageBanner from "../../assets/admin/addBanner/example.png";

const AdminOrder = () => {
  const data = Array.from({ length: 10 }, (_, index) => ({
    key: index,
    order: "#12345B",
    date: "12/11/2024 4:13:45 PM",
    customer: "Nguyễn Văn A",
    product: "Khoá học c#",
    paymentStatus: "Paid",
    orderStatus: "Ready",
    total: "$120",
  }));

  const columns = [
    {
      title: <Checkbox />,
      dataIndex: "checkbox",
      render: (_: any, record: any) => <Checkbox />,
      width: 50,
    },
    {
      title: "Order",
      dataIndex: "order",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Customer",
      dataIndex: "customer",
    },
    {
      title: "Product",
      dataIndex: "product",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
    },
    {
      title: "Total",
      dataIndex: "total",
    },
  ];

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
              <Button type="primary">Export</Button>
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

export default AdminOrder;
