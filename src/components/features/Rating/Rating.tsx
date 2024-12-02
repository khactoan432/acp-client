import React, { useState } from "react";

interface Review {
  id: number;
  name: string;
  rating: number;
  feedback: string;
  date: string;
}

const RatingPage: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      name: "Lô Chí Thành",
      rating: 5,
      feedback: "Cảm ơn anh rất nhiều, rất tận huyết và uy tín.",
      date: "9 ngày trước",
    },
  ]);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !name || !feedback) {
      alert("Please complete all required fields.");
      return;
    }

    const newReview: Review = {
      id: reviews.length + 1,
      name,
      rating,
      feedback,
      date: "Just now",
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setFeedback("");
    setName("");
  };

  return (
    <div className="max-w-[1228px] mx-auto">
      {/* Overall Rating Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        {/* <h1 className="text-2xl font-bold mb-4">Đánh giá của học viên</h1> */}
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-5xl font-bold text-yellow-500">5.0</p>
            <div className="text-yellow-500 text-lg flex">
              {"★".repeat(5)}
            </div>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center space-x-2">
                <p className="text-sm">{star} ★</p>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className={`h-2 bg-blue-500 rounded`}
                    style={{
                      width: star === 5 ? "100%" : "0%", // Adjust percentages dynamically if needed
                    }}
                  ></div>
                </div>
                <p className="text-sm">{star === 5 ? "100%" : "0%"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Review Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Gửi đánh giá của bạn</h2>
        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="mb-4">
            <p className="font-semibold mb-2">1. Đánh giá của bạn về khóa học</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => handleRatingClick(value)}
                  className={`text-2xl ${
                    value <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="mb-4">
            <p className="font-semibold mb-2">2. Viết cảm nhận của bạn về khóa học</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Cảm nhận của bạn..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Personal Information */}
          {/* <div className="mb-4">
            <p className="font-semibold mb-2">
              3. Thông tin cá nhân của bạn (thông tin của bạn sẽ được bảo mật)
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Họ và tên*"
              className="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại"
              className="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Gửi đánh giá
          </button>
        </form>
      </div>

      {/* User Reviews Display */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Đánh giá từ học viên</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">Chưa có đánh giá nào.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-yellow-500">{`★`.repeat(
                    review.rating
                  )}</div>
                  <p className="mt-2 text-gray-700">{review.feedback}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RatingPage;
