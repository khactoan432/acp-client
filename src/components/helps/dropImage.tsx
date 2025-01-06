import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { TiDelete } from "react-icons/ti";
import { Button } from "antd";

interface ImageUploaderProps {
  titleBtn?: string;
  onImagesChange?: (files: File[]) => void;
  onUrlsReset?: () => void; // Callback để reset URL
  urls?: string; // URL của ảnh hoặc video
  filesParent?: File[];
  typefile: string;
  reset?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  titleBtn = "Chọn ảnh/video",
  onImagesChange,
  onUrlsReset,
  urls,
  filesParent,
  typefile = "image/*,video/*",
  reset = false,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    setFiles([uploadedFile]);
    onImagesChange?.([uploadedFile]);
    if (urls) {
      onUrlsReset?.();
    }
  };

  useEffect(() => {
    if (reset) {
      setFiles([]); // Reset files
      onImagesChange?.([]); // Callback với mảng trống
      if (urls) {
        onUrlsReset?.(); // Reset URL nếu cần
      }
    }
  }, [reset, onImagesChange, onUrlsReset, urls]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: typefile
      ? typefile.split(",").reduce<Record<string, []>>((acc, mimeType) => {
          acc[mimeType.trim()] = [];
          return acc;
        }, {})
      : undefined,
    multiple: false,
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
          <p className="text-blue-500">Thả file vào đây...</p>
        ) : (
          <p>Kéo thả file vào đây, hoặc bấm để chọn file</p>
        )}
      </div>

      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-4">
        {/* Hiển thị file đã chọn */}
        {files.length > 0 ? (
          <div
            key="uploaded-file"
            className="relative w-full h-32 overflow-hidden rounded-lg border"
          >
            {files[0].type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(files[0])}
                alt={files[0].name}
                className="object-cover w-full h-full"
              />
            )}
            {files[0].type.startsWith("video/") && (
              <video
                src={URL.createObjectURL(files[0])}
                controls
                className="h-full w-full object-cover rounded"
              />
            )}
            <button
              onClick={() => {
                setFiles([]); // Xóa file
                onImagesChange?.([]); // Callback với mảng trống
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <TiDelete className="text-base" />
            </button>
          </div>
        ) : filesParent && filesParent.length > 0 ? (
          <div
            key="uploaded-file"
            className="relative w-full h-32 overflow-hidden rounded-lg border"
          >
            {filesParent[0].type.startsWith("video/") && (
              <video
                src={URL.createObjectURL(filesParent[0])}
                controls
                className="h-full w-full object-cover rounded"
              />
            )}
          </div>
        ) : urls && urls.length > 0 ? (
          <div
            key="uploaded-url"
            className="relative w-full h-32 overflow-hidden rounded-lg border"
          >
            {typefile === "image/*" ? (
              <img
                src={urls}
                alt="uploaded-url"
                className="object-cover w-full h-full"
              />
            ) : (
              <video
                src={urls}
                controls
                className="object-cover w-full h-full"
              />
            )}
            <button
              onClick={() => {
                onUrlsReset?.(); // Reset URL
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <TiDelete className="text-base" />
            </button>
          </div>
        ) : (
          <div>Chưa có ảnh/video</div>
        )}

        {/* Hiển thị URL nếu có */}
      </div>
    </div>
  );
};

export default ImageUploader;
