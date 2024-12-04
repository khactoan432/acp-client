import React, { useRef, useState } from 'react';

import banner from '../../assets/banner1.jpg';
import banner3 from '../../assets/banner3.jpg';
import Advisory from '../../components/features/Advisory/Advisory';
import Exam from '../../components/features/Exam/Exam';
import SideFilter from '../../components/features/SideFilter/SideFilter';

const UserExam: React.FC = () => {
  const exams = [
    {
      id: 1,
      name: 'Introduction to HTML & CSS',
      time: 15,
      image: banner,
      price: 50000,
      rating: 4.5,
      rates: 150,
      problems: 5,
      users: 300,
    },
    {
      id: 2,
      name: 'JavaScript Essentials',
      time: 25,
      image: banner,
      price: 75000,
      rating: 4.8,
      rates: 210,
      problems: 10,
      users: 500,
    },
    {
      id: 3,
      name: 'React for Beginners',
      time: 20,
      image: banner,
      price: 79000,
      rating: 4.6,
      rates: 125,
      problems: 8,
      users: 320,
    },
    {
      id: 4,
      name: 'Advanced React Patterns',
      time: 30,
      image: banner,
      price: 99000,
      rating: 4.9,
      rates: 90,
      problems: 12,
      users: 150,
    },
    {
      id: 5,
      name: 'Python for Data Science',
      time: 40,
      image: banner,
      price: 120000,
      rating: 4.7,
      rates: 300,
      problems: 15,
      users: 400,
    },
    {
      id: 6,
      name: 'Django for Web Development',
      time: 35,
      image: banner,
      price: 115000,
      rating: 4.6,
      rates: 120,
      problems: 10,
      users: 280,
    },
    {
      id: 7,
      name: 'SQL Database Fundamentals',
      time: 20,
      image: banner,
      price: 68000,
      rating: 4.8,
      rates: 200,
      problems: 8,
      users: 320,
    },
    {
      id: 8,
      name: 'Machine Learning Basics',
      time: 50,
      image: banner,
      price: 150000,
      rating: 4.9,
      rates: 340,
      problems: 20,
      users: 450,
    },
    {
      id: 9,
      name: 'Introduction to Cybersecurity',
      time: 25,
      image: banner,
      price: 85000,
      rating: 4.4,
      rates: 80,
      problems: 10,
      users: 220,
    },
    {
      id: 10,
      name: 'UI/UX Design Principles',
      time: 30,
      image: banner,
      price: 99000,
      rating: 4.7,
      rates: 160,
      problems: 12,
      users: 280,
    },
    {
      id: 11,
      name: 'DevOps with AWS',
      time: 45,
      image: banner,
      price: 140000,
      rating: 4.8,
      rates: 210,
      problems: 15,
      users: 380,
    },
    {
      id: 12,
      name: 'AI-Powered Chatbots with Python',
      time: 40,
      image: banner,
      price: 130000,
      rating: 4.9,
      rates: 275,
      problems: 18,
      users: 340,
    },
    {
      id: 13,
      name: 'AI-Powered Chatbots with Python',
      time: 40,
      image: banner,
      price: 130000,
      rating: 4.9,
      rates: 275,
      problems: 18,
      users: 340,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 9;

  // Calculate indices for the exams to display
  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = exams.slice(indexOfFirstExam, indexOfLastExam);

  // Calculate total pages
  const totalPages = Math.ceil(exams.length / examsPerPage);

  // Ref for scrolling
  const examListRef = useRef<HTMLDivElement>(null);

  const scrollToExams = () => {
    if (examListRef.current) {
      const offset = 100; // Desired offset from the top
      const topPosition =
        examListRef.current.getBoundingClientRect().top + window.pageYOffset;
  
      // Scroll smoothly to the correct position
      window.scrollTo({ top: topPosition - offset, behavior: 'smooth' });
    }
  };
  

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToExams(); // Scroll whenever page changes
  };

  return (
    <div>
      <div className="w-full mt-14">
        <div className="max-w-[1228px] mx-auto">
          <img src={banner3} alt="alt" />
        </div>
      </div>

      <div className="max-w-[1228px] mx-auto mt-20 text-[#00095B] pb-20">
        <p className="text-4xl font-semibold mb-2">Đề thi online</p>
        <p className="text-base">
          Phần mềm và chương trình học online chất lượng cao của STUDY4 được
          thiết kế theo chương trình tiếng Anh chuẩn CEFR (A1 -C2) của đại học
          Cambridge và Oxford (Anh) với hệ thống bài giảng, bài tập phong phú đa
          dạng. Bạn có thể học thử miễn phí trước khi đặt mua sản phẩm.
        </p>

        <div className="flex pt-14">
          <SideFilter />

          <div>
            <div
              className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3 mx-3"
              ref={examListRef}
            >
              {currentExams.map((exam) => (
                <div key={exam.id}>
                  <Exam
                    id={exam.id}
                    name={exam.name}
                    image={exam.image}
                    price={exam.price}
                    time={exam.time}
                    rating={exam.rating}
                    rates={exam.rates}
                    problems={exam.problems}
                    users={exam.users}
                  />
                </div>
              ))}
            </div>

            {/* Pagination Section */}
            <div className="flex justify-center items-center mt-8">
              <button
                className={`px-4 py-2 mx-1 ${
                  currentPage === 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } rounded`}
                disabled={currentPage === 1}
                onClick={() => {
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`px-4 py-2 mx-1 ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-blue-500 hover:text-white'
                  } rounded`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className={`px-4 py-2 mx-1 ${
                  currentPage === totalPages
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } rounded`}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <Advisory />
    </div>
  );
};

export default UserExam;
