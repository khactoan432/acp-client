import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Modal from 'react-modal';
// Đảm bảo root element để React Modal hoạt động chính xác
Modal.setAppElement('#root');
const VideoPopup = ({ url }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "relative cursor-pointer", onClick: openModal, children: [_jsx("video", { className: "rounded-md w-full h-[180px] object-cover", src: url, controls: false, muted // Tắt âm thanh
                        : true }), _jsx("div", { className: "absolute inset-0 flex justify-center items-center", children: _jsx("div", { className: "bg-white bg-opacity-80 w-16 h-16 rounded-full flex justify-center items-center shadow-lg hover:bg-opacity-100 transition duration-300", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-black", fill: "currentColor", viewBox: "0 0 16 16", children: _jsx("path", { d: "M6.271 4.055a.5.5 0 0 0-.771.422v7.046a.5.5 0 0 0 .771.422l6.482-3.523a.5.5 0 0 0 0-.844L6.271 4.055z" }) }) }) })] }), _jsxs(Modal, { isOpen: isModalOpen, onRequestClose: closeModal, contentLabel: "Video Popup", overlayClassName: "fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50", className: "rounded-lg w-full h-full mx-auto shadow-lg outline-none p-6 relative", children: [_jsx("button", { onClick: closeModal, className: "absolute top-4 right-4 text-white hover:text-gray-200 text-4xl", children: "\u00D7" }), _jsx("div", { className: "h-full flex justify-center items-center", children: _jsx("video", { className: "rounded-md max-w-[1024px] mx-auto my-auto", src: url, controls: true, autoPlay // Tự động phát video khi mở modal
                            : true }) })] })] }));
};
export default VideoPopup;
