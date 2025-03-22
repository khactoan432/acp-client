import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import User from "../../../assets/user3.png";
const ProfileHeader = ({ username }) => {
    return (_jsxs("div", { className: "flex flex-col items-center bg-white py-8 relative", children: [_jsx("div", { className: "w-24 h-24 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center", children: _jsx("img", { src: User, alt: "Avatar", className: "w-full h-full rounded-full" }) }), _jsx("button", { className: "absolute top-8 right-8 bg-white p-2 rounded-full shadow-md", children: _jsx("i", { className: "fas fa-edit" }) }), _jsx("h1", { className: "text-xl mt-4", children: username })] }));
};
export default ProfileHeader;
