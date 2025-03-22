import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
// import component
import AdminModalV2 from "../../components/popup/AdminModalV2";
import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
import Table from "../../components/table";
import Loading from "../../components/loading";
import PopupNotification from "../../components/popup/notify";
// import antd
import { Button } from "antd";
// import axios
import { postData, getData, deleteData, putData } from "../../axios";
// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { PiLockKeyLight } from "react-icons/pi";
import { PiLockKeyOpen } from "react-icons/pi";
const AdminAchievement = () => {
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
    // state boolean
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchData, setIsFetchData] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    // state string
    const [idAchivement, setIdAchivement] = useState("");
    // state store
    const [data, setData] = useState([]);
    const [selectedContent, setSelectedContent] = useState(null);
    // fetch data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await getData(`/api/admin/achievements`, {
                    headers: {
                        Authorization: `Bearer ${header}`,
                    },
                });
                setData(res.data);
            }
            catch (error) {
                console.error("Error fetching data: ", error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isFetchData]);
    let columns = ["email_user", "prize", "competition", "image"];
    // structure data video exam
    console.log(data);
    let fieldSearch = ["email_user", "prize", "competition"];
    const [structData, setStructData] = useState([]);
    useEffect(() => {
        let arrStruct = [
            {
                name: "email_user",
                placeholder: "Nhập email",
                label: "Email",
                value: "",
                type: "INPUT",
            },
            {
                name: "prize",
                placeholder: "Nhập giải thưởng",
                label: "Giải thưởng",
                value: "",
                type: "INPUT",
            },
            {
                name: "competition",
                placeholder: "Nhập tên cuộc thi",
                label: "Tên cuộc thi",
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
            arrStruct = structData.map((field) => {
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
        setStructData(arrStruct);
    }, [isModalCreate, selectedContent]);
    // handle create
    const funcCreate = async (data) => {
        // data: image : [File], //describe: string (chưa có)
        setIsLoading(true);
        const { email_user, prize, competition, image } = data;
        const formData = new FormData();
        image.forEach((file) => formData.append("fileImage", file));
        formData.append("email_user", email_user);
        formData.append("prize", prize);
        formData.append("competition", competition);
        try {
            await postData(`/api/admin/achievement`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${header}`,
                },
            });
            toast.success("Tạo mới học sinh xuất sắc thành công!");
        }
        catch (e) {
            toast.error("Tạo mới học sinh xuất sắc thất bại!", e.message);
        }
        finally {
            setIsFetchData(!isFetchData);
            setIsLoading(false);
            setIsModalVisible(false);
        }
    };
    // handle update
    const funcUpdate = async (data) => {
        //image: string | [File], //describe: string (chưa có)
        const { email_user, prize, competition, image } = data;
        const _id = idAchivement;
        setIsLoading(true);
        try {
            const formData = new FormData();
            if (image !== data.old_image.value) {
                image.forEach((file) => formData.append("fileImage", file));
            }
            else {
                formData.append("image", image);
            }
            formData.append("email_user", email_user);
            formData.append("prize", prize);
            formData.append("competition", competition);
            await putData(`/api/admin/achievement/${_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${header}`,
                },
            });
            toast.success("Cập nhật học sinh xuất sắc thất thành công!");
        }
        catch (e) {
            toast.error("Cập nhật học sinh xuất sắc thất thất bại!", e.message);
        }
        finally {
            setIsLoading(false);
            setIsFetchData(!isFetchData);
            setIdAchivement("");
        }
    };
    // handle deleteFunc
    const funcDelete = async () => {
        setIsLoading(true);
        try {
            let listIdDeleted = Array.isArray(idAchivement)
                ? idAchivement
                : [idAchivement];
            const results = await Promise.allSettled(listIdDeleted.map((element) => deleteData(`/api/admin/achievement/${element}`, {
                headers: {
                    Authorization: `Bearer ${header}`,
                },
            })));
            const failedItems = results
                .map((result, index) => result.status === "rejected" ? listIdDeleted[index] : null)
                .filter(Boolean);
            if (failedItems.length > 0) {
                toast.error(`Xóa học sinh suất sắc thất bại các ID ${failedItems.join(", ")}`);
            }
            else {
                toast.success("Xóa các học sinh xuất sắc thành công.");
            }
        }
        catch (e) {
            toast.error("Xóa học sinh xuất sắc thất thất bại!", e.message);
        }
        finally {
            setIsFetchData(!isFetchData);
            handleClosePopup();
            setIsModalVisible(false);
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
    const batchExecution = [
        {
            value: "DELETE",
            icon: _jsx(MdOutlineDeleteOutline, { style: { color: "red" } }),
            content: "Xoá hàng đã chọn",
        },
        {
            value: "LOCK",
            icon: _jsx(PiLockKeyLight, {}),
            content: "Khoá các thành thích",
        },
        {
            value: "UNLOCK",
            icon: _jsx(PiLockKeyOpen, {}),
            content: "Mở khoá thành tích",
        },
    ];
    const handleActions = (type, row) => {
        if (type === "EDIT") {
            const idAchivement = row._id;
            setIdAchivement(idAchivement);
            setSelectedContent(row);
        }
        if (type === "DELETE") {
            if (type === "DELETE") {
                if (Array.isArray(row)) {
                    const idDeleted = row.map((item) => item._id);
                    setIdAchivement(idDeleted);
                }
                else {
                    const idOrder = row._id;
                    setIdAchivement(idOrder);
                }
                setIsModalVisible(true);
            }
        }
    };
    const handleClosePopup = () => {
        setIsModalVisible(false);
        setIdAchivement("");
    };
    if (isLoading) {
        return _jsx(Loading, { message: "Loading data...", size: "large" });
    }
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(Nav, {}), _jsxs("div", { className: "flex flex-col flex-1", children: [_jsx(AdminHeader, {}), _jsxs("div", { className: "w-full h-full bg-white", children: [_jsxs("div", { style: { height: `calc(100% - 8px)` }, className: "m-2", children: [_jsxs("div", { ref: secondDivRef, className: "header_categories flex justify-between items-center bg-primary px-5 py-3 mb-2", children: [_jsx("div", { className: "left uppercase", children: _jsx("h2", { className: "font-size-20", children: "Danh s\u00E1ch h\u1ECDc sinh xu\u1EA5t s\u1EAFc" }) }), _jsx("div", { className: "right uppercase", children: _jsx(Button, { className: "button-save box-shadow-btn-save", style: {
                                                        backgroundColor: "#2d3c88",
                                                        color: "white",
                                                        borderColor: "#4558b7",
                                                        borderWidth: "0.1px",
                                                    }, onClick: () => setIsModalCreate(true), children: "Th\u00EAm m\u1EDBi" }) })] }), _jsx("div", { className: "bg-primary", style: {
                                            height: `calc(${screenHeight}px - ${firstHeight}px - ${secondHeight}px - 24px)`,
                                        }, children: data && (_jsx(Table, { columns: columns, fieldSearch: fieldSearch, data: data, batchExecution: batchExecution, handleAction: handleActions, actions: actions })) })] }), isModalCreate && (_jsx(AdminModalV2, { action: "CREATE", isOpen: isModalCreate, onClose: () => {
                                    setIsModalCreate(false);
                                }, structData: structData, onSave: funcCreate, title: "T\u1EA1o m\u1EDBi h\u1ECDc sinh xu\u1EA5t s\u1EAFc" })), isModalUpdate && (_jsx(AdminModalV2, { action: "UPDATE", isOpen: isModalUpdate, onClose: () => {
                                    setIsModalUpdate(false);
                                    setSelectedContent(null);
                                }, structData: structData, onSave: funcUpdate, title: "C\u1EADp nh\u1EADt h\u1ECDc sinh xu\u1EA5t s\u1EAFc" })), isModalVisible && (_jsx(PopupNotification, { title: Array.isArray(idAchivement)
                                    ? `Bạn có chắc chắn muốn xoá xoá các dòng dữ liệu này?`
                                    : "Bạn có chắc chắn muốn xoá hàng dữ liệu này", status: "error", buttonText: "Xo\u00E1 ngay", onButtonClick: funcDelete, buttonClose: handleClosePopup }))] })] })] }));
};
export default AdminAchievement;
