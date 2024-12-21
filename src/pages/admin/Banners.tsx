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
  fetchAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../../redux/slices/bannerSlice";

interface Banner {
  _id: string;
  image: string;
}

interface SaveData {
  files?: File[];
  default_file: { name: string; url: string }[];
}

const PAGE_SIZE = 10;

const AdminBanner: React.FC = () => {
  const [isModalSaveOpen, setIsModalSaveOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch<AppDispatch>();
  const { adminBanners, totalAdmin, loading, error } = useSelector(
    (state: RootState) => state.banners
  );

  useEffect(() => {
    dispatch(fetchAdminBanners({ page: currentPage, limit: PAGE_SIZE }));
  }, [dispatch, currentPage]);

  const getDataForEdit = (id: string | null): SaveData => {
    const banner = adminBanners.find((b) => b._id === id);
    return {
      default_file: [
        {
          name: banner?.image.split("/").pop() || "",
          url: banner?.image || "",
        },
      ],
    };
  };

  const handleSave = async (data: SaveData): Promise<void> => {
    if (!data.files || data.files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }

    try {
      const formData = new FormData();
      data.files.forEach((file) => formData.append("files", file));
      formData.append("folderPath", "Banners");

      await dispatch(createBanner(formData)).unwrap();
      toast.success("Upload successful!");

      setIsModalSaveOpen(false);
    } catch (err) {
      toast.error("Upload failed!");
      console.error(err);
    }
  };

  const handleUpdate = async (data: SaveData): Promise<void> => {
    if (!currentEdit) {
      toast.error("Invalid banner selection.");
      return;
    }

    if (!data.files || data.files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }

    try {
      const formData = new FormData();
      data.files.forEach((file) => formData.append("files", file));

      await dispatch(updateBanner({ bannerId: currentEdit, updatedData: formData })).unwrap();
      toast.success("Update successful!");

      setIsModalUpdateOpen(false);
    } catch (err) {
      toast.error("Update failed!");
      console.error(err);
    }
  };

  const handleDelete = async (bannerId: string): Promise<void> => {
    try {
      await dispatch(deleteBanner(bannerId)).unwrap();
      toast.success("Banner deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete banner!");
      console.error(err);
    }
  };

  const columns = [
    {
      title: <Checkbox />,
      dataIndex: "checkbox",
      render: () => <Checkbox />,
      width: 50,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (src: string) => (
        <img
          src={src}
          alt={src?.split("/").pop() || ""}
          style={{ width: "100px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: unknown, record: Banner) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentEdit(record._id);
              setIsModalUpdateOpen(true);
            }}
          />
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
        <div style={{ padding: "20px", backgroundColor: "#f9f9f9", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <Input placeholder="Search..." style={{ width: "200px" }} />
              <Button>Filter</Button>
            </div>
            <Button type="primary" onClick={() => setIsModalSaveOpen(true)}>
              + Add Banner
            </Button>
          </div>

          <Table
            dataSource={adminBanners.map((banner) => ({ ...banner, key: banner._id }))}
            columns={columns}
            pagination={false}
            bordered
            rowKey="_id"
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
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

      <AdminModal
        isOpen={isModalSaveOpen}
        multiple={true}
        onClose={() => setIsModalSaveOpen(false)}
        enableImageUpload={true}
        onSave={handleSave}
        data={{}}
        title="Upload New Banner"
      />

      <AdminModal
        isOpen={isModalUpdateOpen}
        multiple={false}
        onClose={() => {
          setIsModalUpdateOpen(false);
          setCurrentEdit(null);
        }}
        enableImageUpload={true}
        onSave={handleUpdate}
        data={getDataForEdit(currentEdit)}
        title="Edit Banner"
      />
    </div>
  );
};

export default AdminBanner;
