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
const AdminBanner = () => {
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
    const [isModalCreateBanner, setIsModalCreateBanner] = useState(false);
    const [isModalUpdateBanner, setIsModalUpdateBanner] = useState(false);
    // state string
    const [idBanner, setIdBanner] = useState("");
    // state store
    const [data, setData] = useState([]);
    const [selectedContent, setSelectedContent] = useState(null);
    // get data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await getData(`/api/admin/banners`, {
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
    let columnsBanner = ["image"];
    // structure data video exam
    let dataBanner = data;
    console.log(dataBanner);
    const [structData, setStructData] = useState([]);
    useEffect(() => {
        let arrStruct = [
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
            setIsModalUpdateBanner(true);
        }
        setStructData(arrStruct);
    }, [isModalCreateBanner, selectedContent]);
    // handle create
    const funcCreate = async (data) => {
        // data: image : [File], //describe: string (chưa có)
        setIsLoading(true);
        const { image } = data;
        const formData = new FormData();
        image.forEach((file) => formData.append("fileImage", file));
        try {
            await postData(`/api/admin/banner`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${header}`,
                },
            });
            toast.success("Tạo mới banner thành công!");
        }
        catch (e) {
            toast.error("Tạo mới banner thất bại!", e.message);
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
        const { image } = data;
        const id = idBanner;
        setIsLoading(true);
        try {
            const formData = new FormData();
            if (image !== data.old_image.value) {
                image.forEach((file) => formData.append("fileImage", file));
            }
            else {
                formData.append("image", image);
            }
            await putData(`/api/admin/banner/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${header}`,
                },
            });
            toast.success("Cập nhật banner thành công!");
        }
        catch (e) {
            toast.error("Cập nhật banner thất bại!", e.message);
        }
        finally {
            setIsLoading(false);
            setIsFetchData(!isFetchData);
            setIdBanner("");
        }
    };
    // handle delete
    const funcDelete = async () => {
        setIsLoading(true);
        try {
            let listIdDeleted = Array.isArray(idBanner) ? idBanner : [idBanner];
            const results = await Promise.allSettled(listIdDeleted.map((element) => deleteData(`/api/admin/banner/${element}`, {
                headers: {
                    Authorization: `Bearer ${header}`,
                },
            })));
            const failedItems = results
                .map((result, index) => result.status === "rejected" ? listIdDeleted[index] : null)
                .filter(Boolean);
            if (failedItems.length > 0) {
                toast.error(`Xóa banner thất bại các ID ${failedItems.join(", ")}`);
            }
            else {
                toast.success("Xóa các banner thành công.");
            }
        }
        catch (e) {
            toast.error("Xóa banner thất bại!", e.message);
        }
        finally {
            setIsFetchData(!isFetchData);
            setIsLoading(false);
            setIdBanner("");
            setIsModalVisible(false);
        }
    };
    const handleActions = (type, row) => {
        if (type === "EDIT") {
            const id = row._id;
            setIdBanner(id);
            setSelectedContent(row);
        }
        if (type === "DELETE") {
            if (type === "DELETE") {
                if (Array.isArray(row)) {
                    const idDeleted = row.map((item) => item._id);
                    setIdBanner(idDeleted);
                }
                else {
                    const idOrder = row._id;
                    setIdBanner(idOrder);
                }
                setIsModalVisible(true);
            }
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
            content: "Khoá các banner",
        },
        {
            value: "UNLOCK",
            icon: _jsx(PiLockKeyOpen, {}),
            content: "Mở khoá các banner",
        },
    ];
    const handleClosePopup = () => {
        setIsModalVisible(false);
        setIdBanner("");
    };
    if (isLoading) {
        return _jsx(Loading, { message: "Loading data...", size: "large" });
    }
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(Nav, {}), _jsxs("div", { className: "flex flex-col flex-1", children: [_jsx(AdminHeader, {}), _jsx("div", { className: "w-full h-full bg-white", children: _jsxs("div", { style: { height: `calc(100% - 8px)` }, className: "m-2", children: [_jsxs("div", { ref: firstDivRef, className: "flex justify-between items-center bg-primary px-5 py-3 mb-2", children: [_jsx("div", { className: "left uppercase", children: _jsx("h2", { className: "font-size-20", children: "Danh s\u00E1ch Banner " }) }), _jsx("div", { className: "right uppercase", children: _jsx(Button, { className: "button-save box-shadow-btn-save", style: {
                                                    backgroundColor: "#2d3c88",
                                                    color: "white",
                                                    borderColor: "#4558b7",
                                                    borderWidth: "0.1px",
                                                }, onClick: () => setIsModalCreateBanner(true), children: "Th\u00EAm m\u1EDBi" }) })] }), _jsx("div", { className: "bg-primary", style: {
                                        height: `calc(${screenHeight}px - ${firstHeight}px - ${secondHeight}px - 24px)`,
                                    }, children: dataBanner && (_jsx(Table, { columns: columnsBanner, data: dataBanner, batchExecution: batchExecution, handleAction: handleActions, actions: actions })) })] }) })] }), isModalCreateBanner && (_jsx(AdminModalV2, { action: "CREATE", isOpen: isModalCreateBanner, onClose: () => {
                    setIsModalCreateBanner(false);
                }, structData: structData, onSave: funcCreate, title: "T\u1EA1o m\u1EDBi banner" })), isModalUpdateBanner && (_jsx(AdminModalV2, { action: "UPDATE", isOpen: isModalUpdateBanner, onClose: () => {
                    setIsModalUpdateBanner(false);
                    setSelectedContent(null);
                }, structData: structData, onSave: funcUpdate, title: "C\u1EADp nh\u1EADt banner" })), isModalVisible && (_jsx(PopupNotification, { title: Array.isArray(idBanner)
                    ? `Bạn có chắc chắn muốn xoá xoá các dòng dữ liệu này?`
                    : "Bạn có chắc chắn muốn xoá hàng dữ liệu này", status: "error", buttonText: "Xo\u00E1 ngay", onButtonClick: funcDelete, buttonClose: handleClosePopup }))] }));
};
export default AdminBanner;
