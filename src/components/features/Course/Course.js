import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from "../../common/Button";
import { useNavigate } from "react-router-dom";
import { postData } from "../../../axios";
const Rating = ({ rating }) => {
    const stars = Array.from({ length: 5 }, (_, index) => {
        return index < rating ? "★" : "☆";
    }).join(" ");
    return _jsx("div", { className: "text-yellow-500 text-2xl", children: stars });
};
const Course = ({ id, name, image, price, discount, description, rating, }) => {
    const navigate = useNavigate();
    const payment = async (id_material, amount) => {
        try {
            console.log("Payment initiated for:", id_material);
            // Gửi request thanh toán
            const pm = await postData("/api/payment/momo", {
                id_user: "6756abc20424abb76abb1eb0", // ID người dùng
                id_material: id_material, // ID khóa học
                type: "COURSE", // Loại thanh toán
                amount: amount
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
    return (_jsxs("div", { className: "bg-white max-w-[400px] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300", id: id.toString(), children: [_jsx("div", { className: "relative", onClick: () => navigate("/course/" + id), children: _jsx("img", { src: image, alt: name, className: "w-full h-56 object-cover" }) }), _jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-lg text-gray-800 truncate", children: name }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: description }), _jsxs("div", { className: "mt-2 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Rating, { rating: rating }), _jsx("span", { children: "(241 \u0110\u00E1nh gi\u00E1)" })] }), _jsx("span", { children: "4279 H\u1ECDc vi\u00EAn" })] }), _jsx("div", { className: "flex justify-between items-center my-3", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("span", { className: "text-xl text-gray-900", children: [new Intl.NumberFormat("vi-VN").format(price - discount), "\u0111"] }), _jsxs("span", { className: "text-xl font-medium text-gray-900 line-through", children: ["$", new Intl.NumberFormat("vi-VN").format(price), "\u0111"] })] }) }), _jsxs("div", { className: "flex gap-[10%] mt-3", children: [_jsx(Button, { onClick: () => navigate("/course/" + id), className: "w-[45%]", children: "Chi ti\u1EBFt" }), _jsx(Button, { onClick: () => payment(id, price - discount), className: "w-[45%]", children: "Mua ngay" })] })] })] }));
};
export default Course;
