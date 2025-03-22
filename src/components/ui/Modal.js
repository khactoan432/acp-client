import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50", children: _jsxs("div", { className: "bg-white rounded-lg w-96 p-6 shadow-lg relative", children: [_jsx("button", { className: "absolute top-2 right-2 text-gray-400 hover:text-gray-600", onClick: onClose, children: "\u2716" }), title && _jsx("h2", { className: "text-xl mb-4", children: title }), _jsx("div", { children: children })] }) }));
};
export default Modal;
