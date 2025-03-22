import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { postFile } from "../../../axios";
import { toast } from "react-toastify";
const MultiFileUpload = () => {
    const [files, setFiles] = useState([]); // Lưu danh sách file đã chọn
    const [folderPath, setFolderPath] = useState(""); // Đường dẫn folder
    const [isUploading, setIsUploading] = useState(false); // Trạng thái đang upload
    // Xử lý khi chọn nhiều file
    const handleFileChange = (event) => {
        const selectedFiles = event.target.files
            ? Array.from(event.target.files)
            : [];
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Thêm file mới vào danh sách
    };
    // Xóa một file khỏi danh sách
    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    // Gửi dữ liệu lên server
    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error("Vui lòng chọn ít nhất một file để upload!");
            return;
        }
        if (!folderPath.trim()) {
            toast.error("Vui lòng nhập đường dẫn folder!");
            return;
        }
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file)); // Thêm tất cả file vào FormData
        formData.append("folderPath", folderPath); // Thêm folderPath vào FormData
        try {
            setIsUploading(true); // Bật trạng thái upload
            console.log(formData);
            const response = await postFile("/api/upload/upload", formData);
            // Hiển thị kết quả
            toast.success("Upload thành công!");
            console.log("Uploaded Files:", response);
            // Reset danh sách file và folderPath
            setFiles([]);
            setFolderPath("");
        }
        catch (error) {
            toast.error("Upload thất bại!");
            console.error(error.message);
        }
        finally {
            setIsUploading(false); // Tắt trạng thái upload
        }
    };
    return (_jsxs("div", { className: "max-w-[1228px] mx-auto bg-white p-6 rounded-lg shadow-md", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Upload nhi\u1EC1u file (\u1EA2nh/Video)" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-2", htmlFor: "folderPath", children: "Nh\u1EADp \u0111\u01B0\u1EDDng d\u1EABn folder:" }), _jsx("input", { type: "text", id: "folderPath", value: folderPath, onChange: (e) => setFolderPath(e.target.value), placeholder: "V\u00ED d\u1EE5: uploads/my-folder", className: "block w-full border p-2 rounded" })] }), _jsx("input", { type: "file", multiple: true, accept: "image/*,video/*" // Cho phép upload ảnh và video
                , onChange: handleFileChange, className: "block w-full border p-2 rounded mb-4" }), files.length > 0 && (_jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "font-semibold", children: "Danh s\u00E1ch file \u0111\u00E3 ch\u1ECDn:" }), _jsx("ul", { className: "grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4", children: files.map((file, index) => (_jsxs("li", { className: "relative border rounded p-2", children: [file.type.startsWith("image/") && (_jsx("img", { src: URL.createObjectURL(file), alt: file.name, className: "h-24 w-full object-cover rounded" })), file.type.startsWith("video/") && (_jsx("video", { src: URL.createObjectURL(file), controls: true, className: "h-24 w-full object-cover rounded" })), _jsxs("div", { className: "mt-2 flex justify-between items-center", children: [_jsx("span", { className: "text-sm truncate", children: file.name }), _jsx("button", { onClick: () => handleRemoveFile(index), className: "text-red-500 text-sm font-bold hover:underline", children: "X\u00F3a" })] })] }, index))) })] })), _jsx("button", { onClick: handleUpload, className: `bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`, disabled: isUploading, children: isUploading ? "Đang tải lên..." : "Upload" })] }));
};
export default MultiFileUpload;
