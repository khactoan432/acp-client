import { jsx as _jsx } from "react/jsx-runtime";
const Button = ({ textColor = "white", bgColor = "#1777ff", text = "Click Me", minWidth = "64px", className = "", }) => {
    return (_jsx("button", { className: `px-4 py-2 rounded-lg transition hover:opacity-90 duration-300 ${className}`, style: {
            color: `${textColor}`,
            backgroundColor: `${bgColor}`,
            minWidth: `${minWidth}`,
        }, children: text }));
};
export default Button;
