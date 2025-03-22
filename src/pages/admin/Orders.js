import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
// import component
import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
import Table from "../../components/table";
import Loading from "../../components/loading";
import PopupNotification from "../../components/popup/notify";
// import axios
import { getData, deleteData } from "../../axios";
// import icon react
import { MdOutlineDeleteOutline } from "react-icons/md";
const AdminOrder = () => {
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
    // state string
    const [idOrder, setIdOrder] = useState("");
    // state store
    const [data, setData] = useState([]);
    // const [selectedContent, setSelectedContent] = useState<any>(null);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await getData("/api/admin/orders?type=COURSE", {
                    headers: {
                        Authorization: `Bearer ${header}`,
                    },
                });
                setData(res.data);
            }
            catch (e) {
                console.log("Error fetching data: ", e);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [isFetchData]);
    const columns = [
        "code",
        "createdAt",
        "userEmail",
        "materialName",
        "type",
        "payment_status",
        "amount",
    ];
    // structure data
    const fieldSearch = [
        "code",
        "createdAt",
        "userEmail",
        "materialName",
        "type",
        "payment_status",
    ];
    // handle action
    const handleActions = (type, row) => {
        if (type === "DELETE") {
            if (Array.isArray(row)) {
                const idDeleted = row.map((item) => item._id);
                setIdOrder(idDeleted);
            }
            else {
                const idOrder = row._id;
                setIdOrder(idOrder);
            }
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
            title: "Xoá",
            action: "DELETE",
            icon: _jsx(MdOutlineDeleteOutline, {}),
            style: { ...styleAction, color: "red" },
        },
    ];
    const batchExecution = [
        {
            value: "DELETE",
            icon: _jsx(MdOutlineDeleteOutline, {}),
            content: "Xoá hàng đã chọn",
        },
    ];
    const handleClosePopup = () => {
        setIsModalVisible(false);
        setIdOrder("");
    };
    const handleDelete = async () => {
        setIsLoading(true);
        try {
            let listIdDeleted = Array.isArray(idOrder) ? idOrder : [idOrder];
            const results = await Promise.allSettled(listIdDeleted.map((element) => deleteData(`/api/admin/order/${element}`, {
                headers: { Authorization: `Bearer ${header}` },
            })));
            // Kiểm tra lỗi
            const failedItems = results
                .map((result, index) => result.status === "rejected" ? listIdDeleted[index] : null)
                .filter(Boolean);
            if (failedItems.length > 0) {
                toast.error(`Không thể xoá các ID sau: ${failedItems.join(", ")}`);
            }
            else {
                toast.success("Xoá thành công!");
            }
        }
        catch (e) {
            toast.error("Có lỗi xảy ra khi xoá!");
            console.error(`Error deleting data`, e);
        }
        finally {
            setIsLoading(false);
            handleClosePopup();
            setIsFetchData((prev) => !prev);
        }
    };
    if (isLoading) {
        return _jsx(Loading, { message: "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u...", size: "large" });
    }
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(Nav, {}), _jsxs("div", { className: "flex flex-col flex-1", children: [_jsx(AdminHeader, {}), _jsx("div", { className: "w-full h-full bg-white", children: _jsxs("div", { style: { height: `calc(100% - 8px)` }, className: "m-2", children: [_jsxs("div", { ref: firstDivRef, className: "header_categories flex justify-between items-center bg-primary px-5 py-3 mb-2", children: [_jsx("div", { className: "left uppercase", children: _jsx("h2", { className: "font-size-20", children: "Th\u00F4ng tin kho\u00E1 h\u1ECDc \u0111\u00E3 b\u00E1n" }) }), _jsx("div", { className: "right uppercase" })] }), _jsx("div", { className: "bg-primary", style: {
                                        height: `calc(${screenHeight}px - ${firstHeight}px - 24px)`,
                                    }, children: data && (_jsx(Table, { columns: columns, fieldSearch: fieldSearch, filterPrice: true, data: data, batchExecution: batchExecution, handleAction: handleActions, actions: actions, topAcctions: "-10" })) })] }) })] }), isModalVisible && (_jsx(PopupNotification, { title: Array.isArray(idOrder)
                    ? `Bạn có chắc chắn muốn xoá xoá các dòng dữ liệu này?`
                    : "Bạn có chắc chắn muốn xoá hàng dữ liệu này", status: "error", buttonText: "Xo\u00E1 ngay", onButtonClick: () => handleDelete(), buttonClose: handleClosePopup }))] }));
};
export default AdminOrder;
