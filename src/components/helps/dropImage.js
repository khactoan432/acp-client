import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { TiDelete } from "react-icons/ti";
import { Button } from "antd";
const ImageUploader = ({ titleBtn = "Chọn ảnh/video", onImagesChange, onUrlsReset, urls, filesParent, typefile = "image/*,video/*", reset = false, }) => {
    const [files, setFiles] = useState([]);
    const onDrop = (acceptedFiles) => {
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
            ? typefile.split(",").reduce((acc, mimeType) => {
                acc[mimeType.trim()] = [];
                return acc;
            }, {})
            : undefined,
        multiple: false,
    });
    return (_jsxs("div", { className: "w-full h-32 relative", children: [_jsxs("div", { className: `w-full h-full border-2 border-dashed rounded-lg p-4 text-center ${isDragActive ? "border-blue-500" : "border-gray-300"}`, children: [_jsx("input", { ...getInputProps() }), _jsx(Button, { className: "z-10 relative bg-transparent", ...getRootProps(), children: titleBtn }), isDragActive ? (_jsx("p", { className: "text-blue-500 z-10 relative", children: "Th\u1EA3 file v\u00E0o \u0111\u00E2y..." })) : (_jsx("p", { className: "z-10 relative", children: "K\u00E9o th\u1EA3 file v\u00E0o \u0111\u00E2y, ho\u1EB7c b\u1EA5m \u0111\u1EC3 ch\u1ECDn file" }))] }), _jsx("div", { className: "grid absolute top-0 w-full h-full", children: files.length > 0 ? (_jsxs("div", { className: "relative w-full h-full overflow-hidden rounded-lg border", children: [files[0].type.startsWith("image/") && (_jsx("img", { src: URL.createObjectURL(files[0]), alt: files[0].name, className: "object-cover w-full h-full" })), files[0].type.startsWith("video/") && (_jsx("video", { src: URL.createObjectURL(files[0]), controls: true, className: "h-full w-full object-cover rounded" })), _jsx("button", { onClick: () => {
                                setFiles([]); // Xóa file
                                onImagesChange?.([]); // Callback với mảng trống
                            }, className: "absolute top-1 right-1 bg-red-500 text-white rounded-full p-1", children: _jsx(TiDelete, { className: "text-base" }) })] }, "uploaded-file")) : filesParent && filesParent.length > 0 ? (_jsx("div", { className: "relative w-full h-32 overflow-hidden rounded-lg border", children: filesParent[0].type.startsWith("video/") && (_jsx("video", { src: URL.createObjectURL(filesParent[0]), controls: true, className: "h-full w-full object-cover rounded" })) }, "uploaded-file")) : (urls &&
                    urls.length > 0 && (_jsxs("div", { className: "relative w-full h-32 overflow-hidden rounded-lg border", children: [typefile === "image/*" ? (_jsx("img", { src: urls, alt: "uploaded-url", className: "object-cover w-full h-full" })) : (_jsx("video", { src: urls, controls: true, className: "object-cover w-full h-full" })), _jsx("button", { onClick: () => {
                                onUrlsReset?.(); // Reset URL
                            }, className: "absolute top-1 right-1 bg-red-500 text-white rounded-full p-1", children: _jsx(TiDelete, { className: "text-base" }) })] }, "uploaded-url"))) })] }));
};
export default ImageUploader;
