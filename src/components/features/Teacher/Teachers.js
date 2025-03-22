import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import bgImage from "../../../assets/logoacp.jpg"; // Replace with your background image path
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTeachers } from "../../../redux/slices/teacherSlice";
const Teachers = () => {
    const dispatch = useDispatch();
    const { userTeachers, loading, error } = useSelector((state) => state.teachers);
    useEffect(() => {
        dispatch(fetchUserTeachers({ role: "TEACHER", page: 1, limit: 100 }));
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
    return loading ? ("Waiting for Loading") : error ? ("Something have wrong") : (_jsxs("div", { className: "relative pt-10 pb-16 bg-[#F9FFF2]", children: [_jsx("div", { className: "absolute inset-0 bg-cover bg-center bg-no-repeat bg-[#F9FFF2] top-16", style: {
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "80%", // Makes the background twice the size of the div
                    backgroundPosition: "center", // Keeps the background centered
                    opacity: 0.15, // Adjust opacity for the background
                } }), _jsxs("div", { className: "relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8", children: [_jsx("h2", { className: "text-4xl text-[#00095B] mb-16 text-center", children: "\u0110\u1ED9i ng\u0169 gi\u00E1o vi\u00EAn xu\u1EA5t s\u1EAFc" }), _jsx(Slider, { ...settings, children: userTeachers.map((teacher) => (_jsx("div", { className: "px-4", children: _jsx("div", { className: "max-w-[272px] max-h-[360px] overflow-hidden rounded-lg shadow-lg mx-auto", children: _jsx("img", { src: teacher.image, alt: teacher?.image.split("/").pop() || "Teacher", className: "w-full h-full object-contain" }) }) }, teacher._id))) })] })] }));
};
const NextArrow = ({ onClick }) => {
    return (_jsx("div", { className: "absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full cursor-pointer hover:bg-blue-600 z-10", onClick: onClick, children: _jsx(FaChevronRight, { size: 24 }) }));
};
const PrevArrow = ({ onClick }) => {
    return (_jsx("div", { className: "absolute top-1/2 left-4 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full cursor-pointer hover:bg-blue-600 z-10", onClick: onClick, children: _jsx(FaChevronLeft, { size: 24 }) }));
};
export default Teachers;
