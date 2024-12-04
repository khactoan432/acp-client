import React, { useState } from "react";

import User from "../../../assets/user3.png";

import { IoImages } from "react-icons/io5";

interface Comment {
  id: number;
  name: string;
  avatar: string;
  text: string;
  date: string;
  images?: string[]; // Lưu trữ danh sách URL của các ảnh
}

const CommentPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([
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
      avatar: "https://via.placeholder.com/40",
      text: "Cảm ơn khóa học đã mang lại kiến thức giá trị. Giảng viên rất nhiệt tình và dễ hiểu.",
      date: "20 ngày trước",
      images: [],
    },
    {
      id: 3,
      name: "Lê Hoàng Nam",
      avatar: "https://via.placeholder.com/40",
      text: "Những bài tập thực hành rất sát thực tế, giúp em cải thiện kỹ năng rất nhiều.",
      date: "18 ngày trước",
      images: [],
    }
  ]);  

  const [newComment, setNewComment] = useState("");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      alert("Vui lòng nhập nội dung bình luận!");
      return;
    }

    const newCommentData: Comment = {
      id: comments.length + 1,
      name: "Người dùng mới", // Placeholder cho tên người dùng
      avatar: "https://via.placeholder.com/40", // Placeholder cho ảnh đại diện
      text: newComment,
      date: "Vừa xong",
      images: previewImages, // Lưu danh sách URL xem trước của các ảnh
    };

    setComments([newCommentData, ...comments]);
    setNewComment("");
    setNewImages([]);
    setPreviewImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setNewImages([...newImages, ...newFiles]);

      // Tạo URL xem trước cho các ảnh
      const newPreviewImages = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviewImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...newImages];
    const updatedPreviewImages = [...previewImages];

    updatedImages.splice(index, 1);
    updatedPreviewImages.splice(index, 1);

    setNewImages(updatedImages);
    setPreviewImages(updatedPreviewImages);
  };

  const handleLoadMore = () => {
    // Giả lập tải thêm bình luận
    const moreComments: Comment[] = [
      {
        id: comments.length + 1,
        name: "Người dùng khác",
        avatar: "https://via.placeholder.com/40",
        text: "Đây là bình luận khác đã được tải thêm.",
        date: "30 ngày trước",
      },
    ];

    setComments([...comments, ...moreComments]);
  };

  return (
    <div className="max-w-[1228px] mx-auto bg-gray-100">
      {/* Comment Form */}
      <div className="relative bg-white p-4 rounded-lg shadow-md mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Mời bạn để lại bình luận"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        ></textarea>

        {/* File Input for Images */}
        <div className="absolute right-6 top-6">
          <label htmlFor="image-upload" className="flex items-center gap-3 w-fit cursor-pointer">
            <IoImages className="w-[25px] h-[25px] hover:text-blue-500"/> {/* Icon tải ảnh */}
            {/* <span className="text-sm text-gray-600">Tải ảnh lên</span> */}
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            multiple
            className="hidden" // Ẩn input file
            onChange={handleImageUpload}
          />
        </div>

        {/* Preview Images */}
        {previewImages.length > 0 && (
          <div className="mt-4">
            {/* <p className="text-sm text-gray-600 mb-2">Hình ảnh xem trước:</p> */}
            <div className="flex flex-wrap gap-4">
              {previewImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-auto max-h-[100px] rounded-lg shadow-md border border-gray-200"
                  />
                  {/* Remove Image Button */}
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1 transform -translate-y-2 translate-x-2"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleAddComment}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Bình luận
        </button>
      </div>

      {/* Comment List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="mb-2 text-gray-600">{comments.length} bình luận</p>
        <hr />
        <ul className="space-y-4 mt-4">
          {comments.map((comment) => (
            <li key={comment.id} className="flex space-x-4">
              <img
                src={comment.avatar}
                alt={comment.name}
                className="w-10 h-10 rounded-full bg-gray-200"
              />
              <div className="w-full">
                <p className="font-bold">{comment.name}</p>
                <p className="text-gray-500 text-sm">{comment.date}</p>
                <p className="mt-2 text-gray-700">{comment.text}</p>
                {comment.images && comment.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-4">
                    {comment.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Comment Image ${index + 1}`}
                          className="w-full h-auto max-h-[100px] rounded-lg shadow-md border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        {/* Load More Button */}
        <button
          onClick={handleLoadMore}
          className="mt-4 px-4 py-2 bg-gray-200 text-blue-500 rounded-lg hover:bg-gray-300 transition"
        >
          Xem thêm
        </button>
      </div>
    </div>
  );
};

export default CommentPage;
