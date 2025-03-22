import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getData, deleteData } from "../../../axios"; // Import thêm deleteData
import { toast } from "react-toastify";
const ListFile = () => {
    const [files, setFiles] = useState([]); // Danh sách file từ server
    const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
    // Hàm lấy danh sách file từ server
    const fetchFiles = async () => {
        try {
            const response = await getData("/api/upload/files", {}); // Endpoint lấy danh sách file
            setFiles(response.files);
        }
        catch (error) {
            toast.error("Không thể tải danh sách file!");
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    };
    // Hàm xóa file
    const handleDeleteFile = async (fileName) => {
        try {
            // Gửi yêu cầu xóa file
            await deleteData("/api/upload/files/" + fileName, {});
            // Nếu xóa thành công, cập nhật lại danh sách file
            setFiles((prevFiles) => prevFiles.filter((file) => file.fileName !== fileName));
            toast.success("File đã được xóa thành công!");
        }
        catch (error) {
            toast.error("Không thể xóa file!");
            console.error(error);
        }
    };
    useEffect(() => {
        fetchFiles(); // Gọi hàm khi component được mount
    }, []);
    return (_jsxs("div", { className: "max-w-[1228px] mx-auto bg-white p-6 rounded-lg shadow-md", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Danh s\u00E1ch file t\u1EEB Google Cloud Storage" }), isLoading ? (_jsx("div", { className: "text-center", children: "\u0110ang t\u1EA3i danh s\u00E1ch file..." })) : (_jsx("div", { children: files.length > 0 ? (_jsx("div", { className: "grid grid-cols-4 gap-3", children: files.map((file, index) => (_jsxs("div", { className: "border p-4 rounded shadow-md", children: [_jsx("p", { className: "font-semibold", children: file.name }), _jsx("img", { src: file.url, alt: file.name, className: "w-full h-auto mt-2 rounded" }), _jsx("a", { href: file.url, target: "_blank", rel: "noopener noreferrer", className: "text-blue-500 hover:underline mt-2 inline-block", children: "T\u1EA3i xu\u1ED1ng" }), _jsx("button", { onClick: () => handleDeleteFile(file.name), className: "text-red-500 mt-2 block hover:underline", children: "X\u00F3a" })] }, index))) })) : (_jsx("p", { children: "Kh\u00F4ng c\u00F3 file n\u00E0o trong bucket." })) }))] }));
};
export default ListFile;
