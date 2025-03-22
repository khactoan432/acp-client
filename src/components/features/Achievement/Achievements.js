import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAchievements } from "../../../redux/slices/achievementSlice";
const Achievements = () => {
    const dispatch = useDispatch();
    const { userAchievements, loading, error } = useSelector((state) => state.achievements);
    useEffect(() => {
        dispatch(fetchUserAchievements({ page: 1, limit: 100 }));
    }, [dispatch]);
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: _jsx(NextArrow, {}),
        prevArrow: _jsx(PrevArrow, {}),
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
    return loading ? ("Waiting for Loading") : error ? ("Something have wrong") : (_jsx("div", { className: "relative pt-10 pb-16 bg-[#EDFDFF]", children: _jsxs("div", { className: "relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8", children: [_jsx("h2", { className: "text-4xl text-[#00095B] mb-16 text-center", children: "Th\u00E0nh t\u00EDch xu\u1EA5t s\u1EAFc c\u1EE7a h\u1ECDc vi\u00EAn kh\u00F3a tr\u01B0\u1EDBc" }), _jsx(Slider, { ...settings, children: userAchievements.map((achievement) => (_jsx("div", { className: "px-4", children: _jsx("div", { className: "max-w-[272px] max-h-[380px] overflow-hidden rounded-lg shadow-lg mx-auto", children: _jsx("img", { src: achievement.image, alt: achievement?.image?.split("/").pop() || "achievement", className: "w-full h-full object-contain" // Adjusted to "object-cover" for proper fit
                             }) }) }, achievement._id))) })] }) }));
};
const NextArrow = ({ onClick }) => {
    return (_jsx("div", { className: "absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full cursor-pointer hover:bg-blue-600 z-10", onClick: onClick, children: _jsx(FaChevronRight, { size: 24 }) }));
};
const PrevArrow = ({ onClick }) => {
    return (_jsx("div", { className: "absolute top-1/2 left-4 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full cursor-pointer hover:bg-blue-600 z-10", onClick: onClick, children: _jsx(FaChevronLeft, { size: 24 }) }));
};
export default Achievements;
