import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import play from "../../../assets/play.png";
const LessonList = ({ sections, currentLesson, changeLesson, }) => {
    const [activeSections, setActiveSections] = useState([]);
    const toggleSection = (id) => {
        setActiveSections((prev) => prev.includes(id) ? prev.filter((sectionId) => sectionId !== id) : [...prev, id]);
    };
    return (_jsxs("div", { className: "", children: [_jsx("h2", { className: "text-xl font-bold p-3", children: "N\u1ED9i dung kh\u00F3a h\u1ECDc" }), sections?.map((section) => (_jsxs("div", { className: "", children: [_jsxs("button", { onClick: () => toggleSection(section._id), className: "w-full px-4 py-3 bg-[#eeeeee] text-left text-black border-b-[0.3px] border-solid border-gray-300 hover:bg-gray-200", children: [_jsx("p", { children: section.name }), _jsxs("p", { className: "font-extralight text-xs text-black", children: ["(", section.completedLessons, "/", section.totalLessons, ") | ", "23:09"] })] }), activeSections.includes(section._id) && (_jsx("ul", { className: "bg-gray-100 rounded-lg", children: section.lessons.length > 0 ? (section.lessons.map((lesson) => (_jsxs("li", { className: `flex justify-between items-center pl-8 pr-4 py-3 rounded cursor-pointer ${lesson._id === currentLesson._id
                                ? "bg-blue-100 text-black"
                                : "bg-gray-50 text-color-secondary hover:bg-gray-200"}`, onClick: () => changeLesson(section._id, lesson._id), children: [_jsxs("div", { className: "", children: [_jsx("span", { className: "pr-2", children: lesson.name }), _jsxs("div", { className: "flex justify-start gap-1 items-center", children: [_jsx("img", { className: "w-[13px] h-[13px]", src: play, alt: "play" }), _jsx("span", { className: "text-xs", children: "23:09" })] })] }), lesson.isCompleted && (_jsx("div", { children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 48 48", children: [_jsx("path", { fill: "#4caf50", d: "M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z" }), _jsx("path", { fill: "#ccff90", d: "M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z" })] }) }))] }, lesson._id)))) : (_jsx("p", { className: "text-color-secondary italic text-sm ml-3", children: "Kh\u00F4ng c\u00F3 b\u00E0i h\u1ECDc n\u00E0o." })) }))] }, section._id)))] }));
};
export default LessonList;
