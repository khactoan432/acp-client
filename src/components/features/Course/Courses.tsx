// Courses.tsx
import React from 'react';
import Slider from 'react-slick';
import Course from './Course'; // Import the Course component
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import banner from "../../../assets/banner1.jpg";

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

const Courses: React.FC = () => {
  const courses = [
    {
      id: 1,
      name: 'React for Beginners 1',
      description: 'Learn React from scratch with hands-on examples to get frequent.',
      image: banner,
      price: 299000,
      rating: 4,
    },
    {
      id: 2,
      name: 'Advanced JavaScript 1',
      description: 'Deep dive into JavaScript concepts and advanced features.',
      image: banner,
      price: 399000,
      rating: 5,
    },
    {
      id: 3,
      name: 'React for Beginners 2',
      description: 'Learn React from scratch with hands-on examples to get frequent.',
      image: banner,
      price: 299000,
      rating: 4,
    },
    {
      id: 4,
      name: 'Advanced JavaScript 2',
      description: 'Deep dive into JavaScript concepts and advanced features.',
      image: banner,
      price: 399000,
      rating: 5,
    },
    // Add more courses as needed
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    centerMode: false,
    centerPadding: '0',
    responsive: [
      {
        breakpoint: 1024, // Tablet and below
        settings: {
          slidesToShow: 2, // Show 2 courses at a time
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

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 mt-12">
      <h2 className="text-4xl font-semibold text-[#00095B] mb-14 text-center">Khóa học nổi bật</h2>
      <Slider {...settings}>
        {courses.map(course => (
          <div key={course.id} className="px-2">
            <Course
              id={course.id}
              name={course.name}
              image={course.image}
              price={course.price}
              description={course.description}
              rating={course.rating}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Courses;
