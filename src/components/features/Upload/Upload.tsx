import React, { useState } from "react";
import { postData } from "../../../axios";
import Button from "../../common/Button";

const MultiFileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]); // Lưu danh sách file đã chọn
  const [isUploading, setIsUploading] = useState(false); // Trạng thái đang upload

  // Xử lý khi chọn nhiều file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Thêm file mới vào danh sách
  };

  // Xóa một file khỏi danh sách
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Gửi dữ liệu lên server
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Vui lòng chọn ít nhất một file để upload!");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file)); // Thêm tất cả file vào FormData

    try {
      setIsUploading(true); // Bật trạng thái upload
      const response = await postData("/api/upload/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Hiển thị kết quả
      toast.success("Upload thành công!");
      console.log("Uploaded Files:", response);

      // Reset danh sách file
      setFiles([]);
    } catch (error: any) {
      toast.error("Upload thất bại!");
      console.error(error.message);
    } finally {
      setIsUploading(false); // Tắt trạng thái upload
    }
  };

  return (
    <div className="max-w-[1228px] mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload nhiều file (Ảnh/Video)</h2>
      <input
        type="file"
        multiple
        accept="image/*,video/*" // Cho phép upload ảnh và video
        onChange={handleFileChange}
        className="block w-full border p-2 rounded mb-4"
      />

      {/* Hiển thị danh sách file đã chọn */}
      {files.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold">Danh sách file đã chọn:</p>
          <ul className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {files.map((file, index) => (
              <li key={index} className="relative border rounded p-2">
                {/* Hiển thị preview nếu là ảnh */}
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-24 w-full object-cover rounded"
                  />
                )}

                {/* Hiển thị preview nếu là video */}
                {file.type.startsWith("video/") && (
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="h-24 w-full object-cover rounded"
                  />
                )}

                {/* Hiển thị tên file và nút xóa */}
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm truncate">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 text-sm font-bold hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleUpload}
        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
          isUploading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isUploading}
      >
        {isUploading ? "Đang tải lên..." : "Upload"}
      </button>
    </div>
  );
};

export default MultiFileUpload;
