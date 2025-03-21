import React, { useEffect, useState } from "react";
import { getData, deleteData } from "../../../axios"; // Import thêm deleteData
import { toast } from "react-toastify";

interface FileItem {
  name: string;
  url: string;
  type: string; // Thêm kiểu file (image, video) để xử lý hiển thị
  fileName: string; // Thêm tên file cho việc xóa
}

const ListFile: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]); // Danh sách file từ server
  const [isLoading, setIsLoading] = useState<boolean>(true); // Trạng thái tải dữ liệu

  // Hàm lấy danh sách file từ server
  const fetchFiles = async () => {
    try {
      const response = await getData("/api/upload/files",{}); // Endpoint lấy danh sách file
      setFiles(response.files);
    } catch (error) {
      toast.error("Không thể tải danh sách file!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xóa file
  const handleDeleteFile = async (fileName: string) => {
    try {
      // Gửi yêu cầu xóa file
      await deleteData("/api/upload/files/"+fileName,{});

      // Nếu xóa thành công, cập nhật lại danh sách file
      setFiles((prevFiles) => prevFiles.filter((file) => file.fileName !== fileName));

      toast.success("File đã được xóa thành công!");
    } catch (error) {
      toast.error("Không thể xóa file!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFiles(); // Gọi hàm khi component được mount
  }, []);

  return (
    <div className="max-w-[1228px] mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Danh sách file từ Google Cloud Storage</h2>

      {isLoading ? (
        <div className="text-center">Đang tải danh sách file...</div>
      ) : (
        <div>
          {files.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {files.map((file, index) => (
                <div key={index} className="border p-4 rounded shadow-md">
                  <p className="font-semibold">{file.name}</p>

                  {/* Hiển thị hình ảnh nếu là ảnh */}
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-auto mt-2 rounded"
                  />

                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline mt-2 inline-block"
                  >
                    Tải xuống
                  </a>

                  {/* Nút xóa file */}
                  <button
                    onClick={() => handleDeleteFile(file.name)}
                    className="text-red-500 mt-2 block hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có file nào trong bucket.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ListFile;
