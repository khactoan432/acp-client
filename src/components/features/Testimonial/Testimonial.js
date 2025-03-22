import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import user from "../../../assets/user.png";
const testimonials = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        course: "Frontend Development",
        feedback: "Với chương trình học chú trọng thực tiễn, ACP trở thành bệ phóng giúp chúng em thỏa mãn đam mê, rèn kỹ năng, tạo nên sự tự tin trong các giải thi quốc gia và thế giới. Cảm ơn sự đồng hành của ACP trong suốt cuộc hành trình chinh phục code của em.",
        avatar: "https://via.placeholder.com/100",
    },
    {
        id: 2,
        name: "Trần Thị B",
        course: "Fullstack Development",
        feedback: "Giáo viên nhiệt tình, tài liệu đầy đủ. Tôi rất hài lòng với khóa học.",
        avatar: "https://via.placeholder.com/100",
    },
    {
        id: 3,
        name: "Lê Văn C",
        course: "Data Science",
        feedback: "Một trải nghiệm học tập rất thú vị và bổ ích. Tôi sẽ giới thiệu bạn bè tham gia.",
        avatar: "https://via.placeholder.com/100",
    },
];
const Testimonials = () => {
    return (_jsx("div", { className: "pt-14 pb-16 bg-white", children: _jsxs("div", { className: "container mx-auto px-4 max-w-[1228px]", children: [_jsx("h2", { className: "text-4xl font-bold text-center text-[#00095B] mb-12", children: "C\u1EA3m nh\u1EADn h\u1ECDc vi\u00EAn" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: testimonials.map((testimonial) => (_jsxs("div", { className: "bg-[#DBF5FF] rounded-lg shadow-md p-6 flex flex-col", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("img", { src: user, alt: testimonial.name, className: "w-16 h-16 rounded-full mr-4 bg-slate-100 " }), _jsxs("div", { className: "text-left", children: [_jsx("h3", { className: "text-lg font-bold text-blue-600 mb-1", children: testimonial.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("strong", { children: "Kh\u00F3a h\u1ECDc:" }), " ", testimonial.course] })] })] }), _jsx("p", { className: "text-gray-700 italic", children: testimonial.feedback })] }, testimonial.id))) })] }) }));
};
export default Testimonials;
