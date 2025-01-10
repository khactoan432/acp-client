import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Select } from "antd";
import { CiCirclePlus } from "react-icons/ci";

// import component
import MSInput from "../input/MsInput";
import ImageUploader from "../helps/dropImage";

const { Option } = Select;

interface ArrayValue {
  id: number;
  value: string;
}

type StructData = {
  name: string;
  placeholder?: string;
  label?: string;
  value?: any;
  type: "IMAGE" | "VIDEO" | "OPTION" | "INPUT" | "ARRAY"; // Các loại dữ liệu
};

type AdminModalProps = {
  action: "CREATE" | "UPDATE";
  isOpen: boolean;
  onClose: () => void;
  structData: StructData[];
  onSave: (data: Record<string, any>) => void;
  title: string;
};

const AdminModalV2: React.FC<AdminModalProps> = ({
  action,
  isOpen,
  onClose,
  structData,
  onSave,
  title,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [arrValue, setArrValue] = useState<ArrayValue[]>([]);

  const [uploadVideo, setUploadVideo] = useState<File[]>([]);
  const [uploadImage, setUploadImage] = useState<File[]>([]);
  const [dataEdit, setDataEdit] = useState<any>(null);

  const refValue = useRef<
    {
      focus: () => void;
      getValue: () => string;
      setValue: (value: string) => void;
      clear: () => void;
    }[]
  >([]);

  useEffect(() => {
    if (isOpen) {
      const initialData: Record<string, any> = {};
      structData.forEach((field) => {
        initialData[field.name] =
          field.type === "ARRAY" ? [] : field.value || "";
      });
      setFormData(initialData);

      if (structData) {
        setFormData((prev) => ({
          ...prev,
          ...structData,
        }));
      }
      if (action === "UPDATE") {
        const arrayFields = structData.filter((item) => item.type === "ARRAY");
        console.log("Array fields: ", arrayFields);
        arrayFields.forEach((field) => {
          console.log("Field: ", field.value);
          if (field.value && Array.isArray(field.value)) {
            const updatedArrayValues = field.value.map((val, index) => ({
              _id: val._id ? val._id : "",
              id: index + 1,
              value: val.desc,
            }));
            setArrValue(updatedArrayValues);
          }
        });
      }
    }
  }, [isOpen, structData, action]);

  const handleSelectChange = (value: any, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoUploaded = (files: File[]) => {
    setUploadVideo(files);
  };
  const handleImageUploaded = (files: File[]) => {
    setUploadImage(files);
  };
  const hanleResetUrlsVideo = () => {
    // dataEdit.video = "";
    setDataEdit((prev) => ({
      ...prev,
      video: "",
    }));
  };
  const hanleResetUrlsImage = () => {
    setDataEdit((prev) => ({
      ...prev,
      images: "",
    }));
  };

  const handleAddArrayField = () => {
    setArrValue((prev) => [...prev, { id: prev.length + 1, value: "" }]);
  };

  const handleSave = () => {
    // video
    const videoUpdate = structData.filter((item) => item.type === "VIDEO")[0];
    const imageUpdate = structData.filter((item) => item.type === "IMAGE")[0];

    if (videoUpdate) {
      formData.video =
        uploadVideo.length !== 0 ? uploadVideo : videoUpdate.value;
    }
    if (imageUpdate) {
      // image
      formData.images =
        uploadImage.length !== 0 ? uploadImage : imageUpdate?.value;
    }

    const finalData = { ...formData };

    structData.forEach((field) => {
      if (field.type === "INPUT" && refValue.current[field.name]) {
        finalData[field.name] = refValue.current[field.name].getValue();
      }
    });

    // Cập nhật giá trị cho các trường kiểu ARRAY
    const arrayFields = structData.filter((item) => item.type === "ARRAY");
    // arrayFields hiện tại chỉ có 1 phần tử
    arrayFields.forEach((field) => {
      console.log("field: ", field);
      const arrayValues = arrValue.map((item, id) => ({
        _id:
          field.value.length > 0 && field.value[id]?._id
            ? field.value[id]?._id
            : "",
        value: refValue.current[`${field.name}_${id}`]?.getValue(),
      }));
      finalData[field.name] = arrayValues;
    });

    onSave(finalData);

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
        <div>
          <div className="grid grid-cols-2 gap-4">
            {structData.map((field) => (
              <div key={field.name} className="flex flex-col gap-1">
                {field.type === "INPUT" && (
                  <>
                    <label>{field.label}</label>
                    <MSInput
                      ref={(el) => {
                        refValue.current[field.name] = el!;
                      }}
                      placeholder={field.placeholder}
                      type="text"
                      required={true}
                      defaultValue={field.value || ""}
                      errorMessage="Invalid input" // Thông báo lỗi tuỳ chỉnh
                      className="mb-2"
                    />
                  </>
                )}
                {field.type === "OPTION" && (
                  <>
                    <label>{field.label}</label>
                    <Select
                      defaultValue={formData[field.name]}
                      style={{ width: "100%" }}
                      onChange={(value) =>
                        handleSelectChange(value, field.name)
                      }
                    >
                      {field.value?.map((option: string, index: number) => (
                        <Option key={index} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Select>
                  </>
                )}
                {field.type === "ARRAY" && (
                  <>
                    <label>{field.label}</label>
                    <Button
                      icon={<CiCirclePlus />}
                      onClick={handleAddArrayField}
                    >
                      Add New
                    </Button>
                    {arrValue.map((item, id) => (
                      <MSInput
                        key={item.id}
                        ref={(el) => {
                          refValue.current[`${field.name}_${id}`] = el!;
                        }}
                        placeholder={`${field.name} ${item.id}`}
                        type="text"
                        required={true}
                        defaultValue={item.value || ""}
                        errorMessage="Invalid input"
                        className="mb-2"
                      />
                    ))}
                  </>
                )}
                {field.type === "IMAGE" && (
                  <>
                    <label>{field.label}</label>
                    <ImageUploader
                      titleBtn="Chọn hình ảnh"
                      typefile="image/*"
                      onImagesChange={handleImageUploaded}
                      urls={field?.value ? field.value : ""}
                      onUrlsReset={hanleResetUrlsImage}
                    />
                  </>
                )}
                {field.type === "VIDEO" && (
                  <>
                    <label>{field.label}</label>
                    <ImageUploader
                      titleBtn="Chọn video"
                      typefile="video/*"
                      onImagesChange={handleVideoUploaded}
                      urls={field?.value ? field.value : ""}
                      onUrlsReset={hanleResetUrlsVideo}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <Button
            className="mr-4 button-cancel"
            style={{
              backgroundColor: "white",
              color: "#1e2753",
              borderColor: "#1e2753",
            }}
            onClick={onClose}
            ghost
          >
            Huỷ
          </Button>
          <Button
            className="button-save"
            style={{
              backgroundColor: "#00095b",
              color: "white",
              borderColor: "#00095b",
            }}
            onClick={handleSave}
          >
            {action === "CREATE"
              ? "Tạo mới"
              : action === "UPDATE"
              ? "Cập nhật"
              : ""}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminModalV2;
