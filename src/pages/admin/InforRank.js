import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
//import component
import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
import Table from "../../components/table";
import Loading from "../../components/loading";
// import ant
import { Button } from "antd";
// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
const Ranks = () => {
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
    const firstDivRef = useRef(null);
    useEffect(() => {
        if (firstDivRef.current) {
            setFirstHeight(firstDivRef.current.offsetHeight);
        }
    }, []);
    // state boolean
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchData, setIsFetchData] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    // state string
    const [id, setId] = useState("");
    // state store
    const [data, setData] = useState([]);
    const [selectedContent, setSelectedContent] = useState(null);
    let columns = ["name", "email", "codeforce_name", "phone_number", "image"];
    // structure data video exam
    console.log(data);
    let fieldSearch = ["name", "email", "codeforce_name", "phone_number"];
    const [structData, setStructData] = useState([]);
    useEffect(() => {
        let arrStruct = [
            {
                name: "name",
                placeholder: "Nhập tên giáo viên",
                label: "Tên giáo viên",
                value: "",
                type: "INPUT",
            },
            {
                name: "email",
                placeholder: "Nhập email",
                label: "Email",
                value: "",
                type: "INPUT",
            },
            {
                name: "password",
                placeholder: "Nhập mật khẩu",
                label: "Mật khẩu",
                value: "",
                type: "INPUT",
                hidden: true,
            },
            {
                name: "repassword",
                placeholder: "Nhập lại mật khẩu",
                label: "Nhập lại mật khẩu",
                value: "",
                type: "INPUT",
                hidden: true,
            },
            {
                name: "codeforce_name",
                placeholder: "Nhập tên tài khoản codeforce",
                label: "Tên tài khoản codeforce",
                value: "",
                type: "INPUT",
            },
            {
                name: "phone_number",
                placeholder: "Nhập số điện thoại",
                label: "Số điện thoại",
                value: "",
                type: "INPUT",
            },
            {
                name: "image",
                label: "Image",
                type: "IMAGE",
                value: [],
            },
        ];
        if (selectedContent) {
            // Loại bỏ các trường `password` và `repassword` trước khi xử lý
            arrStruct = structData
                .filter((field) => field.name !== "password" && field.name !== "repassword")
                .map((field) => {
                console.log("field.name: ", field.name);
                if (selectedContent.hasOwnProperty(field.name)) {
                    return {
                        ...field,
                        value: selectedContent[field.name],
                    };
                }
                return field;
            });
            setIsModalUpdate(true);
        }
        console.log("arrStruct: ", arrStruct);
        setStructData(arrStruct);
    }, [isModalCreate, selectedContent]);
    const handleActions = (type, row) => {
        if (type === "EDIT") {
            const id = row._id;
            setId(id);
            setSelectedContent(row);
        }
        if (type === "DELETE") {
            const id = row._id;
            setId(id);
            setIsModalVisible(true);
        }
    };
    const styleAction = {
        marginRight: "8px",
        padding: "4px 8px",
        borderRadius: "4px",
    };
    const actions = [
        {
            title: "Chỉnh sửa",
            action: "EDIT",
            icon: _jsx(FaRegEdit, {}),
            style: { ...styleAction, color: "#f7bb0a" },
        },
        {
            title: "Xoá",
            action: "DELETE",
            icon: _jsx(MdOutlineDeleteOutline, {}),
            style: { ...styleAction, color: "red" },
        },
    ];
    const handleClosePopup = () => {
        setIsModalVisible(false);
        setId("");
    };
    if (isLoading) {
        return _jsx(Loading, { message: "Loading data...", size: "large" });
    }
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(Nav, {}), _jsxs("div", { className: "flex flex-col flex-1", children: [_jsx(AdminHeader, {}), _jsx("div", { className: "w-full h-full bg-white", children: _jsxs("div", { style: { height: `calc(100% - 8px)` }, className: "m-2", children: [_jsxs("div", { ref: firstDivRef, className: "flex justify-between items-center bg-primary px-5 py-3 mb-2", children: [_jsx("div", { className: "left uppercase", children: _jsx("h2", { className: "font-size-20", children: "X\u1EBFp h\u1EA1ng h\u1ECDc sinh" }) }), _jsx("div", { className: "right uppercase", children: _jsx(Button, { className: "button-save box-shadow-btn-save", style: {
                                                    backgroundColor: "#2d3c88",
                                                    color: "white",
                                                    borderColor: "#4558b7",
                                                    borderWidth: "0.1px",
                                                }, onClick: () => setIsModalCreate(true), children: "Th\u00EAm m\u1EDBi" }) })] }), _jsx("div", { className: "bg-primary", style: {
                                        height: `calc(${screenHeight}px - ${firstHeight}px - 24px)`,
                                    }, children: data && (_jsx(Table, { columns: columns, fieldSearch: fieldSearch, data: data, handleAction: handleActions, actions: actions })) })] }) })] })] }));
};
export default Ranks;
