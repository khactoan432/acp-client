import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
// import { toast } from "react-toastify";
// import component
import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
const PersonalSetting = () => {
    const header = localStorage.getItem("access_token");
    const [screenHeight, setScreenHeight] = useState(window.innerHeight - 56);
    const updateScreenHeight = () => {
        setScreenHeight(window.innerHeight - 56);
    };
    useEffect(() => {
        window.addEventListener("resize", updateScreenHeight);
        return () => {
            window.removeEventListener("resize", updateScreenHeight);
        };
    }, []);
    const [firstHeight, setFirstHeight] = useState(0);
    const [secondHeight, setSeconHeight] = useState(0);
    const firstDivRef = useRef(null);
    const secondDivRef = useRef(null);
    useEffect(() => {
        if (firstDivRef.current) {
            setFirstHeight(firstDivRef.current.offsetHeight);
        }
        if (secondDivRef.current) {
            setSeconHeight(secondDivRef.current.offsetHeight);
        }
    }, []);
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(Nav, {}), _jsxs("div", { className: "flex flex-col flex-1", children: [_jsx(AdminHeader, {}), _jsx("div", { className: "w-full h-full bg-white", children: _jsxs("div", { style: { height: `calc(100% - 8px)` }, className: "m-2", children: [_jsxs("div", { ref: secondDivRef, className: "header_categories flex justify-between items-center bg-primary px-5 py-3 mb-2", children: [_jsx("div", { className: "left uppercase", children: _jsx("h2", { className: "font-size-20", children: "Thi\u1EBFt l\u1EADp c\u00E1 nh\u00E2n" }) }), _jsx("div", { className: "right uppercase" })] }), _jsx("div", { className: "bg-primary", style: {
                                        height: `calc(${screenHeight}px - ${firstHeight}px - ${secondHeight}px - 24px)`,
                                    } })] }) })] })] }));
};
export default PersonalSetting;
