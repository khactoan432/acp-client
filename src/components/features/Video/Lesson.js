import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Modal from 'react-modal';
// Đảm bảo root element để React Modal hoạt động chính xác
Modal.setAppElement('#root');
const Lesson = ({ url }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (_jsxs("div", { className: "relative", children: [_jsx("p", { className: 'text-sky-400 hover:text-sky-600 cursor-pointer', onClick: openModal, children: "H\u1ECDc th\u1EED" }), _jsxs(Modal, { isOpen: isModalOpen, onRequestClose: closeModal, contentLabel: "Video Popup", overlayClassName: "fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50", className: "rounded-lg w-full h-full mx-auto shadow-lg outline-none p-6 relative", children: [_jsx("button", { onClick: closeModal, className: "absolute top-4 right-4 text-white hover:text-gray-200 text-4xl", children: "\u00D7" }), _jsx("div", { className: "h-full flex justify-center items-center", children: _jsx("video", { className: "rounded-md max-w-[1024px] mx-auto my-auto", src: url, controls: true, autoPlay // Tự động phát video khi mở modal
                            : true }) })] })] }));
};
export default Lesson;
