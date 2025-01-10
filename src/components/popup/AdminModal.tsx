import React, { useState, useEffect, useRef } from "react";

// import component
import ButtonPlus from "../button/plus";
import MSInput from "../input/MsInput";
import ImageUploader from "../helps/dropImage";

import { Modal, Input, Button, Upload, UploadFile, Select } from "antd";

// import icon
import { CiCirclePlus } from "react-icons/ci";
import { UploadOutlined } from "@ant-design/icons";

interface ArrayValue {
  id?: number;
  value?: string;
}

type AdminModalProps<T> = {
  isOpen: boolean;
  onClose: () => void;
  fields?: {
    name?: string;
    placeholder?: string;
    type?: string;
    value?: string[];
    label?: string;
  }[];
  data?: any;
  enableImageUpload?: boolean;
  enableVideoUpload?: boolean;
  multiple?: boolean;
  onSave: (data: T & { files?: File[] }) => void;
  title: string;
};

const { Option } = Select;
const AdminModal = <T extends Record<string, any>>({
  isOpen,
  onClose,
  fields = [],
  data = {},
  enableImageUpload = false,
  enableVideoUpload = false,
  multiple = false,
  onSave,
  title,
}: AdminModalProps<T>) => {
  const [formData, setFormData] =
    useState<
      Partial<T & { files?: File[]; type?: string; arrayValue?: ArrayValue[] }>
    >(data);

  const [uploadVideo, setUploadVideo] = useState<File[]>([]);
  const [dataEdit, setDataEdit] = useState<any>(null);

  let fieldHaveOption = fields.filter((field) => field.type === "OPTION");
  const [selectedValue, setSelectedValue] = useState(
    fieldHaveOption.length > 0 &&
      fieldHaveOption[0].value &&
      fieldHaveOption[0].value.length > 0
      ? fieldHaveOption[0].value[0]
      : "option1"
  );

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [arrValue, setArrValue] = useState<ArrayValue[]>([]);

  // ref
  const refValue = useRef<
    {
      focus: () => void;
      getValue: () => string;
      setValue: (value: string) => void;
      clear: () => void;
    }[]
  >([]);

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

  console.log(formData);

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
    if (formData.type !== "option1") {
      formData.type = selectedValue;
    }
    formData.arrayValue = refValue.current;
    formData.video =
      uploadVideo.length !== 0 ? uploadVideo : data.video ? data.video : [];
    onSave(formData as T & { files?: File[] });
    //
    onClose();
  };

  const handleSelectOption = (value: string) => {
    setSelectedValue(value);
  };

  const handleAdd = () => {
    const category = {
      id: arrValue.length + 1,
      value: "",
    };
    setArrValue((prev) => [...prev, category]);
  };

  // handle video
  // handle
  const handleVideoUploaded = (files: File[]) => {
    setUploadVideo(files);
  };
  const hanleResetUrlsVideo = () => {
    // dataEdit.video = "";
    setDataEdit((prev) => ({
      ...prev,
      video: "",
    }));
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
            <h3 className="text-lg mb-4 primary-color-text">Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field, id) => (
                <div className="flex flex-col gap-1" key={String(id)}>
                  {field.type === "OPTION" && (
                    <div className="flex flex-col">
                      <label className="primary-color-text mb-1">
                        {field.label}
                      </label>
                      <Select
                        defaultValue={
                          data && data.type ? data.type : selectedValue
                        }
                        style={{ width: 120 }}
                        onChange={handleSelectOption}
                      >
                        {field.value &&
                          field.value?.length > 0 &&
                          field.value.map((v, id) => (
                            <Option key={id} value={v}>
                              {v}
                            </Option>
                          ))}
                      </Select>
                    </div>
                  )}
                  {field.type === "ARRAY" && (
                    <div className="max-h-[420px] overflow-y-auto pr-2">
                      <ButtonPlus
                        content="Thêm mới"
                        icon={CiCirclePlus}
                        iconSize="text-[22px]"
                        textSize="text-[12px]"
                        height="h-[24px]"
                        width="w-[32%]"
                        paddingLeft="pl-6"
                        paddingRight="pr-4"
                        onClick={() => handleAdd()}
                      />
                      {arrValue &&
                        arrValue.length > 0 &&
                        arrValue.map((arr, id) => (
                          <div key={id}>
                            <MSInput
                              ref={(el) => {
                                refValue.current[id] = el!;
                              }}
                              label={`Category: ${id}`}
                              placeholder="Enter a category"
                              type="text"
                              required
                            />
                          </div>
                        ))}
                    </div>
                  )}
                  {!field.type && (
                    <div className="flex flex-col">
                      <label className="primary-color-text mb-1">
                        {field.label}
                      </label>
                      <Input
                        key={field.name as string}
                        placeholder={field.placeholder}
                        name={field.name as string}
                        value={
                          (formData[field.name ? field.name : ""] as string) ||
                          ""
                        }
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {enableImageUpload && (
          <div>
            <h3 className="text-lg mb-4">Upload Files</h3>
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
        {enableVideoUpload && (
          <div>
            <h3 className="text-lg mb-4">Upload Video</h3>
            <ImageUploader
              titleBtn="Chọn video"
              typefile="video/*"
              onImagesChange={handleVideoUploaded}
              urls={data?.video ? data.video : ""}
              onUrlsReset={hanleResetUrlsVideo}
            />
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <Button className="button-cancel" onClick={onClose}>
            Huỷ
          </Button>
          <Button type="primary" className="button-save" onClick={handleSave}>
            Tạo mới
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminModal;
