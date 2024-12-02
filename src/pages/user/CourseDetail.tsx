import React, { useEffect, useState } from 'react';
import { Link } from "react-scroll";
import bg from '../../assets/banner-detail.jpg';
import banner from '../../assets/banner1.jpg';
import play from '../../assets/play.png';
import RatingPage from '../../components/features/Rating/Rating';
import CommentPage from '../../components/features/Comment/Comment';

const UserCourseDetail: React.FC = () => {
  const course = {
    id: 1,
    name: 'React for Beginners 1',
    description: 'Learn React from scratch with hands-on examples to get frequent.',
    image: banner,
    rates: 23,
    price: 299000,
    rating: 4.9,
    users: 79
  }

  const topics = [
    {
      id: 1,
      name: "JavaScript Basics",
      lessons: [
        { name: "Introduction to JavaScript" },
        { name: "Variables and Constants" },
        { name: "Functions and Scope" },
        { name: "Conditionals and Loops" },
        { name: "Arrays and Objects" },
        { name: "Debugging and Error Handling" },
      ],
    },
    {
      id: 2,
      name: "Web Development",
      lessons: [
        { name: "HTML Basics" },
        { name: "CSS Fundamentals" },
        { name: "JavaScript for the Web" },
        { name: "Responsive Design" },
        { name: "Introduction to Web APIs" },
        { name: "Deploying a Website" },
      ],
    },
    {
      id: 3,
      name: "React Framework",
      lessons: [
        { name: "Getting Started with React" },
        { name: "JSX and Component Basics" },
        { name: "State and Props" },
        { name: "Handling Events in React" },
        { name: "Lifecycle Methods and Hooks" },
        { name: "Building a Todo App with React" },
      ],
    },
  ];

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
            <div className='w-2/3 text-white'>
              <h2 className="text-3xl font-bold mb-2">
                [ACP General training] Class A: Bài Giảng - Chiến Lược Làm Bài - Chữa Bài Chi Tiết
              </h2>

              <div className="my-2 flex justify-between items-center">
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-1.5'>
                    <span className='text-yellow-500 font-semibold'>{course.rating}</span>
                    <Rating rating={course.rating} />
                  </div>
                  <span>({course.rates} đánh giá)</span>
                  <span>{course.users} Học viên</span>
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <p>✅ Dành các bạn mới bắt đầu học code C++</p>
                <p>✅ 18 giờ học video giảng bài và 54 bài tập lập trình từ chi tiết tới nâng cao</p>
                <p>✅ Làm bài chấm bài tự động với codeforce, các bài sẽ có lời giải chi tiết qua video</p>
              </div>
            </div>
            <div className='w-1/3'>

            </div>
          </div>
        </div>
      </div>

      <div className=''>
        {/* Header phụ */}
        <div
          className={`h-14 border-b-2 border-[#e0e0e0] border-solid z-40 bg-white duration-300 ${
            isSticky ? "sticky top-[64px]" : "relative"
          }`}
        >
          <nav className="max-w-[1228px] mx-auto container py-4 flex justify-between items-center">
            <ul className="flex space-x-6 md:space-x-10 text-sm md:text-base font-medium">
              {[
                { name: "Tổng quan", to: "overview" },
                { name: "Nội dung khóa học", to: "content" },
                { name: "Giảng viên", to: "teacher" },
                { name: "Đánh giá", to: "rate" },
                { name: "Nhận xét", to: "comment" },
              ].map((item, index) => (
                <li key={index} className='text-gray-500'>
                  <Link
                    to={item.to}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    className="cursor-pointer font-semibold hover:text-blue-600 transition duration-200"
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
        <div className='max-w-[1228px] mx-auto'>
          <div className='w-2/3'>
            <div id="overview" className="text-[#00095B] my-6 bg-white p-4 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)]">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="relative rounded-lg w-full">
                  <h2 className="text-2xl font-bold mb-6">
                    Bạn sẽ học được gì?
                  </h2>

                  <div className='flex flex-col gap-2'>
                    <p>✅ Dành các bạn mới bắt đầu học code C++</p>
                    <p>✅ 18 giờ học video giảng bài và 54 bài tập lập trình từ chi tiết tới nâng cao</p>
                    <p>✅ Làm bài chấm bài tự động với codeforce, các bài sẽ có lời giải chi tiết qua video</p>
                    <p>✅ Dành các bạn mới bắt đầu học code C++</p>
                    <p>✅ 18 giờ học video giảng bài và 54 bài tập lập trình từ chi tiết tới nâng cao</p>
                    <p>✅ Làm bài chấm bài tự động với codeforce, các bài sẽ có lời giải chi tiết qua video</p>
                  </div>
                </div>

                <div className="relative mt-6 rounded-lg w-full">
                  <h2 className="text-2xl font-bold mb-6">
                    Khoá học có gì đặc biệt?
                  </h2>

                  <div className='flex flex-col gap-2'>
                    <p>✅ Dành các bạn mới bắt đầu học code C++</p>
                    <p>✅ 18 giờ học video giảng bài và 54 bài tập lập trình từ chi tiết tới nâng cao</p>
                    <p>✅ Làm bài chấm bài tự động với codeforce, các bài sẽ có lời giải chi tiết qua video</p>
                    <p>✅ Dành các bạn mới bắt đầu học code C++</p>
                    <p>✅ 18 giờ học video giảng bài và 54 bài tập lập trình từ chi tiết tới nâng cao</p>
                    <p>✅ Làm bài chấm bài tự động với codeforce, các bài sẽ có lời giải chi tiết qua video</p>
                  </div>
                </div>

                <div className="relative mt-6 rounded-lg w-full">
                  <h2 className="text-2xl font-bold mb-6">
                    Khóa học phù hợp với ai?
                  </h2>

                  <div className='flex flex-col gap-2'>
                    <p>✅ Dành các bạn mới bắt đầu học code C++</p>
                    <p>✅ 18 giờ học video giảng bài và 54 bài tập lập trình từ chi tiết tới nâng cao</p>
                    <p>✅ Làm bài chấm bài tự động với codeforce, các bài sẽ có lời giải chi tiết qua video</p>
                    <p>✅ Dành các bạn mới bắt đầu học code C++</p>
                    <p>✅ 18 giờ học video giảng bài và 54 bài tập lập trình từ chi tiết tới nâng cao</p>
                    <p>✅ Làm bài chấm bài tự động với codeforce, các bài sẽ có lời giải chi tiết qua video</p>
                  </div>
                </div>
              </div>
            </div>

            <div id="content" className="text-[#00095B] mb-6 bg-white p-4 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)]">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="relative rounded-lg w-full">
                  <h2 className="text-2xl font-bold mb-6">
                    Nội dung khóa học
                  </h2>

                  {topics.map(topic => (
                    <div id='topic.id' className=''>
                      <p className='bg-sky-500 text-white font-semibold text-lg py-1 px-2'>{topic.name}</p>

                      <div className='flex flex-col divide-y divide-gray-200'>
                        {topic.lessons.map(lesson => (
                          <div className='flex items-center'>
                            <img className='w-[25px] h-[25px]' src={play} alt="alt" />
                            <p className='text-base py-2 px-2'>{lesson.name}</p>
                          </div>
                        ))}
                      </div>
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
        </div>

        <div className='max-w-[1228px] mx-auto'>
          <div id="rate" className="text-[#00095B] mb-6">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="relative mt-6 mb-6 rounded-lg w-full">
                <h2 className="text-2xl font-bold mb-6">
                  Đánh giá của học viên
                </h2>

                <RatingPage/>
              </div>
            </div>
          </div>

          <div id="comment" className="text-[#00095B] mb-6">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="relative mt-6 mb-6 rounded-lg w-full">
                <h2 className="text-2xl font-bold mb-6">
                  Bình luận
                </h2>

                <CommentPage />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Rating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    return index < rating ? '★' : '☆';
  }).join(' ');

  return <div className="text-yellow-500 text-2xl">{stars}</div>;
};  

export default UserCourseDetail