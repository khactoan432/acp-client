import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "../styles/loading.scss"; // SCSS hoặc CSS file để định kiểu (xem phía dưới)
const Loading = ({ message = "", size = "medium" }) => {
    return (_jsxs("div", { className: "loading-container", children: [_jsx("div", { className: `spinner ${size}` }), message && _jsx("p", { className: "loading-message", children: message })] }));
};
export default Loading;
