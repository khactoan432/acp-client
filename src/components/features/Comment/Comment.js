import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import User from "../../../assets/user3.png";
import { IoImages } from "react-icons/io5";
const CommentPage = () => {
    const [comments, setComments] = useState([
        {
            id: 1,
            name: "Trần Văn Khoa",
            avatar: User,
            text: "Khóa học rất bổ ích, em đã học được rất nhiều từ khóa học này, nhờ có khóa học em đã lấy lại được kiến thức cũng như cách tư duy logic để giải quyết bài toán, cảm ơn khóa học rất nhiều.",
            date: "22 ngày trước",
            images: [],
        },
        {
            id: 2,
            name: "Nguyễn Thị Hạnh",
            avatar: User,
            text: "Cảm ơn khóa học đã mang lại kiến thức giá trị. Giảng viên rất nhiệt tình và dễ hiểu.",
            date: "20 ngày trước",
            images: [],
        },
        {
            id: 3,
            name: "Lê Hoàng Nam",
            avatar: User,
            text: "Những bài tập thực hành rất sát thực tế, giúp em cải thiện kỹ năng rất nhiều.",
            date: "18 ngày trước",
            images: [],
        },
    ]);
    const [newComment, setNewComment] = useState("");
    const [newImages, setNewImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const handleAddComment = () => {
        if (!newComment.trim()) {
            alert("Vui lòng nhập nội dung bình luận!");
            return;
        }
        const newCommentData = {
            id: comments.length + 1,
            name: "Người dùng mới", // Placeholder cho tên người dùng
            avatar: User, // Placeholder cho ảnh đại diện
            text: newComment,
            date: "Vừa xong",
            images: previewImages, // Lưu danh sách URL xem trước của các ảnh
        };
        setComments([newCommentData, ...comments]);
        setNewComment("");
        setNewImages([]);
        setPreviewImages([]);
    };
    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setNewImages([...newImages, ...newFiles]);
            // Tạo URL xem trước cho các ảnh
            const newPreviewImages = newFiles.map((file) => URL.createObjectURL(file));
            setPreviewImages([...previewImages, ...newPreviewImages]);
        }
    };
    const handleRemoveImage = (index) => {
        const updatedImages = [...newImages];
        const updatedPreviewImages = [...previewImages];
        updatedImages.splice(index, 1);
        updatedPreviewImages.splice(index, 1);
        setNewImages(updatedImages);
        setPreviewImages(updatedPreviewImages);
    };
    const handleLoadMore = () => {
        // Giả lập tải thêm bình luận
        const moreComments = [
            {
                id: comments.length + 1,
                name: "Người dùng khác",
                avatar: User,
                text: "Đây là bình luận khác đã được tải thêm.",
                date: "30 ngày trước",
            },
        ];
        setComments([...comments, ...moreComments]);
    };
    return (_jsxs("div", { className: "max-w-[1228px] mx-auto", children: [_jsxs("div", { className: "relative bg-white p-4 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)] mb-6", children: [_jsx("textarea", { value: newComment, onChange: (e) => setNewComment(e.target.value), placeholder: "M\u1EDDi b\u1EA1n \u0111\u1EC3 l\u1EA1i b\u00ECnh lu\u1EADn", className: "w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", rows: 4 }), _jsxs("div", { className: "absolute right-6 top-6", children: [_jsxs("label", { htmlFor: "image-upload", className: "flex items-center gap-3 w-fit cursor-pointer", children: [_jsx(IoImages, { className: "w-[25px] h-[25px] hover:text-blue-500" }), " "] }), _jsx("input", { type: "file", id: "image-upload", accept: "image/*", multiple: true, className: "hidden" // Ẩn input file
                                , onChange: handleImageUpload })] }), previewImages.length > 0 && (_jsx("div", { className: "mt-4", children: _jsx("div", { className: "flex flex-wrap gap-4", children: previewImages.map((image, index) => (_jsxs("div", { className: "relative", children: [_jsx("img", { src: image, alt: `Preview ${index + 1}`, className: "w-full h-auto max-h-[100px] rounded-lg shadow-md border border-gray-200" }), _jsx("button", { onClick: () => handleRemoveImage(index), className: "absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1 transform -translate-y-2 translate-x-2", children: "X" })] }, index))) }) })), _jsx("button", { onClick: handleAddComment, className: "mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition", children: "B\u00ECnh lu\u1EADn" })] }), _jsxs("div", { className: "bg-white p-4 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)]", children: [_jsxs("p", { className: "mb-2 text-gray-600", children: [comments.length, " b\u00ECnh lu\u1EADn"] }), _jsx("hr", {}), _jsx("ul", { className: "space-y-4 mt-4", children: comments.map((comment) => (_jsxs("li", { className: "flex space-x-4", children: [_jsx("img", { src: comment.avatar, alt: comment.name, className: "w-10 h-10 rounded-full bg-gray-200" }), _jsxs("div", { className: "w-full", children: [_jsx("p", { className: "font-bold", children: comment.name }), _jsx("p", { className: "text-color-secondary text-sm", children: comment.date }), _jsx("p", { className: "mt-2 text-gray-700", children: comment.text }), comment.images && comment.images.length > 0 && (_jsx("div", { className: "mt-2 flex flex-wrap gap-4", children: comment.images.map((image, index) => (_jsx("div", { className: "relative", children: _jsx("img", { src: image, alt: `Comment Image ${index + 1}`, className: "w-full h-auto max-h-[100px] rounded-lg shadow-md border border-gray-200" }) }, index))) }))] })] }, comment.id))) }), _jsx("button", { onClick: handleLoadMore, className: "mt-4 px-4 py-2 bg-gray-200 text-blue-500 rounded-lg hover:bg-gray-300 transition", children: "Xem th\u00EAm" })] })] }));
};
export default CommentPage;
