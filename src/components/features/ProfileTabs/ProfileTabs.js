import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../common/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchYourMaterial } from "../../../redux/slices/yourMaterialSlice";
// const sampleCourses: Course[] = [
//   {
//     id: '1',
//     name: 'Khóa học lập trình cơ bản',
//     image: banner,
//     progress: 45, // Tiến độ 45%
//   },
//   {
//     id: '2',
//     name: 'Khóa học JavaScript nâng cao',
//     image: banner,
//     progress: 80, // Tiến độ 80%
//   },
// ];
// const sampleExamResults: ExamResult[] = [
//   {
//     id: "1",
//     name: "Bài thi thử lập trình cơ bản",
//     image: banner,
//     score: 85, // Điểm số 85
//   },
//   {
//     id: "2",
//     name: "Bài thi thử JavaScript",
//     image: banner,
//     score: 42, // Điểm số 72
//   },
//   {
//     id: "2",
//     name: "Bài thi thử JavaScript nâng cao",
//     image: banner,
//     score: null, // Điểm số 72
//   },
// ];
const ProfileTabs = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("courses");
    const dispatch = useDispatch();
    const { yourCourses, yourExams, loading, error } = useSelector((state) => state.yourMaterials);
    console.log(loading, error);
    useEffect(() => {
        dispatch(fetchYourMaterial({ id_user: JSON.parse(localStorage.getItem("user"))?._id }));
    }, [dispatch]);
    console.log();
    return (_jsxs("div", { className: "", children: [_jsxs("div", { className: "pt-4 flex justify-center border-b border-gray-300 bg-white", children: [_jsx("button", { onClick: () => setActiveTab("courses"), className: `px-4 py-2 ${activeTab === "courses"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-color-secondary"}`, children: "Kh\u00F3a h\u1ECDc" }), _jsx("button", { onClick: () => setActiveTab("results"), className: `px-4 py-2 ${activeTab === "results"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-color-secondary"}`, children: "K\u1EBFt qu\u1EA3 luy\u1EC7n thi" })] }), _jsx("div", { className: "py-8", children: activeTab === "courses" ? (yourCourses?.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4", children: yourCourses.map((course) => (_jsxs("div", { className: "bg-white shadow-md rounded-lg flex flex-col items-center", children: [_jsx("img", { src: course.image, alt: course.name, className: "w-full h-32 object-cover rounded-md" }), _jsxs("div", { className: "w-full p-4", children: [_jsx("h3", { className: "text-lg mb-2", children: course.name }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-[10px] mb-2", children: _jsx("div", { className: "bg-blue-600 rounded-full h-[10px]", style: { width: `${course.totalProgress / course.totalLessons * 100}%` } }) }), _jsxs("p", { className: "text-sm text-gray-600 pb-3", children: ["Ti\u1EBFn \u0111\u1ED9: ", course.totalProgress / course.totalLessons * 100, "%"] }), _jsx(Button, { onClick: () => navigate("/learning/" + course._id), className: "w-full", children: "Tiếp tục" })] })] }, course._id))) })) : (_jsx("p", { className: "text-center text-gray-600", children: "B\u1EA1n ch\u01B0a \u0111\u0103ng k\u00FD h\u1ECDc kh\u00F3a h\u1ECDc n\u00E0o!" }))) : yourExams.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4", children: yourExams.map((exam) => (_jsxs("div", { className: "bg-white shadow-md rounded-lg flex flex-col items-center", children: [_jsx("img", { src: exam.image, alt: exam.name, className: "w-full h-32 object-cover rounded-md" }), _jsxs("div", { className: "w-full p-4", children: [_jsx("h3", { className: "text-lg mb-2", children: exam.name }), _jsxs("p", { className: `text-lg font-bold pb-3 ${!exam.score
                                            ? "text-yellow-600"
                                            : exam.score >= 50
                                                ? "text-green-600"
                                                : "text-red-600"}`, children: ["\u0110i\u1EC3m: ", exam.score ? exam.score : "Chưa thi thử"] }), _jsx(Button, { onClick: () => alert(`Added ${name} to cart!`), className: "w-full", children: exam.score ? "Làm lại" : "Bắt đầu" })] })] }, exam._id))) })) : (_jsx("p", { className: "text-center text-gray-600", children: "Kh\u00F4ng c\u00F3 k\u1EBFt qu\u1EA3 luy\u1EC7n thi n\u00E0o!" })) })] }));
};
export default ProfileTabs;
