import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { toast } from "react-toastify";
// import component
import Button from "../../common/Button";
import Loading from "../../../components/loading";
// import axios
import { postData } from "../../../axios";
import bg1 from "../../../assets/bg1.jpg";
const Advisory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone_number: "",
        email: "",
        mindfulness_course: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await postData("/api/advisories", {
                name: formData.name,
                phone_number: formData.phone_number,
                email: formData.email,
                mindfulness_course: formData.mindfulness_course,
            }, { headers: {} });
            toast.success("Đăng ký tư vấn thành công! Admin sẽ liên hệ sớm với bạn");
            setFormData({
                name: "",
                phone_number: "",
                email: "",
                mindfulness_course: "",
            });
        }
        catch (e) {
            console.error("Error submitting form:", e);
            toast.error("Đăng ký tư vấn bị lỗi, vui lòng thử lại!");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "relative flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-cover bg-center opacity-30", style: { backgroundImage: `url(${bg1})` } }), _jsx("div", { className: "flex items-center justify-center w-full h-full bg-opacity-90 shadow-md bg-gray-900", children: _jsxs("div", { className: "relative max-w-[700px] my-20 p-6 rounded-lg w-full bg-white", children: [_jsx("h2", { className: "text-3xl font-bold text-center text-[#00095B] mb-2", children: "\u0110\u0103ng k\u00FD ngay h\u00F4m nay" }), _jsx("h2", { className: "text-xl text-center text-[#00095B] mb-6", children: "Nh\u1EADn \u01B0u \u0111\u00E3i c\u1EF1c k\u1EF3 h\u1EA5p d\u1EABn" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", name: "name", placeholder: "H\u1ECD v\u00E0 t\u00EAn", value: formData.name, onChange: handleChange, required: true, className: "w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500" }), _jsx("input", { type: "tel", name: "phone_number", placeholder: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i", value: formData.phone_number, onChange: handleChange, required: true, className: "w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500" }), _jsx("input", { type: "email", name: "email", placeholder: "\u0110\u1ECBa ch\u1EC9 email", value: formData.email, onChange: handleChange, required: true, className: "w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500" }), _jsxs("select", { name: "mindfulness_course", value: formData.mindfulness_course, onChange: handleChange, required: true, className: "w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black", children: [_jsx("option", { value: "", disabled: true, children: "Kh\u00F3a h\u1ECDc b\u1EA1n quan t\u00E2m" }), _jsx("option", { value: "frontend", children: "Frontend Development" }), _jsx("option", { value: "backend", children: "Backend Development" }), _jsx("option", { value: "fullstack", children: "Fullstack Development" }), _jsx("option", { value: "data-science", children: "Data Science" })] }), _jsxs(Button, { type: "submit", className: `w-full py-2 relative`, children: ["\u0110\u0103ng k\u00FD t\u01B0 v\u1EA5n mi\u1EC5n ph\u00ED", isLoading && _jsx(Loading, { size: "small" })] })] })] }) })] }));
};
export default Advisory;
