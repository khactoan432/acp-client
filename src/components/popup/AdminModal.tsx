import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

type AdminModalProps = {
  isOpen: boolean;
  onClose: () => void;
  fields?: { name: string; placeholder: string }[]; // Mảng các trường thông tin
  enableImageUpload?: boolean; // Bật/tắt upload ảnh
  onSave: (data: any) => void; // Hàm callback khi lưu dữ liệu
};

type FormData = {
  [key: string]: string | any; // Các trường thông tin
  images?: any[]; // Trường images nếu có
};

const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  fields = [], // Mặc định là mảng rỗng nếu không được cung cấp
  enableImageUpload = false,
  onSave,
}) => {
  const [formData, setFormData] = useState<FormData>({});

  // Khởi tạo formData dựa trên fields và enableImageUpload

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUploadChange = (info: any) => {
    setFormData({
      ...formData,
      images: info.fileList,
    });
  };

  const handleSave = () => {
    onSave(formData); // Gửi dữ liệu ra ngoài thông qua onSave
    onClose(); // Đóng modal
  };

  return (
    <Modal
      title="Add Information"
      visible={isOpen}
      onCancel={onClose}
      footer={null}
      width={720}
    >
      <div className="flex flex-col space-y-6">
        {fields.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field) => (
                <Input
                  key={field.name}
                  placeholder={field.placeholder}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                />
              ))}
            </div>
          </div>
        )}

        {enableImageUpload && (
          <div className="border-2 border-dashed rounded-lg p-4 cursor-pointer text-center">
            <h3 className="text-lg font-semibold mb-4">Images</h3>
            <Upload
              listType="picture"
              onChange={handleUploadChange}
              multiple
              maxCount={5}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Add File</Button>
            </Upload>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminModal;
