import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import bg from "../../assets/banner-detail.jpg";
import banner from "../../assets/banner1.jpg";
import play from "../../assets/play.png";
import RatingPage from "../../components/features/Rating/Rating";
// import CommentPage from "../../components/features/Comment/Comment";
import VideoPopup from "../../components/features/Video/Video";

import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchCourseDetail } from "../../redux/slices/courseSlice";
import Lesson from "../../components/features/Video/Lesson";
import { postData } from "../../axios";

interface User {
  _id: string;
  name: string;
  image: string;
  email: string;
  phone_number: string;
  codeforce_name: string;
  role: string;
}

const UserCourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = id ?? "default-id";
  console.log(courseId);

  const dispatch = useDispatch<AppDispatch>();
  const selectedCourse = useSelector(
    (state: RootState) => state.courses.selectedCourse
  );

  useEffect(() => {
    dispatch(fetchCourseDetail(courseId));
    console.log(1);
  }, [courseId]);

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

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50); // Thay đổi vị trí tùy theo chiều cao header chính
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [expandedTopics, setExpandedTopics] = useState({}); // Track which topics are expanded

  const toggleExpand = (topicId) => {
    setExpandedTopics((prevState) => ({
      ...prevState,
      [topicId]: !prevState[topicId],
    }));
  };

  const payment = async (id_material: string) => {
    try {
      console.log("Payment initiated for:", id_material);

      const userString = localStorage.getItem("user");
      let user: User | null = null;

      // Nếu có giá trị, phân tích JSON
      if (userString) {
        try {
          user = JSON.parse(userString) as User; // Chuyển chuỗi thành đối tượng
        } catch (error) {
          console.error("Failed to parse user from localStorage:", error);
        }
      }

      // Gửi request thanh toán
      const pm = await postData(
        "/api/payment/momo",
        {
          id_user: user?._id || "6756abc20424abb76abb1eb0", // ID người dùng
          id_material: id_material, // ID khóa học
          type: "COURSE", // Loại thanh toán
        },
        {}
      );

      console.log("Payment response:", pm);

      // Điều hướng đến URL thanh toán
      if (pm.data?.payUrl) {
        window.location.href = pm.data.payUrl;
      } else {
        console.error("Payment URL not found in response.");
        alert("Không thể thực hiện thanh toán, vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("Đã xảy ra lỗi khi thực hiện thanh toán.");
    }
  };

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
                {selectedCourse?.name}
              </h2>

              <div className="my-2 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-500">{course.rating}</span>
                    <Rating rating={course.rating} />
                  </div>
                  <span>({course.rates} đánh giá)</span>
                  <span>{course.users} Học viên</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p>✅ Dành các bạn học code C++</p>
                <p>
                  ✅ Nhiều giờ học video giảng bài và bài tập lập trình thực
                  hành từ chi tiết tới nâng cao
                </p>
                <p>
                  ✅ Làm bài chấm bài tự động với codeforce, các bài sẽ có lời
                  giải chi tiết qua video
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
                { name: "Nội dung khóa học", to: "content" },
                { name: "Giảng viên", to: "teacher" },
                { name: "Đánh giá", to: "rate" },
                { name: "Bình luận", to: "comment" },
              ].map((item, index) => (
                <li key={index} className="text-color-secondary">
                  <Link
                    to={item.to}
                    spy={true}
                    smooth={true}
                    offset={-140}
                    duration={500}
                    className="cursor-pointer font-semibold text-color-secondary transition duration-200"
                    activeClass="active"
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
                {selectedCourse?.describes?.map((item) => (
                  <div
                    className="relative mb-6 rounded-lg w-full"
                    key={item._id}
                  >
                    <h2 className="text-2xl font-bold mb-6">{item.desc}</h2>

                    <div className="flex flex-col gap-2">
                      {item.overviews.map((overview) => (
                        <p key={overview._id}>✅ {overview.desc})</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              id="content"
              className="text-[#00095B] mb-6 bg-white p-4 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)]"
            >
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="relative rounded-lg w-full">
                  <h2 className="text-2xl font-bold mb-6">Nội dung khóa học</h2>

                  {selectedCourse?.topics?.map((topic) => (
                    <div key={topic._id} className="mb-3">
                      <div
                        className="flex items-center justify-between border-solid border-[#ebebeb] border bg-[#f5f5f5] rounded-md py-3 px-4 cursor-pointer"
                        onClick={() => toggleExpand(topic._id)}
                      >
                        <div className="flex items-center space-x-2">
                          <div className=" w-[15px] flex justify-center">
                            {expandedTopics[topic._id] 
                              ? <div className="w-[11px] h-[1.6px] bg-black"></div> 
                              : <span className="text-[24px] h-[28px] leading-[28px]">+</span>}
                          </div>
                          <p className="text-lg">{topic.name}</p>
                        </div>
                        <span>{topic?.lessons?.length} bài học</span>
                      </div>

                      {expandedTopics[topic._id] && (
                        <div className="flex flex-col divide-y divide-gray-200 px-4">
                          {topic?.lessons?.map((lesson) => (
                            <div
                              className="flex items-center justify-between py-3"
                              key={lesson._id}
                            >
                              <div className="flex items-center">
                                <img
                                  className="w-[25px] h-[25px]"
                                  src={play}
                                  alt="Play"
                                />
                                <p className="text-base ml-2">{lesson.name}</p>
                              </div>

                              {lesson.status === "PUBLIC" ? (
                                <Lesson url={lesson.video} name={lesson.name} />
                              ) : (
                                <span className="text-gray-500 text-sm">Locked</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="teacher" className="text-[#00095B] mb-6">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="relative mt-6 mb-6 rounded-lg w-full">
                  <h2 className="text-2xl font-bold mb-6">
                    Thông tin giảng viên
                  </h2>
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
              {/* <video className='rounded-md w-full h-[180px]' src={selectedCourse?.video} controls/> */}
              <VideoPopup url={selectedCourse?.video} name={"dfds"} />
              <div className="mt-6">
                <p className="text-gray-700 text-lg">
                  Ưu đãi đặc biệt trong tháng:
                </p>
                <div className="flex gap-4 mt-2">
                  <p className="text-green-600 text-2xl font-bold mt-2">
                    {new Intl.NumberFormat("vi-VN").format(
                      (Number(selectedCourse?.price ?? 0)) -
                        (Number(selectedCourse?.discount ?? 0))
                    )}
                    đ
                  </p>
                  <div>
                    <p className="text-gray-400 line-through text-sm">
                      Giá gốc:{" "}
                      {new Intl.NumberFormat("vi-VN").format(
                        Number(selectedCourse?.price)
                      )}
                      đ
                    </p>
                    <p className="text-red-500 text-sm font-medium">
                      Tiết kiệm:{" "}
                      {new Intl.NumberFormat("vi-VN").format(
                        Number(selectedCourse?.discount)
                      )}
                      đ ( -
                      {Math.round(
                        (Number(selectedCourse?.discount ?? 0) /
                          Number(selectedCourse?.price ?? 1)) *
                          100
                      )}
                      %)
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="w-full btn-primary text-white font-semibold py-3 rounded-lg mt-4"
                onClick={() => payment(selectedCourse?._id)}
              >
                MUA KHÓA HỌC NGAY
              </button>
              <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg mt-3 hover:bg-gray-300">
                Học thử miễn phí
              </button>
              <ul className="mt-6 text-sm text-gray-600 space-y-2">
                <li>👥 2,042 học viên đã đăng ký</li>
                <li>📚 8 chủ đề, 48 bài học</li>
                <li>📝 56 bài tập thực hành</li>
                <li>📦 Khóa học có giá trị 6 tháng</li>
                <li>💻 Có thể học trên điện thoại và máy tính</li>
              </ul>
              <p className="text-sm mt-6">
                Chưa chắc chắn khóa học này dành cho bạn?{" "}
                <a href="#" className="text-color-secondary underline">
                  Liên hệ để nhận tư vấn miễn phí!
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1228px] mx-auto px-3">
          <div id="rate" className="text-[#00095B] mb-6">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="relative mt-6 mb-6 rounded-lg w-full">
                <h2 className="text-2xl font-bold mb-6">
                  Đánh giá của học viên
                </h2>

                <RatingPage id_ref_material={courseId} ref_type={"COURSE"}/>
              </div>
            </div>
          </div>

          {/* <div id="comment" className="text-[#00095B] mb-6">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="relative mt-6 mb-6 rounded-lg w-full">
                <h2 className="text-2xl font-bold mb-6">Bình luận</h2>

                <CommentPage />
              </div>
            </div>
          </div> */}
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

export default UserCourseDetail;
