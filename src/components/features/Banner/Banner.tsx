import React, { useEffect } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Import required CSS files for React Slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import your banner image (make sure the path is correct)
// import banner from "../../../assets/banner1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchUserBanners } from "../../../redux/slices/bannerSlice";

interface CustomArrowProps {
  onClick?: () => void;
}

// Define the Banner component
const Banner: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userBanners, loading, error } = useSelector(
    (state: RootState) => state.banners
  );

  useEffect(() => {
    dispatch(fetchUserBanners({ page: 1, limit: 100 }));
  }, [dispatch]);

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
    loading ? "Waiting for Loading" 
    : error ? "Something have wrong"
    : <div className="w-full">
        <Slider {...settings}>
          {userBanners.map((slide) => (
            <div key={slide._id}>
              <img
                src={slide.image}
                alt={slide?.image?.split("/").pop() || "banner"}
                className="w-full h-[calc(100vh-64px)] object-cover" // Ensuring image is responsive
              />
            </div>
          ))}
        </Slider>
      </div>
  );
};



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

export default Banner;
