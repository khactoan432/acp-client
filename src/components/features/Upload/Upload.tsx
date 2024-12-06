import React, { useState } from "react";
import { postData } from "../../../axios";
import { toast } from "react-toastify";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Vui lòng chọn file để upload!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await postData("/api/upload/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      toast.success("Upload thành công!");
      // onUploadSuccess();
    } catch (error) {
      toast.error("Upload thất bại!");
      console.error(error);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
      >
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
