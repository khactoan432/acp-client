import { jsx as _jsx } from "react/jsx-runtime";
const Button = ({ onClick, children, className, disabled, type, }) => {
    return (_jsx("button", { onClick: onClick, className: `${className}
                  px-4 py-1.5 btn-primary  hover:bg-[#00095bbc] rounded-lg text-white focus:outline-none transition duration-200
                  ${disabled ? "bg-gray-400 cursor-not-allowed opacity-50" : ""}`, disabled: disabled, type: type, children: children }));
};
export default Button;
