import { jsx as _jsx } from "react/jsx-runtime";
const Spinner = ({ size = "6", color = "blue-500" }) => {
    return (_jsx("div", { className: `animate-spin rounded-full border-t-2 border-${color} border-opacity-50 border-l-2 w-${size} h-${size}` }));
};
export default Spinner;
