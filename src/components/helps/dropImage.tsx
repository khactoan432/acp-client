import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { TiDelete } from "react-icons/ti";
import { Button } from "antd";

// Định nghĩa interface

interface ImageUploaderProps {
  titleBtn?: string;
  onImagesChange?: (files: File[]) => void;
  urls?: string[];
  typefile: string;
  reset?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  titleBtn = "Chọn ảnh/video",
  onImagesChange,
  urls,
  typefile = "image/*,video/*",
  reset = false,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const uploadedImages = acceptedFiles.map((file) => file);
    setFiles((prev) => {
      const newImages = [...prev, ...uploadedImages];
      onImagesChange?.(newImages); // Callback truyền danh sách ảnh mới
      return newImages;
    });
  };
  useEffect(() => {
    if (reset) {
      setFiles([]); // Reset lại mảng files
      onImagesChange?.([]); // Callback với mảng trống
    }
  }, [reset]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: typefile
      ? typefile.split(",").reduce<Record<string, []>>((acc, mimeType) => {
          acc[mimeType.trim()] = [];
          return acc;
        }, {})
      : undefined,
    multiple: true,
  });

  return (
    <div className="w-full p-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 cursor-pointer text-center ${
          isDragActive ? "border-blue-500" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <Button>{titleBtn}</Button>
        {isDragActive ? (
          <p className="text-blue-500">Thả ảnh vào đây...</p>
        ) : (
          <p>Kéo thả ảnh vào đây, hoặc bấm để chọn ảnh</p>
        )}
      </div>

      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-4">
        {/* grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 */}
        {files.map((file, index) => (
          <div
            key={index}
            className="relative w-full h-32 overflow-hidden rounded-lg border"
          >
            {file.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="object-cover w-full h-full"
              />
            )}
            {file.type.startsWith("video/") && (
              <video
                src={URL.createObjectURL(file)}
                controls
                className="h-24 w-full object-cover rounded"
              />
            )}
            <button
              onClick={() =>
                setFiles((prev) => {
                  const newImages = prev.filter((_, i) => i !== index);
                  onImagesChange?.(newImages); // Gọi callback khi xóa ảnh
                  return newImages;
                })
              }
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <TiDelete className="text-base" />
            </button>
          </div>
        ))}
        {urls &&
          urls.map((url, index) => (
            <div
              key={index}
              className="relative w-full h-32 overflow-hidden rounded-lg border"
            >
              <img src={url} alt={url} className="object-cover w-full h-full" />
              <button
                onClick={() =>
                  setFiles((prev) => {
                    const newImages = prev.filter((_, i) => i !== index);
                    onImagesChange?.(newImages); // Gọi callback khi xóa ảnh
                    return newImages;
                  })
                }
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <TiDelete className="text-base" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ImageUploader;
