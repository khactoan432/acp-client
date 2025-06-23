// Exams.tsx
import React, { useEffect } from "react";
import Exam from "./Exam"; // Import the Exam component
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchUserExams } from "../../../redux/slices/examSlice";

const ArrowButton: React.FC<{
  onClick?: () => void;
  direction: "left" | "right";
}> = ({ onClick, direction }) => {
  const isLeft = direction === "left";
  return (
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full cursor-pointer hover:bg-blue-600 z-10 ${
        isLeft ? "left-4" : "right-4"
      }`}
      onClick={onClick}
    >
      {isLeft ? <FaChevronLeft size={24} /> : <FaChevronRight size={24} />}
    </div>
  );
};

const Exams: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userExams, loading, error } = useSelector(
    (state: RootState) => state.exams
  );
  console.log(loading, error);

  useEffect(() => {
    dispatch(fetchUserExams({ page: 1, limit: 4, filters: [] }));
  }, [dispatch]);
  console.log(userExams);

  const settings = {
    dots: true,
    infinite: userExams.length > 1,
    speed: 500,
    slidesToShow: Math.min(userExams.length, 4),
    slidesToScroll: 1,
    nextArrow: <ArrowButton direction="right" />,
    prevArrow: <ArrowButton direction="left" />,
    // centerMode: true, // Bật chế độ căn giữa
    // centerPadding: "20px", // Thêm khoảng cách giữa các slide
    responsive: [
      {
        breakpoint: 1024, // Tablet and below
        settings: {
          slidesToShow: Math.min(userExams.length, 2), // Show 2 courses at a time
        },
      },
      {
        breakpoint: 768, // Mobile devices
        settings: {
          slidesToShow: 1, // Show 1 course at a time
        },
      },
    ],
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500">
        An error occurred. Please try again later.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 mt-12">
      <h2 className="text-4xl text-[#00095B] mb-14 text-center">
        Đề thi mới nhất
      </h2>
      <Slider {...settings}>
        {userExams.map((exam) => (
          <div key={exam._id} className="px-4">
            <Exam
              _id={exam._id}
              name={exam.name}
              image={exam.image}
              price={Number(exam.price)}
              discount={Number(exam.discount)}
              time={15}
              rating={4.8}
              rates={46}
              problems={12}
              users={122}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Exams;
