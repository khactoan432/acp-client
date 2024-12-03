import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { TiDelete } from "react-icons/ti";
import { Button } from "antd";

// Định nghĩa interface
interface ImageFile {
  name: string;
  url: string;
}

interface ImageUploaderProps {
  titleBtn?: string;
  onImagesChange?: (images: ImageFile[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  titleBtn = "Chọn ảnh/video",
  onImagesChange,
}) => {
  const [images, setImages] = useState<ImageFile[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const uploadedImages = acceptedFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => {
      const newImages = [...prev, ...uploadedImages];
      onImagesChange?.(newImages);
      return newImages;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-full h-32 overflow-hidden rounded-lg border"
          >
            <img
              src={image.url}
              alt={image.name}
              className="object-cover w-full h-full"
            />
            <button
              onClick={() =>
                setImages((prev) => {
                  const newImages = prev.filter((_, i) => i !== index);
                  onImagesChange?.(newImages); // Gọi callback khi xóa ảnh
                  return newImages;
                })
              }
              className="absolute top-[0.5] right-[0.5] bg-red-500 text-white rounded-full text-xs"
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
