import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// Import required CSS files for React Slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Import your banner image (make sure the path is correct)
// import banner from "../../../assets/banner1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBanners } from "../../../redux/slices/bannerSlice";
// Define the Banner component
const Banner = () => {
    const dispatch = useDispatch();
    const { userBanners, loading, error } = useSelector((state) => state.banners);
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
        nextArrow: _jsx(SampleNextArrow, {}),
        prevArrow: _jsx(SamplePrevArrow, {}),
    };
    return (loading ? "Waiting for Loading"
        : error ? "Something have wrong"
            : _jsx("div", { className: "w-full", children: _jsx(Slider, { ...settings, children: userBanners.map((slide) => (_jsx("div", { children: _jsx("img", { src: slide.image, alt: slide?.image?.split("/").pop() || "banner", className: "w-full h-[calc(100vh-64px)] object-cover" // Ensuring image is responsive
                         }) }, slide._id))) }) }));
};
const SampleNextArrow = ({ onClick }) => {
    return (_jsx("div", { className: "absolute top-1/2 right-4 transform -translate-y-1/2 text-white p-2 cursor-pointer bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 z-10", onClick: onClick, children: _jsx(FaChevronRight, { size: 24 }) }));
};
// Custom Previous Arrow Component
const SamplePrevArrow = ({ onClick }) => {
    return (_jsx("div", { className: "absolute top-1/2 left-4 transform -translate-y-1/2 text-white p-2 cursor-pointer bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 z-10", onClick: onClick, children: _jsx(FaChevronLeft, { size: 24 }) }));
};
export default Banner;
