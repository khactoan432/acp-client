import React, { useState } from "react";
import Button from "../../common/Button";

interface Rating {
  id: number;
  userInitials: string;
  userName: string;
  timeAgo: string;
  stars: number;
  comment: string;
}

const RatingPage: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([
    {
      id: 1,
      userInitials: "LCT",
      userName: "Lỗ Chí Thành",
      timeAgo: "9 ngày trước",
      stars: 5,
      comment: "Cảm ơn anh rất nhiều, rất tâm huyết và uy tín.",
    },
    {
      id: 2,
      userInitials: "NNP",
      userName: "Ngô Nguyễn Phương Đông",
      timeAgo: "1 tháng trước",
      stars: 5,
      comment: "Lần đầu thấy dùng tiền mà không tiếc 1k vì khóa học.",
    },
  ]);

  const [form, setForm] = useState({
    stars: 0,
    comment: "",
    name: "",
    phone: "",
    email: "",
  });

  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (star: number) => {
    setForm((prev) => ({ ...prev, stars: star }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.phone && form.stars > 0 && form.comment) {
      const newRating: Rating = {
        id: ratings.length + 1,
        userInitials: form.name
          .split(" ")
          .map((word) => word[0])
          .join(""),
        userName: form.name,
        timeAgo: "Vừa xong",
        stars: form.stars,
        comment: form.comment,
      };
      setRatings([newRating, ...ratings]);
      console.log(newRating);
      setForm({ stars: 0, comment: "", name: "", phone: "", email: "" });
      setShowForm(false);
    } else {
      alert("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const totalRatings = ratings.length;
  const averageRating =
    ratings.reduce((acc, cur) => acc + cur.stars, 0) / totalRatings || 0;
  const ratingDistribution = [0, 0, 0, 0, 0];
  ratings.forEach((rating) => {
    ratingDistribution[5 - rating.stars]++;
  });

  return (
    <div className="max-w-[1228px] mx-auto bg-gray-100">
      {/* Average Rating Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {/* <h2 className="text-2xl font-bold mb-4">Đánh giá của học viên</h2> */}
        <div className="flex items-center space-x-6">
          {/* Average Score */}
          <div className="text-center w-1/4">
            <p className="text-6xl font-bold text-yellow-500">
              {averageRating.toFixed(1)}
            </p>
            <div className="text-yellow-500 text-2xl">
              {"★".repeat(Math.round(averageRating))}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 w-1/2">
            {ratingDistribution.map((count, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-sm">{5 - index} ★</span>
                <div className="flex-1 bg-gray-300 h-2 rounded-lg overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-width duration-500"
                    style={{
                      width: `${(count / totalRatings) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm w-[36px] text-center">
                  {((count / totalRatings) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
          <Button
            className={`w-1/4 h-[50px] px-6 py-2 ${
              showForm ? "bg-red-600 hover:bg-red-700" : ""
            }`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Hủy" : "Đánh giá"}
          </Button>
        </div>
      </div>

      {/* Review Form */}
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 ${
          showForm
            ? "max-h-[800px] opacity-100 p-6 mb-6"
            : "max-h-0 opacity-0 p-0"
        }`}
        style={{ visibility: showForm ? "visible" : "hidden" }}
      >
        <h3 className="text-xl font-bold mb-4">Gửi đánh giá của bạn</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              1. Đánh giá của bạn về khóa học
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-2xl ${
                    star <= form.stars ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => handleStarClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              2. Viết cảm nhận của bạn về khóa học
            </label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              placeholder="Cảm nhận của bạn..."
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              3. Thông tin cá nhân của bạn
            </label>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className="border rounded-lg p-2"
                placeholder="Họ và tên*"
              />
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                className="border rounded-lg p-2"
                placeholder="Số điện thoại*"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="border rounded-lg p-2"
                placeholder="Email"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-all duration-300"
          >
            Gửi đánh giá
          </button>
        </form>
      </div>

      {/* User Comments */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul className="space-y-6">
          {ratings.map((rating) => (
            <li key={rating.id} className="flex space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                {rating.userInitials}
              </div>
              <div>
                <p className="font-bold h-[20px]">{rating.userName}</p>
                <div className="text-yellow-500">
                  {"★".repeat(rating.stars)}
                </div>
                <p className="text-sm text-color-secondary">{rating.timeAgo}</p>
                <p className="mt-2 text-gray-700">{rating.comment}</p>
                <button className="text-blue-500 text-sm mt-2 hover:underline">
                  1 Trả lời
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RatingPage;
