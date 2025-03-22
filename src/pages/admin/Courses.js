import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import ant
import { Button } from "antd";
// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdContentPaste } from "react-icons/md";
import { MdAttractions } from "react-icons/md";
import { PiLockKeyLight } from "react-icons/pi";
import { PiLockKeyOpen } from "react-icons/pi";
// import components
import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
import Loading from "../../components/loading";
import Table from "../../components/table";
import PopupNotification from "../../components/popup/notify";
import AdminModalV2 from "../../components/popup/AdminModalV2";
//axios
import { postData, getData, deleteData, putData } from "../../axios";
const AdminExam = () => {
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
    const navigate = useNavigate();
    // state boolen
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchData, setIsFetchData] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    // state string
    const [idCourse, setIdCourse] = useState("");
    // data store
    const [allCourse, setAllCourse] = useState([]);
    const [selectedContent, setSelectedContent] = useState(null);
    // structure
    const [structData, setStructData] = useState([]);
    useEffect(() => {
        let arrStruct = [
            {
                name: "name",
                placeholder: "Nhập tên của khoá học",
                label: "Tên khoá học",
                value: "",
                type: "INPUT",
            },
            {
                name: "price",
                placeholder: "Nhập giá",
                label: "Giá khoá học",
                value: "",
                type: "INPUT",
                typeText: "number",
            },
            {
                name: "discount",
                placeholder: "Nhập giá ưu đãi",
                label: "Giá ưu đãi",
                value: "",
                type: "INPUT",
                typeText: "number",
            },
            {
                name: "image",
                label: "Image",
                type: "IMAGE",
                value: [],
            },
            {
                name: "video",
                label: "Video",
                type: "VIDEO",
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
                if (field.name === "type") {
                    const arrValue = {};
                    selectedContent.categories.forEach((element) => {
                        arrValue[element.type] = element.value;
                    });
                    return {
                        ...field,
                        value: arrValue,
                    };
                }
                return field;
            });
            setIsModalUpdate(true);
        }
        setStructData(arrStruct);
    }, [isModalCreate, selectedContent]);
    // get data
    useEffect(() => {
        const fetchDataCourse = async () => {
            setIsLoading(true);
            try {
                const res = await getData("/api/admin/courses", {
                    headers: {
                        Authorization: `Bearer ${header}`,
                    },
                });
                if (res) {
                    console.log("data course: ", res);
                    setAllCourse(res);
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchDataCourse();
    }, [isFetchData]);
    // fake frame course
    let columnsCourse = ["name", "price", "discount", "image", "video"];
    const fieldSearch = ["name"];
    let dataCourse = allCourse;
    // hanle create
    const funcCreate = async (data) => {
        const { name, price, discount, video, image } = data;
        setIsLoading(true);
        try {
            const formData = new FormData();
            image.forEach((file) => formData.append("fileImage", file));
            video.forEach((file) => formData.append("fileVideo", file));
            formData.append("name", name);
            formData.append("price", price);
            formData.append("discount", discount);
            await postData("/api/admin/course", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${header}`,
                },
            });
            toast.success("Tạo mới khoá học thành công.");
        }
        catch (err) {
            toast.error("Tạo mới khóa học thất bại!", err.message);
            console.error("Error saving course:", err);
        }
        finally {
            setIsLoading(false);
            setIsFetchData(!isFetchData);
        }
    };
    // hanle update
    const funcUpdate = async (data) => {
        const { name, price, discount, video, image } = data;
        const id = idCourse;
        setIsLoading(true);
        try {
            const formData = new FormData();
            if (video !== data.old_video.value) {
                video.forEach((file) => formData.append("fileVideo", file));
            }
            else {
                formData.append("video", video);
            }
            if (image !== data.old_image.value) {
                image.forEach((file) => formData.append("fileImage", file));
            }
            else {
                formData.append("image", image);
            }
            formData.append("name", name);
            formData.append("price", price);
            formData.append("discount", discount);
            await putData(`/api/admin/course/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${header}`,
                },
            });
            toast.success("Cập nhật khoá học thành công.");
        }
        catch (err) {
            toast.error("Cập nhật khoá học thất bại!", err.message);
            console.error("Error saving course:", err);
        }
        finally {
            setIsLoading(false);
            setIsFetchData(!isFetchData);
            setIdCourse("");
        }
    };
    // hanle delete
    const funcDelete = async () => {
        setIsLoading(true);
        try {
            let listIdDeleted = Array.isArray(idCourse) ? idCourse : [idCourse];
            const results = await Promise.allSettled(listIdDeleted.map((element) => deleteData(`/api/admin/course/${element}`, {
                headers: {
                    Authorization: `Bearer ${header}`,
                },
            })));
            const failedItems = results
                .map((result, index) => result.status === "rejected" ? listIdDeleted[index] : null)
                .filter(Boolean);
            if (failedItems.length > 0) {
                toast.error(`Xóa khoá học thất bại các ID ${failedItems.join(", ")}`);
            }
            else {
                toast.success("Xóa các khoá học thành công.");
            }
        }
        catch (err) {
            toast.error("Xóa khoá học thất bại!", err.message);
            console.log("Error deleting: ", err);
        }
        finally {
            setIsLoading(false);
            handleClosePopup();
            setIsFetchData(!isFetchData);
        }
    };
    // styles and action table
    const styleAction = {
        marginRight: "8px",
        padding: "4px 8px",
        borderRadius: "4px",
    };
    const actions = [
        {
            title: "Giới thiệu",
            action: "INTRODUCE",
            icon: _jsx(MdAttractions, {}),
            style: styleAction,
        },
        {
            title: "Chương học",
            action: "CONTENT",
            icon: _jsx(MdContentPaste, {}),
            style: styleAction,
        },
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
            content: "Khoá các Khoá học",
        },
        {
            value: "UNLOCK",
            icon: _jsx(PiLockKeyOpen, {}),
            content: "Mở khoá Khoá học",
        },
    ];
    // handle action
    const handleActions = (type, row) => {
        if (type === "EDIT") {
            const id = row._id;
            setIdCourse(id);
            setSelectedContent(row);
        }
        if (type === "DELETE") {
            if (type === "DELETE") {
                if (Array.isArray(row)) {
                    const idDeleted = row.map((item) => item._id);
                    setIdCourse(idDeleted);
                }
                else {
                    const idOrder = row._id;
                    setIdCourse(idOrder);
                }
                setIsModalVisible(true);
            }
        }
        if (type === "INTRODUCE") {
            navigate(`/admin/course/${row._id}/introduce`);
        }
        if (type === "CONTENT") {
            navigate(`/admin/course/${row._id}/topics`);
        }
    };
    const handleClosePopup = () => {
        setIsModalVisible(false);
        setIdCourse("");
    };
    if (isLoading) {
        return _jsx(Loading, { message: "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u...", size: "large" });
    }
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(Nav, {}), _jsxs("div", { className: "flex flex-col flex-1", children: [_jsx(AdminHeader, {}), _jsx("div", { className: "w-full h-full bg-white", children: _jsxs("div", { style: { height: `calc(100% - 8px)` }, className: "m-2", children: [_jsxs("div", { ref: firstDivRef, className: "flex justify-between items-center bg-primary px-5 py-3 mb-2", children: [_jsx("div", { className: "left uppercase", children: _jsx("h2", { className: "font-size-20", children: "Kho\u00E1 h\u1ECDc" }) }), _jsx("div", { className: "right uppercase", children: _jsx(Button, { className: "button-save box-shadow-btn-save", style: {
                                                    backgroundColor: "#2d3c88",
                                                    color: "white",
                                                    borderColor: "#4558b7",
                                                    borderWidth: "0.1px",
                                                }, onClick: () => setIsModalCreate(true), children: "Th\u00EAm m\u1EDBi" }) })] }), _jsx("div", { className: "bg-primary", style: {
                                        height: `calc(${screenHeight}px - ${firstHeight}px - 24px)`,
                                    }, children: dataCourse && (_jsx(Table, { columns: columnsCourse, fieldSearch: fieldSearch, data: dataCourse, batchExecution: batchExecution, handleAction: handleActions, actions: actions, topAcctions: "-88", filterPrice: true, isAllowEpand: true })) })] }) })] }), isModalCreate && (_jsx(AdminModalV2, { action: "CREATE", isOpen: isModalCreate, onClose: () => setIsModalCreate(false), structData: structData, onSave: funcCreate, title: "T\u1EA1o m\u1EDBi kho\u00E1 h\u1ECDc" })), isModalUpdate && (_jsx(AdminModalV2, { action: "UPDATE", isOpen: isModalUpdate, onClose: () => {
                    setIsModalUpdate(false);
                    setSelectedContent(null);
                }, structData: structData, onSave: funcUpdate, title: "C\u1EADp nh\u1EADt kho\u00E1 h\u1ECDc" })), isModalVisible && (_jsx(PopupNotification, { title: Array.isArray(idCourse)
                    ? `Bạn có chắc chắn muốn xoá xoá các dòng dữ liệu này?`
                    : "Bạn có chắc chắn muốn xoá hàng dữ liệu này", status: "error", buttonText: "Xo\u00E1 ngay", onButtonClick: funcDelete, buttonClose: handleClosePopup }))] }));
};
export default AdminExam;
