import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ButtonPlus = ({ content, icon: Icon, iconSize = "text-[30px]", textSize = "text-[16px]", height = "h-[32px]", width = "w-[22%]", top = "17px", paddingLeft = "pl-9", paddingRight = "pr-4", onClick, // Nhận prop onClick
disabled = false, }) => {
    return (_jsxs("div", { className: `flex py-4 relative group cursor-pointer ${width}  ${disabled ? "cursor-not-allowed pointer-events-none" : ""}`, onClick: onClick, children: [_jsx("div", { className: `absolute top-${top} z-[1] bg-primary rounded-full icon-plus transform transition-transform duration-300 group-hover:translate-x-4`, children: _jsx(Icon, { className: iconSize, style: { color: "var(--color__secondary)" } }) }), _jsx("div", { className: "w-[32px] absolute" }), _jsx("div", { className: `btn-primary bg-secondary box-shadow-btn-save flex justify-center text-center items-center ${paddingLeft} ${paddingRight} ${height} ${disabled ? "disable-bg" : ""} relative left-[15px] transition-all duration-300
            rounded-tr-[16px] rounded-br-[16px] group-hover:rounded-[16px]`, children: _jsx("h4", { className: `${textSize} text-white`, children: content }) })] }));
};
export default ButtonPlus;
