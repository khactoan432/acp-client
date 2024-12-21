import React, { useEffect } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import bgImage from "../../../assets/logoacp.jpg"; // Replace with your background image path
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchUserTeachers } from "../../../redux/slices/teacherSlice";


const Teachers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userTeachers, loading, error } = useSelector(
    (state: RootState) => state.teachers
  );

  useEffect(() => {
    dispatch(fetchUserTeachers({ role: "TEACHER", page: 1, limit: 100 }));
  }, [dispatch]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // Tablet and below
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // Mobile devices
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    loading ? "Waiting for Loading" 
    : error ? "Something have wrong"
    : <div className="relative pt-10 pb-16 bg-[#F9FFF2]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[#F9FFF2] top-16"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "80%", // Makes the background twice the size of the div
            backgroundPosition: "center", // Keeps the background centered
            opacity: 0.15, // Adjust opacity for the background
          }}
        ></div>

        {/* Content Overlay */}
        <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <h2 className="text-4xl font-semibold text-[#00095B] mb-16 text-center">
            Đội ngũ giáo viên xuất sắc
          </h2>
          <Slider {...settings}>
            {userTeachers.map((teacher) => (
              <div key={teacher._id} className="px-4">
                <div className="max-w-[272px] max-h-[360px] overflow-hidden rounded-lg shadow-lg mx-auto">
                  <img
                    src={teacher.image}
                    alt={ teacher?.image.split("/").pop() || "Teacher"}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
  );
};


const NextArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full cursor-pointer hover:bg-blue-600 z-10"
      onClick={onClick}
    >
      <FaChevronRight size={24} />
    </div>
  );
};

const PrevArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div
      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full cursor-pointer hover:bg-blue-600 z-10"
      onClick={onClick}
    >
      <FaChevronLeft size={24} />
    </div>
  );
};

export default Teachers;
