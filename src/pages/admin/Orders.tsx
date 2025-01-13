import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AdminModal from "../../components/popup/AdminModal";
import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
import Loading from "../../components/loading";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Input, Checkbox, Pagination } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { RootState, AppDispatch } from "../../redux/store";
import {
  fetchAdminOrders,
  updateOrder,
  deleteOrder,
} from "../../redux/slices/orderSlice";

interface Order {
  _id: string;
  code: string;
  type: string;
  method: string; 
  payment_status: string;
  createdAt: string;
  materialDetails: any;
  userDetails: any;
}

interface SaveData {
  files?: File[];
  default_file: [{ name: string; url: string }];
  email_user: string;
  prize: string;
  competition: string;
}

const PAGE_SIZE = 10;

const AdminOrder: React.FC = () => {
  const [isModalSaveOpen, setIsModalSaveOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // const fields = [
  //   {
  //     name: "email_user",
  //     placeholder: "Student Email ...",
  //     label: "Student Email ...",
  //   },
  //   { name: "prize", placeholder: "Prize ...", label: "Prize ..." },
  //   {
  //     name: "competition",
  //     placeholder: "Competition ...",
  //     label: "Competition ...",
  //   },
  // ];

  const dispatch = useDispatch<AppDispatch>();
  const { adminOrders, totalAdmin, loading, error } = useSelector(
    (state: RootState) => state.orders
  );
  console.log(adminOrders);

  useEffect(() => {
    dispatch(fetchAdminOrders({ page: currentPage, limit: PAGE_SIZE }));
  }, [dispatch, currentPage]);

  // const getDataForEdit = (id: string | null): SaveData => {
  //   const order = adminOrders.find((b) => b._id === id);
  //   return {
  //     default_file: [
  //       {
  //         name: order?.image.split("/").pop() || "",
  //         url: order?.image || "",
  //       },
  //     ],
  //     email_user: order?.email_user || "",
  //     prize: order?.prize || "",
  //     competition: order?.competition || "",
  //   };
  // };

  // const handleSave = async (data: SaveData): Promise<void> => {
  //   if (!data.files || data.files.length === 0) {
  //     toast.error("Please upload at least one file.");
  //     return;
  //   }

  //   if (!data.email_user || !data.prize || !data.competition) {
  //     toast.error("Please fill all information.");
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     data.files.forEach((file) => formData.append("files", file));
  //     formData.append("email_user", data.email_user);
  //     formData.append("prize", data.prize);
  //     formData.append("competition", data.competition);

  //     await dispatch(createOrder(formData)).unwrap();
  //     toast.success("Upload successful!");

  //     setIsModalSaveOpen(false);
  //   } catch (error) {
  //     toast.error("Upload failed!");
  //     console.error(error);
  //   }
  // };

  // const handleUpdate = async (data: SaveData): Promise<void> => {
  //   if (!currentEdit) {
  //     toast.error("Please upload at least one file.");
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     data.files?.forEach((file) => formData.append("files", file));
  //     const fields = [
  //       { key: "email_user", value: data.email_user },
  //       { key: "prize", value: data.prize },
  //       { key: "competition", value: data.competition },
  //     ];

  //     fields.forEach((field) => {
  //       if (field.value && String(field.value).trim() !== "") {
  //         formData.append(field.key, field.value);
  //       }
  //     });

  //     await dispatch(
  //       updateOrder({ orderId: currentEdit, updatedData: formData })
  //     ).unwrap();
  //     toast.success("Update successful!");

  //     setIsModalUpdateOpen(false);
  //   } catch (error) {
  //     toast.error("Update failed!");
  //     console.error(error);
  //   }
  // };

  const handleDelete = async (orderId: string): Promise<void> => {
    try {
      await dispatch(deleteOrder(orderId)).unwrap();

      toast.success("Order deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete order!");
      console.error(error);
    }
  };

  const columns = [
    {
      title: <Checkbox />,
      dataIndex: "checkbox",
      render: () => <Checkbox />,
      width: 50,
    },
    // {
    //   title: "Image",
    //   dataIndex: "image",
    //   render: (src: string) => (
    //     <img
    //       src={src}
    //       alt="order"
    //       style={{ width: "100px", height: "50px", objectFit: "cover" }}
    //     />
    //   ),
    // },
    {
      title: "Order",
      dataIndex: "code",
    },
    {
      title: "User",
      dataIndex: "userEmail",
    },
    {
      title: "Product",
      dataIndex: "materialName",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Method",
      dataIndex: "method",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Status",
      dataIndex: "payment_status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: unknown, record: Order) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          {/* <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentEdit(record._id);
              setIsModalUpdateOpen(true);
            }}
          /> */}
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id)}
          />
        </div>
      ),
      width: 100,
    },
  ];

  if (loading) {
    return <Loading message="Loading data..." size="large" />;
  }

  if (error) {
    toast.error(error);
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
              <Button>Export</Button>
              <Button type="primary" onClick={() => setIsModalSaveOpen(true)} disabled={true}>
                + Add order
              </Button>
            </div>
          </div>

          <Table
            dataSource={adminOrders}
            columns={columns}
            pagination={false}
            bordered
            rowKey="_id"
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "16px",
            }}
          >
            <span>{totalAdmin} Results</span>
            <Pagination
              current={currentPage}
              total={totalAdmin}
              pageSize={PAGE_SIZE}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      {/* <AdminModal
        isOpen={isModalSaveOpen}
        multiple={false}
        onClose={() => setIsModalSaveOpen(false)}
        fields={fields}
        enableImageUpload={true}
        onSave={handleSave}
        data={{}}
        title="Upload New Order"
      /> */}

      {/* <AdminModal
        isOpen={isModalUpdateOpen}
        multiple={false}
        onClose={() => {
          setIsModalUpdateOpen(false);
          setCurrentEdit(null);
        }}
        fields={fields}
        enableImageUpload={true}
        onSave={handleUpdate}
        data={getDataForEdit(currentEdit)}
        title="Edit Order"
      /> */}
    </div>
  );
};

export default AdminOrder;
