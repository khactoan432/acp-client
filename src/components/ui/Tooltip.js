import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Tooltip = ({ text, children }) => {
    return (_jsxs("div", { className: "relative group w-fit", children: [children, _jsx("div", { className: "absolute w-fit bottom-full left-1/2 transform -translate-x-1/2 translate-y-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx("p", { className: "w-fit", children: text }) })] }));
};
export default Tooltip;
