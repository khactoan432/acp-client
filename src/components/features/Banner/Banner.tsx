import React from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Import required CSS files for React Slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import your banner image (make sure the path is correct)
import banner from "../../../assets/banner1.jpg";

interface CustomArrowProps {
  onClick?: () => void;
}

const SampleNextArrow: React.FC<CustomArrowProps> = ({ onClick }) => {
  return (
    <div
      className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white p-2 cursor-pointer bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 z-10"
      onClick={onClick}
    >
      <FaChevronRight size={24} />
    </div>
  );
};

// Custom Previous Arrow Component
const SamplePrevArrow: React.FC<CustomArrowProps> = ({ onClick }) => {
  return (
    <div
      className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white p-2 cursor-pointer bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 z-10"
      onClick={onClick}
    >
      <FaChevronLeft size={24} />
    </div>
  );
};

// Define the Banner component
const Banner: React.FC = () => {
  const slides = [
    { id: 1, image: banner, alt: "Banner Image 1" },
    { id: 2, image: banner, alt: "Banner Image 2" },
    { id: 3, image: banner, alt: "Banner Image 3" },
    { id: 4, image: banner, alt: "Banner Image 4" },
    { id: 5, image: banner, alt: "Banner Image 5" },
    { id: 6, image: banner, alt: "Banner Image 6" },
  ];

  // Settings for the slider
  const settings = {
    // dots: true,
    infinite: true, // Loop through slides
    speed: 500, // Transition speed in ms
    slidesToShow: 1, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Delay between auto slides
    nextArrow: <SampleNextArrow/>,
    prevArrow: <SamplePrevArrow/>, 
  };

  return (
    <div className="w-full">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-auto object-cover" // Ensuring image is responsive
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
