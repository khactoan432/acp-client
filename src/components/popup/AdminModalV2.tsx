import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Select } from "antd";
import { toast } from "react-toastify";

// imprort react icon
import { CiCirclePlus } from "react-icons/ci";

// import component
import MSInput from "../input/MsInput";
import ImageUploader from "../helps/dropImage";
// import validation
import validateInput from "../../HOC/validateInput";
import ValidateFiles from "../../HOC/validateFiles";

const { Option } = Select;

interface ArrayValue {
  id: number;
  value: string;
}

type StructData = {
  name: string;
  placeholder?: string;
  label?: string;
  options?: { option: string; value?: string[] }[];
  value?: any;
  type: "IMAGE" | "VIDEO" | "OPTION" | "INPUT" | "ARRAY"; // Các loại dữ liệu
  typeText?: "text" | "email" | "number" | "tel";
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
        const keyName = `old_${field.name}`;
        initialData[keyName] = field.type === "ARRAY" ? [] : field.value || "";
      });
      setFormData(initialData);
      if (structData) {
        setFormData((prev) => {
          const updatedData: Record<string, any> = {};
          structData.forEach((field) => {
            const keyName = `old_${field.name}`;
            updatedData[keyName] = field;
          });
          return { ...prev, ...updatedData };
        });
      }
      if (action === "UPDATE") {
        const arrayFields = structData.filter((item) => item.type === "ARRAY");
        arrayFields.forEach((field) => {
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
  const handleVideoUploaded = (files: File[]) => {
    setUploadVideo(files);
  };
  const handleImageUploaded = (files: File[]) => {
    setUploadImage(files);
  };

  const handleAddArrayField = () => {
    setArrValue((prev) => [...prev, { id: prev.length + 1, value: "" }]);
  };
  const [currentOption, setCurrentOption] = useState<string | null>(null);

  const [selectedContent, setSelectedContent] = useState([]);
  const [selectedItemsByOption, setSelectedItemsByOption] = useState<
    Record<string, any[]>
  >(structData.filter((item) => item.name === "type")[0]?.value || {});

  const handleSelectCategoryType = (value: string, option: any) => {
    setCurrentOption(value);
    setSelectedContent(option.content);

    if (!selectedItemsByOption[value]) {
      setSelectedItemsByOption((prev) => ({ ...prev, [value]: [] }));
    }
  };
  //--_-- Khi checkbox thay đổi
  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    setSelectedItemsByOption((prev) => {
      const currentItems = prev[currentOption!] || [];
      const updatedItems = checked
        ? [...currentItems, value]
        : currentItems.filter((item) => item !== value);

      return { ...prev, [currentOption!]: updatedItems };
    });
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
      formData.image =
        uploadImage.length !== 0 ? uploadImage : imageUpdate?.value;
    }

    const isType = structData.filter((item) => item.name === "type")[0];
    if (isType) {
      const allSelectedOption = Object.entries(selectedItemsByOption).map(
        ([type, value]) => ({
          type,
          value,
        })
      );
      if (allSelectedOption.length > 0) {
        formData.type = allSelectedOption;
      } else {
        const defaultOption = [
          {
            type:
              structData.filter((item) => item.name === "type")[0]?.value || "",
            value: [],
          },
        ];
        formData.type = defaultOption;
      }
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
      const arrayValues = arrValue.map((item, id) => ({
        _id:
          field.value.length > 0 && field.value[id]?._id
            ? field.value[id]?._id
            : "",
        value: refValue.current[`${field.name}_${id}`]?.getValue(),
      }));
      finalData[field.name] = arrayValues;
    });

    const validateForm = Object.keys(finalData)
      .filter((item) => !item.startsWith("old_"))
      .reduce((acc, key) => {
        acc[key] = finalData[key];
        return acc;
      }, {} as Record<string, any>);

    if (validateForm.image && typeof validateForm.image !== "string") {
      if (!ValidateFiles([validateForm.image])) {
        toast.warning("Hình ảnh là bắt buộc!");
        return;
      }
    } else if (validateForm.video && typeof validateForm.video !== "string") {
      if (!ValidateFiles([validateForm.video])) {
        toast.warning("Video là bắt buộc!");
        return;
      }
    } else {
      Object.keys(validateForm).forEach((key) => {
        const value = validateForm[key];
        if (typeof value === "string") {
          if (!validateInput({ [key]: value })) {
            return;
          }
        }
      });
    }

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
        <div className="max-h-[560px] overflow-y-auto">
          <div className="pr-1">
            <div className="grid grid-cols-2 gap-4">
              {structData.map((field, idex) => (
                <div key={idex} className="flex flex-col gap-1">
                  {field.type === "INPUT" && (
                    <>
                      <label>{field.label}</label>
                      <MSInput
                        ref={(el) => {
                          refValue.current[field.name] = el!;
                        }}
                        placeholder={field.placeholder}
                        type={field.typeText || "text"}
                        required={true}
                        defaultValue={field.value || ""}
                        errorMessage="Invalid input"
                        className="mb-2"
                      />
                    </>
                  )}
                  {field.type === "OPTION" && (
                    <>
                      <label>{field.label}</label>
                      <Select
                        defaultValue={
                          typeof field.value === "string" ? field.value : "Chọn"
                        }
                        style={{ width: "100%" }}
                        onChange={handleSelectCategoryType}
                      >
                        {field.options?.map((option, index) => (
                          <Option
                            key={index}
                            value={option.option}
                            content={option.value}
                          >
                            {option.option}
                          </Option>
                        ))}
                      </Select>
                      <div className="w-full h-[340px] max-h-[340px]  h-full overflow-y-auto pb-2">
                        {selectedContent &&
                          selectedContent.length > 0 &&
                          selectedContent.map((content, idex1) => (
                            <div
                              key={idex1}
                              className="flex items-center ml-1 mb-1"
                            >
                              <label>
                                <input
                                  type="checkbox"
                                  value={content.value}
                                  onChange={handleCheckbox}
                                  checked={
                                    selectedItemsByOption[
                                      currentOption!
                                    ]?.includes(content.value) || false
                                  }
                                  style={{
                                    transform: "scale(1.5)",
                                    marginRight: "8px",
                                  }}
                                />
                                {content.value}
                              </label>
                            </div>
                          ))}
                      </div>
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
                          type={field.typeText || "text"}
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
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
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
