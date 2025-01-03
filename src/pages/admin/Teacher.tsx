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
  fetchAdminTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../../redux/slices/teacherSlice";

interface Teacher {
  _id: string;
  image: string;
  name: string;
  email: string;
  password: string;
  repassword: string;
  codeforce_name: string;
  phone_number: string;
}

interface SaveData {
  files?: File[];
  default_file: [{ name: string; url: string }];
  name: string;
  email: string;
  password: string;
  repassword: string;
  codeforce_name: string;
  phone_number: string;
}

const PAGE_SIZE = 10;

const AdminTeacher: React.FC = () => {
  const [isModalSaveOpen, setIsModalSaveOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch<AppDispatch>();
  const { adminTeachers, totalAdmin, loading, error } = useSelector(
    (state: RootState) => state.teachers
  );

  useEffect(() => {
    dispatch(
      fetchAdminTeachers({
        role: "TEACHER",
        page: currentPage,
        limit: PAGE_SIZE,
      })
    );
  }, [dispatch, currentPage]);

  const getDataForEdit = (id: string | null): SaveData => {
    const teacher = adminTeachers.find((b) => b._id === id);
    return {
      default_file: [
        {
          name: teacher?.image.split("/").pop() || "",
          url: teacher?.image || "",
        },
      ],
      name: teacher?.name || "",
      email: teacher?.email || "",
      password: teacher?.password || "",
      repassword: teacher?.repassword || "",
      codeforce_name: teacher?.codeforce_name || "",
      phone_number: teacher?.phone_number || "",
    };
  };

  const handleSave = async (data: SaveData): Promise<void> => {
    if (!data.files || data.files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }

    if (
      !data.name ||
      !data.email ||
      !data.password ||
      !data.repassword ||
      !data.codeforce_name ||
      !data.phone_number
    ) {
      toast.error("Please fill all information.");
      return;
    }

    try {
      const formData = new FormData();
      data.files.forEach((file) => formData.append("files", file));
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("repassword", data.repassword);
      formData.append("codeforce_name", data.codeforce_name);
      formData.append("phone_number", data.phone_number);
      formData.append("role", "TEACHER");

      await dispatch(createTeacher(formData)).unwrap();
      toast.success("Upload successful!");

      setIsModalSaveOpen(false);
    } catch (error) {
      toast.error("Upload failed!");
      console.error(error);
    }
  };

  const handleUpdate = async (data: SaveData): Promise<void> => {
    if (!currentEdit) {
      toast.error("Please upload at least one file.");
      return;
    }

    try {
      const formData = new FormData();
      data.files?.forEach((file) => formData.append("files", file));
      const fields = [
        { key: "name", value: data.name },
        { key: "email", value: data.email },
        { key: "password", value: data.password },
        { key: "repassword", value: data.repassword },
        { key: "codeforce_name", value: data.codeforce_name },
        { key: "phone_number", value: data.phone_number },
      ];

      fields.forEach((field) => {
        if (field.value && String(field.value).trim() !== "") {
          formData.append(field.key, field.value);
        }
      });

      await dispatch(
        updateTeacher({ userId: currentEdit, updatedData: formData })
      ).unwrap();

      toast.success("Update successful!");
      setIsModalUpdateOpen(false);
    } catch (error) {
      toast.error("Update failed!");
      console.error(error);
    }
  };

  const handleDelete = async (userId: string): Promise<void> => {
    try {
      await dispatch(deleteTeacher(userId)).unwrap();

      toast.success("Teacher deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete teacher!");
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
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Codeforce Name",
      dataIndex: "codeforce_name",
    },
    {
      title: "Phone number",
      dataIndex: "phone_number",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: unknown, record: Teacher) => (
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
              <Button type="primary" onClick={() => setIsModalSaveOpen(true)}>
                + Add teacher
              </Button>
            </div>
          </div>

          <Table
            dataSource={adminTeachers}
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

      <AdminModal
        isOpen={isModalSaveOpen}
        multiple={false}
        onClose={() => setIsModalSaveOpen(false)}
        fields={[
          { name: "name", placeholder: "Name", label: "Name" },
          { name: "email", placeholder: "Email", label: "Email" },
          { name: "password", placeholder: "Password", label: "Password" },
          {
            name: "repassword",
            placeholder: "Re-enter Password",
            label: "Re-enter Password",
          },
          {
            name: "codeforce_name",
            placeholder: "Codeforce Name",
            label: "Codeforce Name",
          },
          { name: "phone_number", placeholder: "Phone Number", label: "Phone" },
        ]}
        enableImageUpload={true}
        onSave={handleSave}
        data={{}}
        title="Upload New Teacher"
      />

      <AdminModal
        isOpen={isModalUpdateOpen}
        multiple={false}
        onClose={() => {
          setIsModalUpdateOpen(false);
          setCurrentEdit(null);
        }}
        fields={[
          { name: "name", placeholder: "Name", label: "Name" },
          { name: "email", placeholder: "Email", label: "Email" },
          {
            name: "codeforce_name",
            placeholder: "Codeforce Name",
            label: "Codeforce Name",
          },
          {
            name: "phone_number",
            placeholder: "Phone Number",
            label: "Phone Number",
          },
        ]}
        enableImageUpload={true}
        onSave={handleUpdate}
        data={getDataForEdit(currentEdit)}
        title="Edit Teacher"
      />
    </div>
  );
};

export default AdminTeacher;
