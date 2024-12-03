import React, { useState } from "react";

interface Comment {
  id: number;
  name: string;
  avatar: string;
  text: string;
  date: string;
}

const CommentPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      name: "Trần Văn Khoa",
      avatar: "https://via.placeholder.com/40", // Replace with actual avatar URL
      text: "Khóa học rất bổ ích, em đã học được rất nhiều từ khóa học này, nhờ có khóa học em đã lấy lại được kiến thức cũng như cách tư duy logic để giải quyết bài toán, cảm ơn khóa học rất nhiều.",
      date: "22 ngày trước",
    },
    {
      id: 2,
      name: "Trần Văn Khoa",
      avatar: "https://via.placeholder.com/40",
      text: "Khóa học rất bổ ích, em đã học được rất nhiều từ khóa học này, nhờ có khóa học em đã lấy lại được kiến thức cũng như cách tư duy logic để giải quyết bài toán, cảm ơn khóa học rất nhiều.",
      date: "22 ngày trước",
    },
  ]);

  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) {
      alert("Vui lòng nhập nội dung bình luận!");
      return;
    }

    const newCommentData: Comment = {
      id: comments.length + 1,
      name: "Người dùng mới", // Placeholder for the user name
      avatar: "https://via.placeholder.com/40", // Placeholder for the user avatar
      text: newComment,
      date: "Vừa xong", // Placeholder for date
    };

    setComments([newCommentData, ...comments]);
    setNewComment("");
  };

  const handleLoadMore = () => {
    // Simulate loading more comments
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
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        {/* <h2 className="text-xl font-bold mb-4">Bình luận</h2> */}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Mời bạn để lại bình luận"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        ></textarea>
        <button
          onClick={handleAddComment}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Bình luận
        </button>
      </div>

      {/* Comment List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="mb-2 text-gray-600">{comments.length} bình luận</p>
        <hr/>
        <ul className="space-y-4 mt-4">
          {comments.map((comment) => (
            <li key={comment.id} className="flex space-x-4">
              <img
                src={comment.avatar}
                alt={comment.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-bold">{comment.name}</p>
                <p className="text-gray-500 text-sm">{comment.date}</p>
                <p className="mt-2 text-gray-700">{comment.text}</p>
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
