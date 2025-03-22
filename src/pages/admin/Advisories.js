import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import AdminHeader from "../../components/layout/Admin/header";
import Nav from "../../components/layout/Admin/nav";
import Loading from "../../components/loading";
import Table from "../../components/table";
import PopupNotification from "../../components/popup/notify";
// import icon react
import { MdOutlineDeleteOutline } from "react-icons/md";
import { getData, deleteData } from "../../axios";
const Schedules = () => {
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
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchData, setIsFetchData] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    // state string
    const [idAdvisory, setIdAdvisory] = useState("");
    const [dataAdvisories, setDataAdvisories] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await getData("/api/admin/advisories", {
                    headers: {
                        Authorization: `Bearer ${header}`,
                    },
                });
                setDataAdvisories(res.data);
                console.log("res: ", res);
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
    // fake frame course
    let columnsCourse = ["name", "phone_number", "email", "mindfulness_course"];
    let data = dataAdvisories;
    let fieldSearch = ["name", "phone_number", "email", "mindfulness_course"];
    const handleDeleteAdvisory = async () => {
        setIsLoading(true);
        try {
            let listIdDeleted = Array.isArray(idAdvisory) ? idAdvisory : [idAdvisory];
            const results = await Promise.allSettled(listIdDeleted.map((element) => deleteData(`/api/admin/advisories/${element}`, {
                headers: {
                    Authorization: `Bearer ${header}`,
                },
            })));
            const failedItems = results
                .map((result, index) => result.status === "rejected" ? listIdDeleted[index] : null)
                .filter(Boolean);
            if (failedItems.length > 0) {
                toast.error(`Xóa lịch hẹn tư vấn thất bại các ID ${failedItems.join(", ")}`);
            }
            else {
                toast.success("Xóa các lịch hẹn tư vấn thành công.");
            }
        }
        catch (err) {
            console.log("Error deleting: ", err);
        }
        finally {
            setIsLoading(false);
            handleClosePopup();
            setIsFetchData(!isFetchData);
        }
    };
    const handleActions = (type, row) => {
        if (type === "DELETE") {
            if (type === "DELETE") {
                if (Array.isArray(row)) {
                    const idDeleted = row.map((item) => item._id);
                    setIdAdvisory(idDeleted);
                }
                else {
                    const idOrder = row._id;
                    setIdAdvisory(idOrder);
                }
                setIsModalVisible(true);
            }
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
    ];
    const handleClosePopup = () => {
        setIsModalVisible(false);
        setIdAdvisory("");
    };
    if (isLoading) {
        return _jsx(Loading, { message: "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u...", size: "large" });
    }
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(Nav, {}), _jsxs("div", { className: "flex flex-col flex-1", children: [_jsx(AdminHeader, {}), _jsx("div", { className: "w-full h-full bg-white", children: _jsxs("div", { style: { height: `calc(100% - 8px)` }, className: "m-2", children: [_jsxs("div", { ref: firstDivRef, className: "flex justify-between items-center bg-primary px-5 py-3 mb-2", children: [_jsx("div", { className: "left uppercase", children: _jsx("h2", { className: "font-size-20", children: "L\u1ECBch h\u1EB9n t\u01B0 v\u1EA5n" }) }), _jsx("div", { className: "right uppercase" })] }), _jsx("div", { className: "bg-primary", style: {
                                        height: `calc(${screenHeight}px - ${firstHeight}px - 24px)`,
                                    }, children: data && (_jsx(Table, { columns: columnsCourse, fieldSearch: fieldSearch, data: data, batchExecution: batchExecution, handleAction: handleActions, actions: actions })) })] }) })] }), isModalVisible && (_jsx(PopupNotification, { title: Array.isArray(idAdvisory)
                    ? `Bạn có chắc chắn muốn xoá xoá các dòng dữ liệu này?`
                    : "Bạn có chắc chắn muốn xoá hàng dữ liệu này", status: "error", buttonText: "Xo\u00E1 ngay", onButtonClick: handleDeleteAdvisory, buttonClose: handleClosePopup }))] }));
};
export default Schedules;
