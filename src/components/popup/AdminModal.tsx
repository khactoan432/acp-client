import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Upload, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";

type AdminModalProps<T> = {
  isOpen: boolean;
  onClose: () => void;
  fields?: { name: string; placeholder: string }[];
  data?: any;
  enableImageUpload?: boolean;
  multiple?: boolean;
  onSave: (data: T & { files?: File[] }) => void;
  title: string;
};

const AdminModal = <T extends Record<string, any>>({
  isOpen,
  onClose,
  fields = [],
  data = {},
  enableImageUpload = false,
  multiple = false,
  onSave,
  title,
}: AdminModalProps<T>) => {
  const [formData, setFormData] = useState<Partial<T & { files?: File[] }>>(data);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Reset form data and file list when modal opens or data changes
  useEffect(() => {
    if (isOpen) {
      setFormData(data || {});
      setFileList(
        data?.default_file?.map((file: any, index: number) => ({
          uid: String(index),
          name: file.name || file.url?.split("/").pop(),
          status: "done",
          url: file.url,
        })) || []
      );
    }
  }, [isOpen, data]);

  // console.log(formData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
    setFormData((prev) => ({
      ...prev,
      files: fileList
        .map((file) => file.originFileObj)
        .filter(Boolean) as File[],
    }));
  };

  const handleSave = () => {
    onSave(formData as T & { files?: File[] });
    onClose();
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={720}
    >
      <div className="space-y-6">
        {fields.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field, id) => (
                <div className="flex flex-col gap-1" key={String(id)}>
                  <span className="text-gray-500">{field.placeholder}</span>
                  <Input
                    key={field.name as string}
                    placeholder={field.placeholder}
                    name={field.name as string}
                    value={(formData[field.name] as string) || ""}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {enableImageUpload && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Upload Files</h3>
            <Upload
              listType="picture"
              fileList={fileList}
              multiple={multiple}
              maxCount={multiple ? 5 : 1}
              beforeUpload={() => false}
              onChange={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>Add Files</Button>
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
