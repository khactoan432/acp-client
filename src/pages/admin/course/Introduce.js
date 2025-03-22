import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import ant
import { Button, Select } from "antd";
// import components
import AdminHeader from "../../../components/layout/Admin/header";
import Nav from "../../../components/layout/Admin/nav";
import AdminModalV2 from "../../../components/popup/AdminModalV2";
import SearchInput from "../../../components/input/SeachInput";
import MSInput from "../../../components/input/MsInput";
import PopupNotification from "../../../components/popup/notify";
import Loading from "../../../components/loading";
//icon react
import { CiEdit } from "react-icons/ci";
import { HiDotsVertical } from "react-icons/hi";
import { FaChevronLeft } from "react-icons/fa6";
import { FiTrash2 } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { HiOutlineSearch } from "react-icons/hi";
// import axios
import { postData, getData, deleteData, putData } from "../../../axios";
const { Option } = Select;
const Introduce = () => {
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
    // get height element
    const firstDivRef = useRef(null);
    const secondDivRef = useRef(null);
    const thirdDivRef = useRef(null);
    const [firstHeight, setFirstHeight] = useState(0);
    const [secondHeight, setSecondHeight] = useState(0);
    const [thirdHeight, setThirdHeight] = useState(0);
    useEffect(() => {
        if (firstDivRef.current) {
            setFirstHeight(firstDivRef.current.offsetHeight);
        }
        if (secondDivRef.current) {
            setSecondHeight(secondDivRef.current.offsetHeight);
        }
        if (thirdDivRef.current) {
            setThirdHeight(thirdDivRef.current.offsetHeight);
        }
    }, []);
    const navigate = useNavigate();
    const { idCourse } = useParams();
    // state string
    const [idUpdate, setIdUpdate] = useState("");
    const [idDeleted, setIdDeleted] = useState();
    const [nameDeleted, setNameDeleted] = useState("");
    //state boolean
    //state boolean
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [isModalUpdateOverview, setIsModalUpdateOverview] = useState(false);
    const [isFetchData, setIsFetchData] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [isUpdateOverview, setIsUpdateOverview] = useState({});
    //state file []
    //state array (store)
    const [dataDesc, setDataDesc] = useState([]);
    const [dataIdDeleted, setDataIdDeleted] = useState({
        describes: [],
    });
    // state ref:
    const refValue = useRef(null);
    // structure
    const [structData, setStructData] = useState([
        {
            name: "desc",
            placeholder: "Nhập tiêu đề mô tả",
            label: "Mô tả video",
            value: "",
            type: "INPUT",
        },
        {
            name: "overviews",
            placeholder: "Nhập mô tả",
            label: "Thêm mô tả đề thi",
            type: "ARRAY",
            value: [],
        },
    ]);
    const [structDataOverview, setStructDataOverview] = useState([
        {
            name: "desc",
            placeholder: "Nhập mô tả",
            label: "Mô tả đề thi",
            value: "",
            type: "INPUT",
        },
    ]);
    // get data
    useEffect(() => {
        const fetchDataIntroduce = async () => {
            setIsLoading(true);
            try {
                const res = await getData(`/api/admin/course-detail/${idCourse}`, {
                    headers: {
                        Authorization: `Bearer ${header}`,
                    },
                });
                const describes = res.data.course.describes;
                setDataDesc(describes);
            }
            catch (error) {
                console.error("Error fetching data: ", error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchDataIntroduce();
    }, [isFetchData]);
    //handle save
    const createIntro = async (data) => {
        console.log("data: ", data);
        setIsLoading(true);
        const introTitle = data.desc;
        const dataList = data.overviews;
        try {
            const resDescribe = await postData("/api/admin/describe", {
                id_material: idCourse,
                type: "COURSE",
                desc: introTitle,
            }, {
                headers: { Authorization: `Bearer ${header}` },
            });
            const id_describe = resDescribe.data._id;
            for (const data of dataList) {
                const value = data.value;
                try {
                    await postData("/api/admin/overview", {
                        id_material: id_describe,
                        type: "COURSE",
                        desc: value,
                    }, {
                        headers: { Authorization: `Bearer ${header}` },
                    });
                }
                catch (error) {
                    toast.error("Tạo mới overview sảy ra lỗi!");
                    console.error(`Error saving describe/overview}`, error);
                }
            }
            toast.success("Tạo mới thành công mô tả đề thi");
        }
        catch (error) {
            toast.error("Tạo mới mô tả đề thi sảy ra lỗi!");
            console.error(`Error saving describe/describe`, error);
        }
        finally {
            setIsLoading(false);
            setIsFetchData(!isFetchData);
        }
    };
    const handleEditIntroduce = async (descs) => {
        setIsModalUpdate(true);
        setIdUpdate(descs._id);
        const updatedStructData = structData.map((field) => {
            if (descs.hasOwnProperty(field.name)) {
                if (Array.isArray(descs[field.name])) {
                    return {
                        ...field,
                        value: descs[field.name].map((item) => ({
                            desc: item.desc,
                            _id: item._id,
                        })),
                    };
                }
                return {
                    ...field,
                    value: descs[field.name],
                };
            }
            return field;
        });
        setStructData(updatedStructData);
    };
    const updateIntro = async (data) => {
        const idIntro = idUpdate;
        const introTitle = data.desc;
        const dataList = data.overviews; // _id , value
        setIsLoading(true);
        try {
            const resDescribe = await putData(`/api/admin/describe/${idIntro}`, {
                desc: introTitle,
            }, {
                headers: { Authorization: `Bearer ${header}` },
            });
            for (const data of dataList) {
                const id = data._id || "";
                const value = data.value;
                if (id && value) {
                    try {
                        const update = await putData(`/api/admin/overview/${id}`, {
                            desc: value,
                        }, {
                            headers: { Authorization: `Bearer ${header}` },
                        });
                    }
                    catch (error) {
                        toast.error("Cập nhật overview sảy ra lỗi!");
                        console.error(`Error saving describe/overview}`, error);
                    }
                }
                else if (!id && value) {
                    try {
                        const res = await postData("/api/admin/overview", {
                            id_material: idIntro,
                            type: "COURSE",
                            desc: value,
                        }, {
                            headers: { Authorization: `Bearer ${header}` },
                        });
                    }
                    catch (error) {
                        toast.error("Tạo mới overview sảy ra lỗii!");
                        console.error(`Error saving describe/overview}`, error);
                    }
                }
                else if (id && !value) {
                    try {
                        const deleteRes = await deleteData(`/api/admin/overview/${id}`, {
                            headers: { Authorization: `Bearer ${header}` },
                        });
                        toast.warning("Bạn vừa xoá overviews do không truyền dữ liệu");
                    }
                    catch (error) {
                        toast.error("Xoá overview sảy ra lỗi!");
                        console.error(`Error saving describe/overview}`, error);
                    }
                }
            }
            toast.success("Cập nhật thành công mô tả đề thi");
        }
        catch (error) {
            toast.error("Cập nhật mô tả đề thi sảy ra lỗi!");
            console.error(`Error saving describe/describe`, error);
        }
        finally {
            setIsLoading(false);
            setIsFetchData(!isFetchData);
        }
    };
    const handleEditOverview = (overview) => {
        setIsModalUpdateOverview(true);
        setIdUpdate(overview._id);
        const updatedStructData = structDataOverview.map((field) => {
            if (overview.hasOwnProperty(field.name)) {
                return {
                    ...field,
                    value: overview[field.name],
                };
            }
            return field;
        });
        setStructDataOverview(updatedStructData);
    };
    const updateOverview = async (data) => {
        setIsLoading(true);
        try {
            const desc = data.desc;
            const id = idUpdate;
            if (!desc || !id) {
                toast.warning("Vui lòng điền đầy đủ thông tin!");
                return;
            }
            const res = await putData(`/api/admin/overview/${id}`, {
                desc,
            }, {
                headers: { Authorization: `Bearer ${header}` },
            });
            toast.success("Cập nhật thành công overview");
            setIsModalUpdateOverview(false);
        }
        catch (e) {
            console.error("Error deleting overview: ", e);
            toast.error("Error deleting overview: ");
        }
        finally {
            setIsLoading(false);
            setIsFetchData(!isFetchData);
            setIsUpdateOverview({});
            setIdUpdate("");
        }
    };
    // hanle delete
    const deleteFunc = () => {
        if (nameDeleted === "overviews") {
            deleteOverview();
        }
        else if (nameDeleted === "describes") {
            deleteIntro();
        }
    };
    const notifyDelete = (name, id) => {
        const id_deleted = id;
        const nameDeleted = name;
        setNameDeleted(nameDeleted);
        setIdDeleted(id_deleted);
        setIsModalVisible(true);
    };
    const handleClosePopup = () => {
        setIsModalVisible(false);
        setIdDeleted(undefined);
    };
    const deleteIntro = async () => {
        setIsLoading(true);
        const id_Deleted = idDeleted && idDeleted.describes;
        if (!id_Deleted) {
            console.error("idDeleted is undefined");
            return;
        }
        try {
            if (Array.isArray(id_Deleted) && id_Deleted.length > 0) {
                for (const id of id_Deleted) {
                    if (id._id) {
                        const deleteRes = await deleteData(`/api/admin/describe/${id._id}`, {
                            headers: { Authorization: `Bearer ${header}` },
                        });
                    }
                    else if (typeof id === "string") {
                        const deleteRes = await deleteData(`/api/admin/describe/${id}`, {
                            headers: { Authorization: `Bearer ${header}` },
                        });
                    }
                    else {
                        toast.warning("Xảy ra lỗi khi xoá mô tả!");
                    }
                }
                toast.success("Xoá các mô tả thành công!");
            }
            else {
                toast.warning("Xảy ra lỗi khi xoá mô tả!");
            }
        }
        catch (err) {
            toast.error("Xoá mô tả không thành công, " + err.message);
            console.error(`Error deleting describe`, err);
        }
        finally {
            setIsLoading(false);
            setIsFetchData(!isFetchData);
            setIsModalVisible(false);
            setIdDeleted(undefined);
            setDataIdDeleted({ describes: [] });
        }
    };
    const deleteOverview = async () => {
        const id_Deleted = idDeleted && idDeleted.describes;
        console.log("delete here: ", id_Deleted);
        if (!id_Deleted) {
            console.error("idDeleted is undefined");
            return;
        }
        setIsLoading(true);
        try {
            if (Array.isArray(id_Deleted) && id_Deleted.length > 0) {
                for (const arrDelete of id_Deleted) {
                    for (const id of arrDelete.overviews) {
                        const deleteRes = await deleteData(`/api/admin/overview/${id._id}`, {
                            headers: { Authorization: `Bearer ${header}` },
                        });
                    }
                }
                toast.success("Xoá các overviews thành công!");
            }
            else {
                toast.warning("Xảy ra lỗi khi xoá overviews!");
            }
        }
        catch (error) {
            toast.error("Xoá mô tả không thành công, " + error.message);
            console.error(`Error deleting overview`, error);
        }
        finally {
            setIsLoading(false);
            setIsModalVisible(false);
            setIsFetchData(!isFetchData);
            setIdDeleted(undefined);
            setDataIdDeleted({ describes: [] });
        }
    };
    // hành động hàng loạt
    const handleSelectActionMany = (value) => {
        if (value === "describes") {
            const arrId = dataIdDeleted;
            notifyDelete("describes", arrId);
        }
        else {
            const arrId = dataIdDeleted;
            notifyDelete("overviews", arrId);
        }
    };
    // func handle checkbox
    // struct checkbox
    const [checkboxState, setCheckboxState] = useState();
    useEffect(() => {
        if (dataDesc && dataDesc.length > 0) {
            setCheckboxState({
                lv1: false,
                lv2: dataDesc.map((item) => ({
                    _id: item._id || "",
                    status: false,
                })),
                lv3: dataDesc.map((item) => ({
                    _idParent: item._id || "",
                    child: item.overviews?.map((it) => ({
                        _id: it._id || "",
                        status: false,
                    })) || [],
                })),
            });
        }
    }, [dataDesc]);
    const handleCheckboxChange = (level, curStatus, _id) => {
        setCheckboxState((prev) => {
            const newState = { ...prev };
            if (level === "lv1") {
                const allIdDelete = { ...dataIdDeleted };
                allIdDelete.describes = [];
                // Duyệt qua dataDesc để lấy _id của từng describe và overview
                dataDesc.forEach((descs) => {
                    if (!curStatus) {
                        // checked
                        const itemDesc = {
                            _id: descs._id,
                            overviews: descs.overviews.map((item) => ({ _id: item._id })),
                        };
                        allIdDelete.describes.push(itemDesc);
                    }
                    else {
                        // unchecked
                        allIdDelete.describes = [];
                    }
                });
                // Cập nhật lại state dataIdDeleted
                setDataIdDeleted(allIdDelete);
                // Set lv1 to true
                newState.lv1 = !curStatus;
                // Set all lv2 to true
                newState.lv2 =
                    newState.lv2 &&
                        newState.lv2.map((item) => ({
                            ...item,
                            status: !curStatus,
                        }));
                // Set all lv3 child status to true
                newState.lv3 =
                    newState.lv3 &&
                        newState.lv3.map((item) => ({
                            ...item,
                            child: item.child.map((child) => ({
                                ...child,
                                status: !curStatus,
                            })),
                        }));
            }
            if (level === "lv2" && _id) {
                const allIdDelete = { ...dataIdDeleted };
                if (!curStatus) {
                    // checked
                    const itemDesc = dataDesc.find((desc) => desc._id === _id);
                    if (itemDesc && itemDesc.overviews) {
                        const exitDesc = allIdDelete.describes.find((item) => item._id === _id);
                        if (!exitDesc) {
                            const newItemDesc = {
                                _id: _id,
                                overviews: itemDesc.overviews.map((item) => ({
                                    _id: item._id,
                                })),
                            };
                            allIdDelete.describes.push(newItemDesc);
                        }
                        else {
                            const itemOverviews = dataDesc.find((item) => item._id === _id)?.overviews;
                            if (itemOverviews) {
                                const targetDesc = allIdDelete.describes.find((item) => item._id === _id);
                                const arrID = itemOverviews.map((item) => ({ _id: item._id }));
                                if (targetDesc) {
                                    targetDesc.overviews = arrID;
                                }
                            }
                        }
                    }
                }
                else {
                    // unchecked
                    allIdDelete.describes = allIdDelete.describes.filter((item) => item._id !== _id);
                }
                // Cập nhật lại dataIdDeleted
                setDataIdDeleted(allIdDelete);
                // Update only the selected lv2 item
                newState.lv2 =
                    newState.lv2 &&
                        newState.lv2.map((item) => item._id === _id ? { ...item, status: !curStatus } : item);
                newState.lv3 =
                    newState.lv3 &&
                        newState.lv3.map((item) => {
                            if (item._idParent === _id) {
                                // Update the status of lv3 for this parent
                                newState.lv2 =
                                    newState.lv2 &&
                                        newState.lv2.map((lv3Item) => lv3Item._id === _id
                                            ? { ...lv3Item, status: !curStatus }
                                            : lv3Item);
                                return {
                                    ...item,
                                    child: item.child.map((child) => ({
                                        ...child,
                                        status: !curStatus, // Update status of each child
                                    })),
                                };
                            }
                            return item; // Don't modify lv3 items with different _idParent
                        });
            }
            if (level === "lv3" && _id) {
                const allIdDelete = { ...dataIdDeleted };
                const foundDesc = dataDesc.find((desc) => desc.overviews &&
                    desc.overviews.some((overview) => overview._id === _id));
                if (!curStatus) {
                    // checked
                    // find _id of describe with _id overviews
                    const _idDesc = foundDesc ? foundDesc._id : undefined;
                    if (foundDesc && foundDesc.overviews) {
                        const itemDesc = {
                            _id: _idDesc,
                            overviews: [],
                        };
                        if (!allIdDelete.describes.find((item) => item._id === _idDesc)) {
                            allIdDelete.describes.push(itemDesc);
                            const targetDesc = allIdDelete.describes.find((item) => item._id === _idDesc);
                            if (targetDesc) {
                                targetDesc.overviews.push({ _id });
                            }
                        }
                        else {
                            const targetDesc = allIdDelete.describes.find((item) => item._id === _idDesc);
                            if (targetDesc) {
                                targetDesc.overviews.push({ _id });
                            }
                        }
                    }
                }
                else {
                    // unchecked
                    if (foundDesc) {
                        const targetDesc = allIdDelete.describes.find((item) => item._id === foundDesc._id);
                        if (targetDesc) {
                            // Lọc bỏ phần tử trong overviews có _id === _id
                            targetDesc.overviews = targetDesc.overviews.filter((overview) => overview._id !== _id);
                            // Gán lại describes với đối tượng đã được cập nhật
                            allIdDelete.describes = allIdDelete.describes.map((item) => item._id === foundDesc._id ? targetDesc : item);
                        }
                    }
                }
                // Cập nhật lại state dataIdDeleted
                setDataIdDeleted(allIdDelete);
                newState.lv3 =
                    newState.lv3 &&
                        newState.lv3.map((item) => {
                            const updatedChild = item.child.map((child) => child._id === _id
                                ? {
                                    ...child,
                                    status: !curStatus, // Toggle the status of the matched child
                                }
                                : child);
                            // Check if all lv3 child are checked
                            const allChecked = updatedChild.every((child) => child.status);
                            // If any lv3 child is unchecked, set the lv3 status to false
                            if (!allChecked) {
                                newState.lv2 =
                                    newState.lv2 &&
                                        newState.lv2.map((lv3Item) => {
                                            if (lv3Item._id === item._idParent) {
                                                return { ...lv3Item, status: false }; // Uncheck the parent lv3
                                            }
                                            return lv3Item;
                                        });
                            }
                            return { ...item, child: updatedChild };
                        });
            }
            return newState;
        });
    };
    const toggleUpdateOverview = (id) => {
        setIsUpdateOverview((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };
    // hanle search
    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        setFilteredData(dataDesc);
    }, [dataDesc]);
    const handleSearch = (e) => {
        const term = e.target.value;
        // Gọi hàm search
        const results = SearchInput(dataDesc, term, ["desc", "overviews.desc"]);
        setFilteredData(results);
    };
    // filter
    const [isAZDesc, setIsAZDesc] = useState(true);
    const [isAZOverviews, setIsAZOverviews] = useState(true);
    const [isTimeDesc, setIsTimeDesc] = useState(true);
    const [isTimeOverviews, setIsTimeOverviews] = useState(true);
    const handleSort = (order) => {
        const sortedData = [...filteredData].sort((a, b) => {
            if (order === "asc_descs") {
                setIsAZDesc(false);
                return a.desc.localeCompare(b.desc);
            }
            else if (order === "desc_descs") {
                setIsAZDesc(true);
                return b.desc.localeCompare(a.desc);
            }
            else if (order === "asc_overviews") {
                setIsAZOverviews(false);
                const minOverviewA = a.overviews.length
                    ? Math.min(...a.overviews.map((ov) => ov.desc.localeCompare("")))
                    : Infinity;
                const minOverviewB = b.overviews.length
                    ? Math.min(...b.overviews.map((ov) => ov.desc.localeCompare("")))
                    : Infinity;
                return minOverviewA - minOverviewB;
            }
            else if (order === "desc_overviews") {
                setIsAZOverviews(true);
                const maxOverviewA = a.overviews.length
                    ? Math.max(...a.overviews.map((ov) => ov.desc.localeCompare("")))
                    : -Infinity;
                const maxOverviewB = b.overviews.length
                    ? Math.max(...b.overviews.map((ov) => ov.desc.localeCompare("")))
                    : -Infinity;
                return maxOverviewB - maxOverviewA;
            }
            else if (order === "asc_timedescribe") {
                setIsTimeDesc(false);
                return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            }
            else if (order === "desc_timedescribe") {
                setIsTimeDesc(true);
                return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }
            else if (order === "asc_timeoverviews") {
                setIsTimeOverviews(false);
                const minTimeA = Math.min(...a.overviews.map((ov) => new Date(ov.createdAt).getTime()));
                const minTimeB = Math.min(...b.overviews.map((ov) => new Date(ov.createdAt).getTime()));
                return minTimeA - minTimeB;
            }
            else if (order === "desc_timeoverviews") {
                setIsTimeOverviews(true);
                const maxTimeA = Math.max(...a.overviews.map((ov) => new Date(ov.createdAt).getTime()));
                const maxTimeB = Math.max(...b.overviews.map((ov) => new Date(ov.createdAt).getTime()));
                return maxTimeB - maxTimeA;
            }
            return 0;
        });
        setFilteredData(sortedData);
    };
    if (isLoading) {
        return _jsx(Loading, { message: "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u...", size: "large" });
    }
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(Nav, {}), _jsxs("div", { className: "flex flex-col flex-1", children: [_jsx(AdminHeader, {}), _jsx("div", { className: "w-full h-full bg-white", children: _jsxs("div", { style: { height: `calc(100% - 8px)` }, className: "m-2", children: [_jsx("div", { ref: firstDivRef, className: "bg-primary px-5 py-3 mb-2", children: _jsxs(Button, { className: "button-cancel px-5 py-3", style: {
                                            backgroundColor: "white",
                                            color: "#1e2753",
                                            borderColor: "#1e2753",
                                        }, ghost: true, onClick: () => navigate(`/admin/courses`), children: [_jsx(FaChevronLeft, {}), "Back"] }) }), _jsxs("div", { ref: secondDivRef, className: "header_categories flex justify-between items-center bg-primary px-5 py-3 mb-2", children: [_jsx("div", { className: "left uppercase", children: _jsx("h2", { className: "font-size-20", children: "Gi\u1EDBi thi\u1EC7u \u0111\u1EC1 thi" }) }), _jsx("div", { className: "right uppercase", children: _jsx(Button, { className: "button-save box-shadow-btn-save", style: {
                                                    backgroundColor: "#2d3c88",
                                                    color: "white",
                                                    borderColor: "#4558b7",
                                                    borderWidth: "0.1px",
                                                }, onClick: () => setIsModalCreate(true), children: "Th\u00EAm m\u1EDBi" }) })] }), _jsxs("div", { className: "bg-primary", style: {
                                        height: `calc(${screenHeight}px - ${firstHeight}px - ${secondHeight}px - 32px)`,
                                    }, children: [_jsxs("div", { ref: thirdDivRef, className: "batch_execution flex items-center justify-between border-line-bottom px-5 py-3", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", className: "cursor-pointer w-4 h-4 mr-2", checked: checkboxState && checkboxState.lv1
                                                                ? checkboxState.lv1
                                                                : false, onChange: () => handleCheckboxChange("lv1", (checkboxState && checkboxState.lv1) || false) }), _jsxs(Select, { value: "Th\u1EF1c hi\u1EC7n h\u00E0ng lo\u1EA1t", style: { width: 180 }, onChange: handleSelectActionMany, children: [checkboxState &&
                                                                    checkboxState.lv2.some((item) => item.status === true) && _jsx(Option, { value: "describes", children: "Xo\u00E1 t\u1EA5t c\u1EA3 m\u00F4 t\u1EA3" }), checkboxState &&
                                                                    checkboxState.lv3.some((item) => item.child?.some((childItem) => childItem.status === true)) && (_jsx(Option, { value: "overviews", children: "Xo\u00E1 t\u1EA5t c\u1EA3 overviews" }))] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MSInput, { ref: refValue, placeholder: "T\u00ECm ki\u1EBFm...", type: "text", leftIcon: HiOutlineSearch, onChangeInput: handleSearch }), _jsxs(Select, { defaultValue: "L\u1ECDc t\u00ECm ki\u1EBFm", onChange: handleSort, style: { width: 200 }, children: [isAZDesc ? (_jsx(Option, { value: "asc_descs", children: "A-Z (D)" })) : (_jsx(Option, { value: "desc_descs", children: "Z-A (D)" })), isAZOverviews ? (_jsx(Option, { value: "asc_overviews", children: "A-Z (O)" })) : (_jsx(Option, { value: "desc_overviews", children: "Z-A (O)" })), isTimeDesc ? (_jsx(Option, { value: "asc_timedescribe", children: "s\u1EDBm(D)" })) : (_jsx(Option, { value: "desc_timedescribe", children: "mu\u1ED9n((D))" })), isTimeOverviews ? (_jsx(Option, { value: "asc_timeoverviews", children: "s\u1EDBm(O)" })) : (_jsx(Option, { value: "desc_timeoverviews", children: "mu\u1ED9n((O))" }))] })] })] }), _jsx("div", { style: {
                                                height: `calc(100% - ${thirdHeight}px)`,
                                            }, className: "overflow-y-auto", children: filteredData && filteredData.length > 0 ? (filteredData.map((descs) => (_jsxs("div", { className: "border-[0.4px] border-line-bottom px-5 py-3", children: [_jsxs("div", { className: "flex justify-between border-line-bottom", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx("input", { type: "checkbox", className: "cursor-pointer w-4 h-4 mr-2", checked: (checkboxState &&
                                                                            checkboxState.lv2.find((item) => item._id === descs._id)?.status) ||
                                                                            false, onChange: () => handleCheckboxChange("lv2", (checkboxState &&
                                                                            checkboxState.lv2.find((item) => item._id === descs._id)?.status) ||
                                                                            false, descs._id) }), _jsx("div", { children: _jsx("h4", { className: "bg-secondary px-4 py-2 rounded-lg inline-block leading-[normal] font-size-16 text-white", children: descs?.desc }) })] }), _jsx("div", { className: "flex items-center justify-around min-w-[32px] mb-2 rounded-lg px-4", children: _jsx("div", { className: "flex justify-between items-center rounded-full bg-[#e1e1e1]", children: _jsxs("div", { className: "relative group p-2 icon-dots", children: [_jsx(HiDotsVertical, { className: "cursor-pointer" }), _jsxs("div", { className: "absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md p-2 z-10", style: {
                                                                                    top: "36px",
                                                                                    right: "-20px",
                                                                                }, children: [_jsxs("div", { className: "flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded", onClick: () => handleEditIntroduce(descs), children: [_jsx(CiEdit, { className: "mr-2 color-edit" }), _jsx("span", { className: "text-color-primary ", style: {
                                                                                                    fontSize: "12px",
                                                                                                    minWidth: "100px",
                                                                                                }, children: "S\u1EEDa gi\u1EDBi thi\u1EC7u" })] }), _jsxs("div", { className: "flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded", onClick: () => toggleUpdateOverview(descs._id), children: [_jsx(CiEdit, { className: "mr-2 color-edit" }), _jsx("span", { className: "text-color-primary ", style: {
                                                                                                    fontSize: "12px",
                                                                                                    minWidth: "100px",
                                                                                                }, children: isUpdateOverview[descs._id]
                                                                                                    ? "Huỷ sửa overview"
                                                                                                    : "Sửa overviews" })] }), _jsxs("div", { className: "flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded", onClick: () => notifyDelete("describes", {
                                                                                            describes: [descs._id],
                                                                                        }), children: [_jsx(FiTrash2, { className: "mr-2", style: { color: "red" } }), _jsx("span", { className: "text-color-primary ", style: {
                                                                                                    fontSize: "12px",
                                                                                                    minWidth: "100px",
                                                                                                }, children: "Xo\u00E1 gi\u1EDBi thi\u1EC7u" })] }), dataIdDeleted?.describes?.find((item) => item._id === descs._id)?.overviews?.length > 0 && (_jsxs("div", { className: "flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded", onClick: () => notifyDelete("overviews", {
                                                                                            describes: [
                                                                                                dataIdDeleted.describes.find((item) => item._id === descs._id),
                                                                                            ],
                                                                                        }), children: [_jsx(FiTrash2, { className: "mr-2", style: { color: "red" } }), _jsx("span", { className: "text-color-primary ", style: {
                                                                                                    fontSize: "12px",
                                                                                                    minWidth: "100px",
                                                                                                }, children: "Xo\u00E1 m\u00F4 t\u1EA3 \u0111\u00E3 ch\u1ECDn" })] }))] }), _jsx("style", { jsx: "true", children: `
                                .group:hover::before {
                                  content: "";
                                  position: absolute;
                                  top: 32px;
                                  right: 0px;
                                  width: 96px;
                                  height: 20px;
                                  transform: translateY(-50%);
                                  z-index: 0;
                                }
                              ` })] }) }) })] }), _jsx("div", { className: "mb-2", children: descs.overviews &&
                                                            descs?.overviews.map((overview) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex mb-2", children: [isUpdateOverview[descs._id] ? (_jsx(CiEdit, { style: {
                                                                                    fontSize: "16px",
                                                                                    width: "16px",
                                                                                    height: "16px",
                                                                                    flexShrink: 0,
                                                                                    cursor: "pointer",
                                                                                }, onClick: () => handleEditOverview(overview), className: "color-edit mt-1 mr-2 shake-animation" })) : (_jsx(IoMdCheckmarkCircleOutline, { style: {
                                                                                    fontSize: "16px",
                                                                                    width: "16px",
                                                                                    height: "16px",
                                                                                    flexShrink: 0,
                                                                                }, className: "text-color-secondary mt-1 mr-2" })), _jsx("p", { children: overview.desc })] }), _jsx("div", { className: "flex flex-shrink-0 items-center justify-around min-w-[32px] mb-2 px-4", children: _jsx("div", { className: "flex justify-between items-center", children: _jsx("input", { type: "checkbox", className: "cursor-pointer w-4 h-4 mr-2", checked: (checkboxState &&
                                                                                    checkboxState.lv3
                                                                                        .find((item) => item._idParent === descs._id)
                                                                                        ?.child.find((child) => child._id === overview._id)?.status) ||
                                                                                    false, onChange: () => handleCheckboxChange("lv3", (checkboxState &&
                                                                                    checkboxState.lv3
                                                                                        .find((item) => item._idParent === descs._id)
                                                                                        ?.child.find((child) => child._id === overview._id)?.status) ||
                                                                                    false, overview._id) }) }) })] }, overview._id))) })] }, descs._id)))) : (_jsx("div", { children: "No data" })) })] })] }) })] }), isModalCreate && (_jsx(AdminModalV2, { action: "CREATE", isOpen: isModalCreate, onClose: () => setIsModalCreate(false), structData: structData, onSave: createIntro, title: "T\u1EA1o m\u1EDBi gi\u1EDBi thi\u1EC7u \u0111\u1EC1 thi" })), isModalUpdate && (_jsx(AdminModalV2, { action: "UPDATE", isOpen: isModalUpdate, onClose: () => setIsModalUpdate(false), structData: structData, onSave: updateIntro, title: "C\u1EADp nh\u00E2t gi\u1EDBi thi\u1EC7u \u0111\u1EC1 thi" })), isModalUpdateOverview && (_jsx(AdminModalV2, { action: "UPDATE", isOpen: isModalUpdateOverview, onClose: () => setIsModalUpdateOverview(false), structData: structDataOverview, onSave: updateOverview, title: "C\u1EADp nh\u1EADt overview \u0111\u1EC1 thi" })), isModalVisible && (_jsx(PopupNotification, { title: "B\u1EA1n c\u00F3 ch\u1EAFc ch\u1EAFn mu\u1ED1n xo\u00E1?", status: "error", buttonText: "Xo\u00E1 ngay", onButtonClick: deleteFunc, buttonClose: handleClosePopup }))] }));
};
export default Introduce;
