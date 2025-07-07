import React, { useEffect } from "react";
import Slider from "react-slick";
import Course from "./Course"; // Import the Course component
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCourses } from "../../../redux/slices/courseSlice";

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

const Courses: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userCourses, loading, error } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    dispatch(fetchUserCourses({ page: 1, limit: 4 }));
  }, [dispatch]);
  // console.log(userCourses);

  const settings = {
    dots: true,
    infinite: userCourses.length > 1,
    speed: 500,
    slidesToShow: Math.min(userCourses.length, 3),
    slidesToScroll: 1,
    nextArrow: <ArrowButton direction="right" />,
    prevArrow: <ArrowButton direction="left" />,
    // centerMode: true, // Bật chế độ căn giữa
    // centerPadding: "20px", // Thêm khoảng cách giữa các slide
    responsive: [
      {
        breakpoint: 1024, // Tablet and below
        settings: {
          slidesToShow: Math.min(userCourses.length, 3), // Show 2 courses at a time
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
      <h2 className="text-4xl text-[#00095B] mb-14 text-center uppercase">
        Khóa học nổi bật
      </h2>
      <Slider {...settings}>
        {userCourses.map((course) => (
          <div key={course._id} className="px-4">
            <Course
              id={course._id}
              name={course.name}
              image={course.image}
              price={Number(course.price)}
              discount={Number(course.discount)}
              description={"7 chủ đề - 39 bài học - 67 bài tập"}
              rating={5}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Courses;
