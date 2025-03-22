import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import Button from "../../common/Button";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // Import tiếng Việt
// Kích hoạt plugin và thiết lập ngôn ngữ
dayjs.extend(relativeTime);
dayjs.locale("vi");
// import useFetchData from "../../../hooks/useFetchData";
import { createRate, fetchUserRates } from "../../../redux/slices/rateSlice";
import Loading from "../../loading";
const RatingPage = ({ id_ref_material, ref_type }) => {
    const dispatch = useDispatch();
    const { userRates, totalRateUser, loading: ratesLoading, error: ratesError } = useSelector((state) => state.rates);
    console.log(userRates);
    useEffect(() => {
        dispatch(fetchUserRates({ id_ref_material, ref_type }));
    }, [dispatch, id_ref_material, ref_type]);
    // console.log(userRates);
    const [form, setForm] = useState({
        rate: 0,
        content: "",
    });
    const [replyForm, setReplyForm] = useState({});
    const [showForm, setShowForm] = useState(false);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleStarClick = (star) => {
        setForm((prev) => ({ ...prev, rate: star }));
    };
    const handleReplyChange = (e, replyId) => {
        const { name, value } = e.target;
        setReplyForm((prev) => ({
            ...prev,
            [replyId]: {
                ...prev[replyId],
                [name]: value,
            },
        }));
    };
    // console.log(localStorage.getItem('user'),JSON.parse(localStorage.getItem('user'))?._id);
    // console.log(material_id);
    const handleRateSubmit = async (e, id_ref_material) => {
        e.preventDefault();
        if (form.rate > 0 && form.content) {
            const newRating = {
                id_user: JSON.parse(localStorage.getItem('user'))?._id,
                id_ref_material: id_ref_material,
                ref_type: ref_type, // Nhận ref_type từ tham số
                type: "RATE", // Nhận type từ tham số
                rate: form.rate,
                content: form.content,
            };
            console.log(newRating);
            await dispatch(createRate(newRating)).unwrap();
            setForm({ rate: 0, content: "" });
            setShowForm(false);
        }
        else {
            alert("Vui lòng điền đầy đủ thông tin!");
        }
    };
    const handleReplySubmit = async (e, id_ref_material) => {
        e.preventDefault();
        if (replyForm[id_ref_material] && replyForm[id_ref_material].content) {
            const newRating = {
                id_user: JSON.parse(localStorage.getItem('user'))?._id,
                id_ref_material: id_ref_material,
                ref_type: "INTERACTION", // Nhận ref_type từ tham số
                type: "COMMENT", // Nhận type từ tham số
                content: replyForm[id_ref_material].content,
            };
            console.log(newRating);
            await dispatch(createRate(newRating)).unwrap();
            setForm({ rate: 0, content: "" });
            setShowForm(false);
        }
        else {
            alert("Vui lòng điền đầy đủ thông tin!");
        }
    };
    const totalRatings = totalRateUser;
    const averageRating = userRates?.reduce((acc, cur) => acc + cur.rate, 0) / totalRatings || 0;
    const ratingDistribution = [0, 0, 0, 0, 0];
    userRates?.forEach((rating) => {
        ratingDistribution[5 - rating.rate]++;
    });
    const [openReplies, setOpenReplies] = useState({}); // State quản lý danh sách trả lời mở/đóng
    const [openReply, setOpenReply] = useState({});
    const toggleReplies = (ratingId) => {
        setOpenReplies((prev) => {
            const isCurrentlyOpen = prev[ratingId];
            const updatedReply = isCurrentlyOpen
                ? { ...openReplies, [ratingId]: false }
                : { ...openReplies };
            setOpenReply(updatedReply);
            return {
                ...prev,
                [ratingId]: !isCurrentlyOpen,
            };
        });
    };
    const toggleReply = (ratingId) => {
        setOpenReply((prev) => {
            const isCurrentlyOpen = prev[ratingId]; // Trạng thái hiện tại của openReply[ratingId]
            const updatedReplies = isCurrentlyOpen
                ? { ...openReplies } // Nếu đóng, không ảnh hưởng openReplies
                : { ...openReplies, [ratingId]: true }; // Nếu mở, mở luôn openReplies[ratingId]
            // Cập nhật openReplies đồng thời với openReply
            setOpenReplies(updatedReplies);
            // Trả về trạng thái mới cho openReply
            return {
                ...prev,
                [ratingId]: !isCurrentlyOpen,
            };
        });
    };
    // console.log(userRates[0]?.replies[0],typeof(userRates[0]?.replies[0]));
    return (_jsxs("div", { className: "max-w-[1228px] mx-auto", children: [_jsx("div", { className: "bg-white p-6 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)] mb-6", children: _jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs("div", { className: "text-center w-1/4", children: [_jsx("p", { className: "text-6xl font-bold text-yellow-500", children: averageRating.toFixed(1) }), _jsx("div", { className: "text-yellow-500 text-2xl", children: "★".repeat(Math.round(averageRating)) })] }), _jsx("div", { className: "flex-1 w-1/2", children: ratingDistribution?.map((count, index) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("span", { className: "text-sm", children: [5 - index, " \u2605"] }), _jsx("div", { className: "flex-1 bg-gray-300 h-2 rounded-lg overflow-hidden", children: _jsx("div", { className: "bg-blue-500 h-full transition-width duration-500", style: {
                                                width: `${(count / totalRatings) * 100}%`,
                                            } }) }), _jsxs("span", { className: "text-sm w-[36px] text-center", children: [((count / totalRatings) * 100).toFixed(0), "%"] })] }, index))) }), _jsx(Button, { className: `w-1/4 h-[50px] px-6 py-2 ${showForm ? "bg-red-600 hover:bg-red-700" : ""}`, onClick: () => setShowForm(!showForm), children: showForm ? "Hủy" : "Đánh giá" })] }) }), _jsxs("div", { className: `bg-white rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)] overflow-hidden transition-all duration-500 ${showForm
                    ? "max-h-[800px] opacity-100 p-6 mb-6"
                    : "max-h-0 opacity-0 p-0"}`, style: { visibility: showForm ? "visible" : "hidden" }, children: [_jsx("h3", { className: "text-xl font-bold mb-4", children: "G\u1EEDi \u0111\u00E1nh gi\u00E1 c\u1EE7a b\u1EA1n" }), _jsxs("form", { onSubmit: (e) => handleRateSubmit(e, id_ref_material), children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-2 font-medium", children: "1. \u0110\u00E1nh gi\u00E1 c\u1EE7a b\u1EA1n v\u1EC1 kh\u00F3a h\u1ECDc" }), _jsx("div", { className: "flex space-x-2", children: [1, 2, 3, 4, 5].map((star) => (_jsx("span", { className: `cursor-pointer text-2xl ${star <= form.rate ? "text-yellow-500" : "text-gray-300"}`, onClick: () => handleStarClick(star), children: "\u2605" }, star))) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-2 font-medium", children: "2. Vi\u1EBFt c\u1EA3m nh\u1EADn c\u1EE7a b\u1EA1n v\u1EC1 kh\u00F3a h\u1ECDc" }), _jsx("textarea", { name: "content", value: form.content, onChange: handleInputChange, className: "w-full border rounded-lg p-2", placeholder: "C\u1EA3m nh\u1EADn c\u1EE7a b\u1EA1n..." })] }), _jsx("button", { type: "submit", className: "bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-all duration-300", children: "G\u1EEDi \u0111\u00E1nh gi\u00E1" })] })] }), ratesLoading
                ? _jsx(Loading, { message: "Loading data...", size: "large" })
                : ratesError
                    ? "error"
                    : userRates.length === 0
                        ? ""
                        : _jsxs("div", { className: "bg-white p-4 rounded-[0.65rem] border border-solid border-[#e0e0e0] shadow-[0_4px_0_0_rgba(143,156,173,0.2)]", children: [_jsxs("p", { className: "mb-2 text-gray-600", children: [userRates.length, " \u0111\u00E1nh gi\u00E1"] }), _jsx("hr", {}), _jsx("ul", { className: "space-y-6 mt-4", children: userRates?.map((rating) => (_jsxs("li", { className: "flex flex-col space-y-4 border-b border-dashed border-gray-200 pb-4 mb-4 last:border-none last:pb-0 last:mb-0", children: [_jsxs("div", { className: "flex space-x-4 ", children: [_jsx("div", { className: "flex-shrink-0 w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold", children: rating.user_name?.split(" ")
                                                            .map((word) => word[0])
                                                            .join("") }), _jsxs("div", { children: [_jsx("p", { className: "font-bold h-[20px]", children: rating.user_name }), _jsx("div", { className: "text-yellow-500", children: "★".repeat(rating.rate) }), _jsx("p", { className: "text-xs text-gray-500", children: dayjs(rating.createdAt).fromNow() }), _jsx("p", { className: "mt-2 text-gray-700", children: rating.content }), _jsxs("div", { className: "flex space-x-2", children: [rating?.replies?.length !== 0
                                                                        ? _jsx("button", { onClick: () => toggleReplies(rating._id), className: "text-blue-500 text-sm mt-2 hover:underline", children: openReplies[rating._id] ? "Ẩn trả lời" : `${rating?.replies?.length} Trả lời` })
                                                                        : _jsx("button", { className: "text-blue-500 text-sm mt-2", children: " 0 Tr\u1EA3 l\u1EDDi" }), _jsx("button", { onClick: () => toggleReply(rating._id), className: "text-blue-500 text-sm mt-2 hover:underline", children: openReply[rating._id] ? "Ẩn phản hồi" : "Phản hồi" })] })] })] }), openReplies[rating._id] && (_jsxs("div", { className: "ml-16 mt-4 bg-gray-100 rounded-lg shadow-sm", children: [rating?.replies?.map((reply, index) => (_jsxs("div", { className: "flex items-start space-x-4 border-b border-gray-200 pb-4 m-4 mb-4 last:border-none last:pb-0 last:mb-0", children: [_jsx("div", { className: "flex-shrink-0 w-10 h-10 bg-yellow-500 text-white flex items-center justify-center rounded-full text-sm font-bold", children: reply.user_name
                                                                    ?.split(" ")
                                                                    .map((word) => word[0])
                                                                    .join("") }), _jsxs("div", { children: [_jsxs("div", { className: "flex space-x-2", children: [_jsx("p", { className: "font-bold text-sm ", children: reply.user_name }), reply.user_role === "ADMIN" && (_jsx("p", { className: "text-xs bg-yellow-200 text-yellow-800 px-2 rounded pt-0.5", children: reply.user_role }))] }), _jsx("p", { className: "text-xs text-gray-500", children: dayjs(reply.createdAt).fromNow() }), _jsx("p", { className: "text-gray-700 mt-1", children: reply.content })] })] }, index))), openReply[rating._id] && (_jsx("form", { onSubmit: (e) => handleReplySubmit(e, rating._id), className: "m-4", children: _jsxs("div", { className: "mt-4", children: [_jsx("textarea", { name: "content", value: replyForm[rating._id]?.content || "", onChange: (e) => handleReplyChange(e, rating._id), className: "w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Nh\u1EADn x\u00E9t c\u1EE7a b\u1EA1n v\u1EC1 \u0111\u00E1nh gi\u00E1 n\u00E0y" }), _jsx("button", { className: "mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600", children: "G\u1EEDi tr\u1EA3 l\u1EDDi" })] }) }))] }))] }, rating._id))) })] })] }));
};
export default React.memo(RatingPage);
