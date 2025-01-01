import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import bg from "../../assets/banner-detail.jpg";
import banner from "../../assets/banner1.jpg";
import RatingPage from "../../components/features/Rating/Rating";
import CommentPage from "../../components/features/Comment/Comment";
import Button from "../../components/common/Button";

import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";

const UserExamDetail: React.FC = () => {
  const course = {
    id: 1,
    name: "React for Beginners 1",
    description:
      "Learn React from scratch with hands-on examples to get frequent.",
    image: banner,
    rates: 23,
    price: 299000,
    rating: 4.9,
    users: 79,
  };

  const videos = [
    {
      id: 1,
      title: "Sửa bài phần 1",
      image: banner, // Replace with your image URL
    },
    {
      id: 2,
      title: "Sửa bài phần 1",
      image: banner, // Replace with your image URL
    },
    {
      id: 3,
      title: "Sửa bài phần 1",
      image: banner, // Replace with your image URL
    },
  ];

  const [isSticky, setIsSticky] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50); // Thay đổi vị trí tùy theo chiều cao header chính
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="relative flex items-center justify-center">
        {/* Background with opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${bg})` }}
        ></div>

        <div className="flex items-center justify-center w-full h-full shadow-md bg-[#010101]">
          <div className="relative max-w-[1228px] my-10 py-6 rounded-lg w-full">
            <div className="w-2/3 text-white px-3">
              <h2 className="text-3xl font-bold mb-2">
                [ACP General training] Class A: Bài Giảng - Chiến Lược Làm Bài -
                Chữa Bài Chi Tiết
              </h2>

              <div className="my-2 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-500">{course.rating}</span>
                    <Rating rating={course.rating} />
                  </div>
                  <span>({course.rates} đánh giá)</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p>Thời gian làm bài 20 phút | 8 câu hỏi | 242 bình luận</p>
                <p>231 người đã làm đề thi này</p>
                <p className="text-red-500">
                  Chú ý: Để làm được bài thi sau khi mua đề bạn cần đợi vài phút
                  để được mở khóa bên codeforce.
                </p>
              </div>
            </div>
            <div className="w-1/3"></div>
          </div>
        </div>
      </div>

      <div className="">
        {/* Header phụ */}
        <div
          className={`h-14 border-b-2 border-[#e0e0e0] border-solid z-30 bg-white duration-300 ${
            isSticky ? "sticky top-[64px]" : "relative"
          }`}
        >
          <nav className="max-w-[1228px] mx-auto container py-4 px-3 flex justify-between items-center">
            <ul className="flex space-x-6 md:space-x-10 text-sm md:text-base font-medium">
              {[
                { name: "Tổng quan", to: "overview" },
                { name: "Làm đề thi", to: "content" },
                { name: "Video sửa bài", to: "video" },
                { name: "Đánh giá", to: "rate" },
                { name: "Bình luận", to: "comment" },
              ].map((item, index) => (
                <li key={index} className="primary-color-text">
                  <Link
                    to={item.to}
                    spy={true}
                    smooth={true}
                    offset={-140}
                    duration={500}
                    className="cursor-pointer hover:text-blue-600 transition duration-200"
                    activeClass="text-blue-600"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Content Sections */}
        <div className="flex max-w-[1228px] mx-auto">
          <div className="w-2/3 px-3">
            <div
              id="overview"
              className="text-[#00095B] my-6 bg-white p-4 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)]"
            >
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="relative rounded-lg w-full">
                  <h2 className="text-2xl font-bold mb-6">Mô tả đề thi</h2>

                  <div className="flex flex-col gap-2">
                    <p>✅ Thời gian làm bài: 60 phút</p>
                    <p>✅ Số lượng câu hỏi: 9 câu hỏi</p>
                    <p>
                      ✅ Mỗi bài tập có độ khó khác nhau, sắp xếp từ dễ đến rất
                      khó
                    </p>
                    <p>✅ Ưu tiên sử dụng C++ do hiệu suất xử lý tốt</p>
                  </div>
                </div>

                <div className="relative mt-6 rounded-lg w-full">
                  <h2 className="text-2xl font-bold mb-6">Kiến thức cần có</h2>

                  <div className="flex flex-col gap-2">
                    <p>✅ Tìm kiếm nhị phân (Binary Search).</p>
                    <p>
                      ✅ Cách tiếp cận tối ưu cục bộ để giải quyết bài toán.
                    </p>
                    <p>
                      ✅ Các bài toán cơ bản như: dãy con tăng dài nhất (LIS),
                      bài toán cái túi (Knapsack).
                    </p>
                    <p>✅ Cây bao trùm nhỏ nhất (MST): Kruskal, Prim.</p>
                    <p>
                      ✅ Thuật toán Sàng Eratosthenes (liệt kê số nguyên tố).
                    </p>
                    <p>
                      ✅ Bài toán đếm đường đi, đếm chuỗi, tổ hợp lồng nhau.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              id="content"
              className="text-[#00095B] mb-6 bg-white p-4 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)]"
            >
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="relative rounded-lg w-full">
                  <h2 className="text-2xl font-bold mb-6">Làm bài thi</h2>

                  <div className="flex items-center justify-center gap-4">
                    {isOpen ? (
                      <FaUnlock className="w-[27px] h-[30px]" />
                    ) : (
                      <FaLock className="w-[27px] h-[30px]" />
                    )}

                    <Button
                      className="w-full max-w-[600px]"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      Làm bài thi
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div
              id="video"
              className="text-[#00095B] bg-white p-4 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)]"
            >
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="relative mt-6 mb-6 rounded-lg w-full">
                  <h2 className="text-2xl font-bold mb-6">Video sửa bài</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                      <div key={video.id} className="bg-white overflow-hidden">
                        <img
                          src={video.image}
                          alt={video.title}
                          className="w-full h-[160px] object-cover rounded-lg"
                        />
                        <div className="pt-3">
                          <p className="font-medium text-gray-700">
                            {video.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/3 px-3">
            <div
              className={`bg-white shadow-lg rounded-lg p-3 mx-auto mt-[-320px] z-40 ${
                isSticky ? "sticky top-[70px]" : "relative"
              }`}
            >
              <img
                className="rounded-md w-full h-[180px]"
                src={banner}
                alt="alt"
              />
              <div className="mt-6">
                <p className="text-gray-700 text-lg">
                  Ưu đãi đặc biệt tháng 12/2024:
                </p>
                <div className="flex gap-4 mt-2">
                  <p className="text-green-600 text-2xl font-bold mt-2">
                    689.000đ
                  </p>
                  <div>
                    <p className="text-gray-400 line-through text-sm">
                      Giá gốc: 1.799.000đ
                    </p>
                    <p className="text-red-500 text-sm font-medium">
                      Tiết kiệm: 810.000đ (-45%)
                    </p>
                  </div>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700">
                MUA ĐỀ THI NGAY
              </button>
              <ul className="mt-6 text-sm text-gray-600 space-y-2">
                <li>👥 63,042 học viên đã làm</li>
                <li>📚 3 giờ làm bài</li>
                <li>📝 9 bài tập thực hành</li>
                <li>📦 Có giá trị sở hữu trọn đời</li>
              </ul>
              <p className="text-sm primary-color-text mt-6">
                Chưa chắc chắn đề thi này dành cho bạn?{" "}
                <a href="#" className="text-blue-600 underline">
                  Liên hệ để nhận tư vấn miễn phí!
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1228px] mx-auto px-3 mt-6">
          <div id="rate" className="text-[#00095B] mb-6">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="relative mt-6 mb-6 rounded-lg w-full">
                <h2 className="text-2xl font-bold mb-6">
                  Đánh giá của học viên
                </h2>

                <RatingPage />
              </div>
            </div>
          </div>

          <div id="comment" className="text-[#00095B] mb-6">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="relative mt-6 mb-6 rounded-lg w-full">
                <h2 className="text-2xl font-bold mb-6">Bình luận</h2>

                <CommentPage />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Rating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    return index < rating ? "★" : "☆";
  }).join(" ");

  return <div className="text-yellow-500 text-2xl">{stars}</div>;
};

export default UserExamDetail;
