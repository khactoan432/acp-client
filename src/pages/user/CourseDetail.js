import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import bg from "../../assets/banner-detail.jpg";
import banner from "../../assets/banner1.jpg";
import play from "../../assets/play.png";
import RatingPage from "../../components/features/Rating/Rating";
// import CommentPage from "../../components/features/Comment/Comment";
import VideoPopup from "../../components/features/Video/Video";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseDetail } from "../../redux/slices/courseSlice";
import Lesson from "../../components/features/Video/Lesson";
import { postData } from "../../axios";
const UserCourseDetail = () => {
    const { id } = useParams();
    const courseId = id ?? "default-id";
    console.log(courseId);
    const dispatch = useDispatch();
    const selectedCourse = useSelector((state) => state.courses.selectedCourse);
    useEffect(() => {
        dispatch(fetchCourseDetail(courseId));
        console.log(1);
    }, [courseId]);
    const course = {
        id: 1,
        name: "React for Beginners 1",
        description: "Learn React from scratch with hands-on examples to get frequent.",
        image: banner,
        rates: 23,
        price: 299000,
        rating: 4.9,
        users: 79,
    };
    const [isSticky, setIsSticky] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 50); // Thay đổi vị trí tùy theo chiều cao header chính
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    const [expandedTopics, setExpandedTopics] = useState({}); // Track which topics are expanded
    const toggleExpand = (topicId) => {
        setExpandedTopics((prevState) => ({
            ...prevState,
            [topicId]: !prevState[topicId],
        }));
    };
    const payment = async (id_material) => {
        try {
            console.log("Payment initiated for:", id_material);
            const userString = localStorage.getItem("user");
            let user = null;
            // Nếu có giá trị, phân tích JSON
            if (userString) {
                try {
                    user = JSON.parse(userString); // Chuyển chuỗi thành đối tượng
                }
                catch (error) {
                    console.error("Failed to parse user from localStorage:", error);
                }
            }
            // Gửi request thanh toán
            const pm = await postData("/api/payment/momo", {
                id_user: user?._id || "6756abc20424abb76abb1eb0", // ID người dùng
                id_material: id_material, // ID khóa học
                type: "COURSE", // Loại thanh toán
            }, {});
            console.log("Payment response:", pm);
            // Điều hướng đến URL thanh toán
            if (pm.data?.payUrl) {
                window.location.href = pm.data.payUrl;
            }
            else {
                console.error("Payment URL not found in response.");
                alert("Không thể thực hiện thanh toán, vui lòng thử lại sau.");
            }
        }
        catch (error) {
            console.error("Error during payment process:", error);
            alert("Đã xảy ra lỗi khi thực hiện thanh toán.");
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "relative flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-cover bg-center opacity-25", style: { backgroundImage: `url(${bg})` } }), _jsx("div", { className: "flex items-center justify-center w-full h-full shadow-md bg-[#010101]", children: _jsxs("div", { className: "relative max-w-[1228px] my-10 py-6 rounded-lg w-full", children: [_jsxs("div", { className: "w-2/3 text-white px-3", children: [_jsx("h2", { className: "text-3xl font-bold mb-2", children: selectedCourse?.name }), _jsx("div", { className: "my-2 flex justify-between items-center", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "text-yellow-500", children: course.rating }), _jsx(Rating, { rating: course.rating })] }), _jsxs("span", { children: ["(", course.rates, " \u0111\u00E1nh gi\u00E1)"] }), _jsxs("span", { children: [course.users, " H\u1ECDc vi\u00EAn"] })] }) }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("p", { children: "\u2705 D\u00E0nh c\u00E1c b\u1EA1n h\u1ECDc code C++" }), _jsx("p", { children: "\u2705 Nhi\u1EC1u gi\u1EDD h\u1ECDc video gi\u1EA3ng b\u00E0i v\u00E0 b\u00E0i t\u1EADp l\u1EADp tr\u00ECnh th\u1EF1c h\u00E0nh t\u1EEB chi ti\u1EBFt t\u1EDBi n\u00E2ng cao" }), _jsx("p", { children: "\u2705 L\u00E0m b\u00E0i ch\u1EA5m b\u00E0i t\u1EF1 \u0111\u1ED9ng v\u1EDBi codeforce, c\u00E1c b\u00E0i s\u1EBD c\u00F3 l\u1EDDi gi\u1EA3i chi ti\u1EBFt qua video" })] })] }), _jsx("div", { className: "w-1/3" })] }) })] }), _jsxs("div", { className: "", children: [_jsx("div", { className: `h-14 border-b-2 border-[#e0e0e0] border-solid z-30 bg-white duration-300 ${isSticky ? "sticky top-[64px]" : "relative"}`, children: _jsx("nav", { className: "max-w-[1228px] mx-auto container py-4 px-3 flex justify-between items-center", children: _jsx("ul", { className: "flex space-x-6 md:space-x-10 text-sm md:text-base font-medium", children: [
                                    { name: "Tổng quan", to: "overview" },
                                    { name: "Nội dung khóa học", to: "content" },
                                    { name: "Giảng viên", to: "teacher" },
                                    { name: "Đánh giá", to: "rate" },
                                    { name: "Bình luận", to: "comment" },
                                ].map((item, index) => (_jsx("li", { className: "text-color-secondary", children: _jsx(Link, { to: item.to, spy: true, smooth: true, offset: -140, duration: 500, className: "cursor-pointer font-semibold text-color-secondary transition duration-200", activeClass: "active", children: item.name }) }, index))) }) }) }), _jsxs("div", { className: "flex max-w-[1228px] mx-auto", children: [_jsxs("div", { className: "w-2/3 px-3", children: [_jsx("div", { id: "overview", className: "text-[#00095B] my-6 bg-white p-4 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)]", children: _jsx("div", { className: "flex flex-col items-center justify-center w-full h-full", children: selectedCourse?.describes?.map((item) => (_jsxs("div", { className: "relative mb-6 rounded-lg w-full", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: item.desc }), _jsx("div", { className: "flex flex-col gap-2", children: item.overviews.map((overview) => (_jsxs("p", { children: ["\u2705 ", overview.desc, ")"] }, overview._id))) })] }, item._id))) }) }), _jsx("div", { id: "content", className: "text-[#00095B] mb-6 bg-white p-4 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)]", children: _jsx("div", { className: "flex flex-col items-center justify-center w-full h-full", children: _jsxs("div", { className: "relative rounded-lg w-full", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "N\u1ED9i dung kh\u00F3a h\u1ECDc" }), selectedCourse?.topics?.map((topic) => (_jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex items-center justify-between border-solid border-[#ebebeb] border bg-[#f5f5f5] rounded-md py-3 px-4 cursor-pointer", onClick: () => toggleExpand(topic._id), children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: " w-[15px] flex justify-center", children: expandedTopics[topic._id]
                                                                                    ? _jsx("div", { className: "w-[11px] h-[1.6px] bg-black" })
                                                                                    : _jsx("span", { className: "text-[24px] h-[28px] leading-[28px]", children: "+" }) }), _jsx("p", { className: "text-lg", children: topic.name })] }), _jsxs("span", { children: [topic?.lessons?.length, " b\u00E0i h\u1ECDc"] })] }), expandedTopics[topic._id] && (_jsx("div", { className: "flex flex-col divide-y divide-gray-200 px-4", children: topic?.lessons?.map((lesson) => (_jsxs("div", { className: "flex items-center justify-between py-3", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("img", { className: "w-[25px] h-[25px]", src: play, alt: "Play" }), _jsx("p", { className: "text-base ml-2", children: lesson.name })] }), lesson.status === "PUBLIC" ? (_jsx(Lesson, { url: lesson.video, name: lesson.name })) : (_jsx("span", { className: "text-gray-500 text-sm", children: "Locked" }))] }, lesson._id))) }))] }, topic._id)))] }) }) }), _jsx("div", { id: "teacher", className: "text-[#00095B] mb-6", children: _jsx("div", { className: "flex flex-col items-center justify-center w-full h-full", children: _jsx("div", { className: "relative mt-6 mb-6 rounded-lg w-full", children: _jsx("h2", { className: "text-2xl font-bold mb-6", children: "Th\u00F4ng tin gi\u1EA3ng vi\u00EAn" }) }) }) })] }), _jsx("div", { className: "w-1/3 px-3", children: _jsxs("div", { className: `bg-white shadow-lg rounded-lg p-3 mx-auto mt-[-320px] z-40 ${isSticky ? "sticky top-[70px]" : "relative"}`, children: [_jsx(VideoPopup, { url: selectedCourse?.video, name: "dfds" }), _jsxs("div", { className: "mt-6", children: [_jsx("p", { className: "text-gray-700 text-lg", children: "\u01AFu \u0111\u00E3i \u0111\u1EB7c bi\u1EC7t trong th\u00E1ng:" }), _jsxs("div", { className: "flex gap-4 mt-2", children: [_jsxs("p", { className: "text-green-600 text-2xl font-bold mt-2", children: [new Intl.NumberFormat("vi-VN").format((Number(selectedCourse?.price ?? 0)) -
                                                                    (Number(selectedCourse?.discount ?? 0))), "\u0111"] }), _jsxs("div", { children: [_jsxs("p", { className: "text-gray-400 line-through text-sm", children: ["Gi\u00E1 g\u1ED1c:", " ", new Intl.NumberFormat("vi-VN").format(Number(selectedCourse?.price)), "\u0111"] }), _jsxs("p", { className: "text-red-500 text-sm font-medium", children: ["Ti\u1EBFt ki\u1EC7m:", " ", new Intl.NumberFormat("vi-VN").format(Number(selectedCourse?.discount)), "\u0111 ( -", Math.round((Number(selectedCourse?.discount ?? 0) /
                                                                            Number(selectedCourse?.price ?? 1)) *
                                                                            100), "%)"] })] })] })] }), _jsx("button", { className: "w-full btn-primary text-white font-semibold py-3 rounded-lg mt-4", onClick: () => payment(selectedCourse?._id), children: "MUA KH\u00D3A H\u1ECCC NGAY" }), _jsx("button", { className: "w-full bg-gray-200 text-gray-800 py-3 rounded-lg mt-3 hover:bg-gray-300", children: "H\u1ECDc th\u1EED mi\u1EC5n ph\u00ED" }), _jsxs("ul", { className: "mt-6 text-sm text-gray-600 space-y-2", children: [_jsx("li", { children: "\uD83D\uDC65 2,042 h\u1ECDc vi\u00EAn \u0111\u00E3 \u0111\u0103ng k\u00FD" }), _jsx("li", { children: "\uD83D\uDCDA 8 ch\u1EE7 \u0111\u1EC1, 48 b\u00E0i h\u1ECDc" }), _jsx("li", { children: "\uD83D\uDCDD 56 b\u00E0i t\u1EADp th\u1EF1c h\u00E0nh" }), _jsx("li", { children: "\uD83D\uDCE6 Kh\u00F3a h\u1ECDc c\u00F3 gi\u00E1 tr\u1ECB 6 th\u00E1ng" }), _jsx("li", { children: "\uD83D\uDCBB C\u00F3 th\u1EC3 h\u1ECDc tr\u00EAn \u0111i\u1EC7n tho\u1EA1i v\u00E0 m\u00E1y t\u00EDnh" })] }), _jsxs("p", { className: "text-sm mt-6", children: ["Ch\u01B0a ch\u1EAFc ch\u1EAFn kh\u00F3a h\u1ECDc n\u00E0y d\u00E0nh cho b\u1EA1n?", " ", _jsx("a", { href: "#", className: "text-color-secondary underline", children: "Li\u00EAn h\u1EC7 \u0111\u1EC3 nh\u1EADn t\u01B0 v\u1EA5n mi\u1EC5n ph\u00ED!" })] })] }) })] }), _jsx("div", { className: "max-w-[1228px] mx-auto px-3", children: _jsx("div", { id: "rate", className: "text-[#00095B] mb-6", children: _jsx("div", { className: "flex flex-col items-center justify-center w-full h-full", children: _jsxs("div", { className: "relative mt-6 mb-6 rounded-lg w-full", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "\u0110\u00E1nh gi\u00E1 c\u1EE7a h\u1ECDc vi\u00EAn" }), _jsx(RatingPage, { id_ref_material: courseId, ref_type: "COURSE" })] }) }) }) })] })] }));
};
const Rating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, index) => {
        return index < rating ? "★" : "☆";
    }).join(" ");
    return _jsx("div", { className: "text-yellow-500 text-2xl", children: stars });
};
export default UserCourseDetail;
