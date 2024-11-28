import React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import achievement1 from "../../../assets/achievement/achievement1.jpg";
import achievement2 from "../../../assets/achievement/achievement2.jpg";
import achievement3 from "../../../assets/achievement/achievement3.jpg";
import achievement4 from "../../../assets/achievement/achievement4.jpg";

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

const Achievements: React.FC = () => {
  const achievements = [
    { id: 1, image: achievement1 },
    { id: 2, image: achievement2 },
    { id: 3, image: achievement3 },
    { id: 4, image: achievement4 },
  ];

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
    <div className="relative pt-10 pb-16 bg-[#EDFDFF]">

      {/* Content Overlay */}
      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-4xl font-semibold text-[#00095B] mb-16 text-center">
          Thành tích xuất sắc của học viên khóa trước
        </h2>
        <Slider {...settings}>
          {achievements.map((achievement) => (
            <div key={achievement.id} className="px-4">
              <div className="max-w-[272px] max-h-[380px] overflow-hidden rounded-lg shadow-lg mx-auto">
                <img
                  src={achievement.image}
                  alt="achievement"
                  className="w-full h-full object-contain" // Adjusted to "object-cover" for proper fit
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Achievements;
