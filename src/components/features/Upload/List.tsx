import React, { useEffect, useState } from "react";
import { postData } from "../../../axios";
import { toast } from "react-toastify";

interface File {
  name: string;
  url: string;
}

const FileList: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const fetchFiles = async () => {
    try {
      const response = await api.get("/files");
      setFiles(response.data.files);
    } catch (error) {
      toast.error("Không thể tải danh sách file!");
      console.error(error);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      await api.delete(`/files/${filename}`);
      toast.success("File đã được xóa!");
      fetchFiles(); // Refresh danh sách file
    } catch (error) {
      toast.error("Xóa file thất bại!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFiles(); // Lấy danh sách file khi component được render
  }, []);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Danh sách file</h3>
      {files.length === 0 ? (
        <p>Không có file nào!</p>
      ) : (
        <ul className="space-y-4">
          {files.map((file) => (
            <li key={file.name} className="flex justify-between items-center">
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {file.name}
              </a>
              <button
                onClick={() => handleDelete(file.name)}
                className="text-red-500 hover:text-red-700"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;
