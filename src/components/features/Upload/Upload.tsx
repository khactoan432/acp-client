import React, { useState } from 'react';
import { postData } from '../../../axios';
import Button from '../../common/Button';

const UploadMultipleFilesFromBody: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ fileName: string; url: string }[] | null>(
    null
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files)); // Lưu danh sách file
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select files to upload.');
      return;
    }

    try {
      // Chuyển đổi mỗi file sang Base64
      const filesData = await Promise.all(
        files.map(async (file) => {
          const fileData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file); // Đọc file dưới dạng Base64
          });

          return {
            fileName: file.name, // Tên file
            fileData: fileData.split(',')[1], // Loại bỏ prefix 'data:<mime-type>;base64,'
          };
        })
      );

      console.log(filesData);

      // Gửi danh sách file qua API
      const response = await postData('/api/file/upload', {
        files: filesData,
      });

      console.log(response);

      setUploadedFiles(response.files);
      alert('Files uploaded successfully!');
    } catch (error) {
      console.error(error);
      alert('File upload failed.');
    }
  };

  return (
    <div>
      <h1>Upload Multiple Files from Body</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <Button onClick={handleUpload}>Upload</Button>

      {uploadedFiles && (
        <div>
          <h2>Uploaded Files:</h2>
          <ul>
            {uploadedFiles.map((file) => (
              <li key={file.fileName}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.fileName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadMultipleFilesFromBody;
