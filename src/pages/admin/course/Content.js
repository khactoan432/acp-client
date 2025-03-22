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
import Loading from "../../../components/loading";
import PopupNotification from "../../../components/popup/notify";
// import icon react
import { CiEdit } from "react-icons/ci";
import { HiDotsVertical } from "react-icons/hi";
import { FaChevronLeft } from "react-icons/fa6";
import { FiTrash2 } from "react-icons/fi";
import { IoMdLink } from "react-icons/io";
import { HiOutlineSearch } from "react-icons/hi";
import { MdMenuBook } from "react-icons/md";
// import axios
import { postData, getData, deleteData, putData } from "../../../axios";
const { Option } = Select;
const Content = () => {
    const navigate = useNavigate();
    const { idTopic } = useParams();
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
    // state string
    const [idUpdate, setIdUpdate] = useState("");
    const [idDeleted, setIdDeleted] = useState();
    const [nameDeleted, setNameDeleted] = useState("");
    // state boolean
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [isModalUpdateExercise, setIsModalUpdateExercise] = useState(false);
    const [isFetchData, setIsFetchData] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [isUpdateExercise, setIsUpdateExercise] = useState({});
    //state array (store)
    const [dataLesson, setDataLesson] = useState([]);
    const [dataIdDeleted, setDataIdDeleted] = useState({
        lessons: [],
    });
    // state ref:
    const refValue = useRef(null);
    // structure
    const [structData, setStructData] = useState([
        {
            name: "name",
            placeholder: "Nhập tên bài học",
            label: "Tên bài học",
            value: "",
            type: "INPUT",
        },
        {
            name: "video",
            label: "Video",
            type: "VIDEO",
            value: [],
        },
        {
            name: "exercise",
            placeholder: "Nhập tên bài tập",
            label: "Tên bài tập",
            value: "",
            type: "INPUT",
        },
        {
            name: "link",
            placeholder: "Nhập đường dẫn bài tập",
            label: "Đường dẫn bài tập",
            value: "",
            type: "INPUT",
        },
    ]);
    const [structUpdateLesson, setStructUpdateLesson] = useState([
        {
            name: "name",
            placeholder: "Nhập tên bài học",
            label: "Tên bài học",
            value: "",
            type: "INPUT",
        },
        {
            name: "video",
            label: "Video",
            type: "VIDEO",
            value: [],
        },
    ]);
    const [structDataExercise, setStructDataExercise] = useState([
        {
            name: "name",
            placeholder: "Nhập tên bài tập",
            label: "Tên bài tập",
            value: "",
            type: "INPUT",
        },
        {
            name: "link",
            placeholder: "Nhập đường dẫn đề thi",
            label: "Đường dẫn đề thi",
            value: "",
            type: "INPUT",
        },
    ]);
    //   get data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await getData(`/api/admin/lessons/${idTopic}`, {
                    headers: {
                        Authorization: `Bearer ${header}`,
                    },
                });
                console.log("res: ", res);
                setDataLesson(res.data);
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
    // func handle checkbox
    // struct checkbox
    const [checkboxState, setCheckboxState] = useState();
    useEffect(() => {
        if (dataLesson && dataLesson.length > 0) {
            setCheckboxState({
                lv1: false,
                lv2: dataLesson.map((item) => ({
                    _id: item._id || "",
                    status: false,
                })),
                lv3: dataLesson.map((item) => ({
                    _idParent: item._id || "",
                    child: item.exercises?.map((it) => ({
                        _id: it._id || "",
                        status: false,
                    })) || [],
                })),
            });
        }
    }, [dataLesson]);
    //handle save
    const createLesson = async (data) => {
        console.log("data: ", data);
        const { name, link, exercise, video } = data;
        const dataExercise = [{ link: link, name: exercise }];
        setIsLoading(true);
        try {
            const formData = new FormData();
            video.forEach((file) => formData.append("fileVideo", file));
            formData.append("name", name);
            formData.append("status", "PRIVATE");
            const resLesson = await postData(`/api/admin/lesson/${idTopic}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${header}`,
                },
            });
            const id_lesson = resLesson.data._id;
            try {
                await postData(`/api/admin/exercise/${id_lesson}`, {
                    dataExercise,
                }, {
                    headers: { Authorization: `Bearer ${header}` },
                });
            }
            catch (error) {
                toast.error("Tạo mới bài tập!");
                console.error(`Error saving describe/overview}`, error);
            }
            toast.success("Tạo mới bài học thành công.");
        }
        catch (error) {
            toast.error("Tạo mới bài học sảy ra lỗi!");
            console.error(`Error saving describe/describe`, error);
        }
        finally {
            setIsLoading(false);
            setIsFetchData(!isFetchData);
        }
    };
    // handle edit
    const handleEditLesson = async (lesson) => {
        setIsModalUpdate(true);
        setIdUpdate(lesson._id);
        const updatedStructData = structUpdateLesson.map((field) => {
            if (lesson.hasOwnProperty(field.name)) {
                return {
                    ...field,
                    value: lesson[field.name],
                };
            }
            return field;
        });
        setStructUpdateLesson(updatedStructData);
    };
    const updateLesson = async (data) => {
        const idIntro = idUpdate;
        const { name, video } = data;
        setIsLoading(true);
        try {
            const formData = new FormData();
            if (video !== data.old_video.value) {
                video.forEach((file) => formData.append("fileVideo", file));
            }
            else {
                formData.append("video", video);
            }
            formData.append("name", name);
            const res = await putData(`/api/admin/lesson/${idIntro}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${header}`,
                },
            });
            toast.success("Cập nhật bài học thành công.");
        }
        catch (error) {
            toast.error("Cập nhật bài học sảy ra lỗi!");
            console.error(`Error saving describe/describe`, error);
        }
        finally {
            setIsLoading(false);
            setIsFetchData(!isFetchData);
            setIdUpdate("");
        }
    };
    const handleEditExercise = (exercise) => {
        setIsModalUpdateExercise(true);
        setIdUpdate(exercise._id);
        const updatedStructData = structDataExercise.map((field) => {
            if (exercise.hasOwnProperty(field.name)) {
                return {
                    ...field,
                    value: exercise[field.name],
                };
            }
            return field;
        });
        setStructDataExercise(updatedStructData);
    };
    const updateExercise = async (data) => {
        const { name, link } = data;
        const id = idUpdate;
        setIsLoading(true);
        try {
            console.log("id: ", id);
            const res = await putData(`/api/admin/exercise/${id}`, {
                name,
                link,
            }, {
                headers: { Authorization: `Bearer ${header}` },
            });
            toast.success("Cập nhậ bài tập thành công.");
            setIsModalUpdateExercise(false);
        }
        catch (e) {
            toast.error("Cập nhật đề thi thất bại", e.message);
        }
        finally {
            setIsLoading(false);
            setIsFetchData(!isFetchData);
            setIsUpdateExercise({});
            setIdUpdate("");
        }
    };
    // handle delete
    const deleteLesson = async () => {
        setIsLoading(true);
        const id_Deleted = idDeleted && idDeleted.lessons;
        if (!id_Deleted) {
            console.error("idDeleted is undefined");
            return;
        }
        try {
            if (Array.isArray(id_Deleted) && id_Deleted.length > 0) {
                for (const id of id_Deleted) {
                    if (id._id) {
                        const deleteRes = await deleteData(`/api/admin/lesson/${id._id}`, {
                            headers: { Authorization: `Bearer ${header}` },
                        });
                    }
                    else if (typeof id === "string") {
                        const deleteRes = await deleteData(`/api/admin/lesson/${id}`, {
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
            toast.error("Xoá mô tả không thành công, ", err.message);
            console.error(`Error deleting describe`, err);
        }
        finally {
            setIsLoading(false);
            setIsFetchData(!isFetchData);
            setIsModalVisible(false);
            setIdDeleted(undefined);
            setDataIdDeleted({ lessons: [] });
        }
    };
    // const deleteExercise = async () => {
    //   const id_Deleted = idDeleted && idDeleted.lessons;
    //   console.log("delete here: ", id_Deleted);
    //   if (!id_Deleted) {
    //     console.error("idDeleted is undefined");
    //     return;
    //   }
    //   setIsLoading(true);
    //   try {
    //     if (Array.isArray(id_Deleted) && id_Deleted.length > 0) {
    //       for (const arrDelete of id_Deleted) {
    //         for (const id of arrDelete.exercises) {
    //           const deleteRes = await deleteData(
    //             `/api/admin/overview/${id._id}`,
    //             {
    //               headers: { Authorization: `Bearer ${header}` },
    //             }
    //           );
    //         }
    //       }
    //       toast.success("Xoá các exercises thành công!");
    //     } else {
    //       toast.warning("Xảy ra lỗi khi xoá exercises!");
    //     }
    //   } catch (error) {
    //     toast.error("Xoá mô tả không thành công, " + error.message);
    //     console.error(`Error deleting overview`, error);
    //   } finally {
    //     setIsLoading(false);
    //     setIsModalVisible(false);
    //     setIsFetchData(!isFetchData);
    //     setIdDeleted(undefined);
    //     setDataIdDeleted({ lessons: [] });
    //   }
    // };
    const deleteFunc = () => {
        if (nameDeleted === "exercises") {
            // deleteExercise();
        }
        else if (nameDeleted === "lessons") {
            deleteLesson();
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
    // hành động hàng loạt
    const handleSelectActionMany = (value) => {
        if (value === "lessons") {
            const arrId = dataIdDeleted;
            notifyDelete("lessons", arrId);
        }
        else {
            const arrId = dataIdDeleted;
            notifyDelete("exercises", arrId);
        }
    };
    const handleCheckboxChange = (level, curStatus, _id) => {
        setCheckboxState((prev) => {
            const newState = { ...prev };
            if (level === "lv1") {
                const allIdDelete = { ...dataIdDeleted };
                allIdDelete.lessons = [];
                // Duyệt qua dataLesson để lấy _id của từng describe và overview
                dataLesson.forEach((lesson) => {
                    if (!curStatus) {
                        // checked
                        const itemDesc = {
                            _id: lesson._id,
                            exercises: lesson.exercises.map((item) => ({ _id: item._id })),
                        };
                        allIdDelete.lessons.push(itemDesc);
                    }
                    else {
                        // unchecked
                        allIdDelete.lessons = [];
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
                    const itemDesc = dataLesson.find((desc) => desc._id === _id);
                    if (itemDesc && itemDesc.exercises) {
                        const exitDesc = allIdDelete.lessons.find((item) => item._id === _id);
                        if (!exitDesc) {
                            const newItemDesc = {
                                _id: _id,
                                exercises: itemDesc.exercises.map((item) => ({
                                    _id: item._id,
                                })),
                            };
                            allIdDelete.lessons.push(newItemDesc);
                        }
                        else {
                            const itemOverviews = dataLesson.find((item) => item._id === _id)?.exercises;
                            if (itemOverviews) {
                                const targetDesc = allIdDelete.lessons.find((item) => item._id === _id);
                                const arrID = itemOverviews.map((item) => ({ _id: item._id }));
                                if (targetDesc) {
                                    targetDesc.exercises = arrID;
                                }
                            }
                        }
                    }
                }
                else {
                    // unchecked
                    allIdDelete.lessons = allIdDelete.lessons.filter((item) => item._id !== _id);
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
                const foundDesc = dataLesson.find((desc) => desc.exercises &&
                    desc.exercises.some((overview) => overview._id === _id));
                if (!curStatus) {
                    // checked
                    // find _id of describe with _id exercises
                    const _idDesc = foundDesc ? foundDesc._id : undefined;
                    if (foundDesc && foundDesc.exercises) {
                        const itemDesc = {
                            _id: _idDesc,
                            exercises: [],
                        };
                        if (!allIdDelete.lessons.find((item) => item._id === _idDesc)) {
                            allIdDelete.lessons.push(itemDesc);
                            const targetDesc = allIdDelete.lessons.find((item) => item._id === _idDesc);
                            if (targetDesc) {
                                targetDesc.exercises.push({ _id });
                            }
                        }
                        else {
                            const targetDesc = allIdDelete.lessons.find((item) => item._id === _idDesc);
                            if (targetDesc) {
                                targetDesc.exercises.push({ _id });
                            }
                        }
                    }
                }
                else {
                    // unchecked
                    if (foundDesc) {
                        const targetDesc = allIdDelete.lessons.find((item) => item._id === foundDesc._id);
                        if (targetDesc) {
                            // Lọc bỏ phần tử trong exercises có _id === _id
                            targetDesc.exercises = targetDesc.exercises.filter((exercise) => exercise._id !== _id);
                            // Gán lại lessons với đối tượng đã được cập nhật
                            allIdDelete.lessons = allIdDelete.lessons.map((item) => item._id === foundDesc._id ? targetDesc : item);
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
    const toggleUpdateExercise = (id) => {
        setIsUpdateExercise((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };
    // hanle search
    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        setFilteredData(dataLesson);
    }, [dataLesson]);
    const handleSearch = (e) => {
        const term = e.target.value;
        // Gọi hàm search
        const results = SearchInput(dataLesson, term, [
            "name",
            "exercises.link",
            "exercises.name",
        ]);
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
                return a.name.localeCompare(b.name);
            }
            else if (order === "desc_descs") {
                setIsAZDesc(true);
                return b.name.localeCompare(a.name);
            }
            else if (order === "asc_overviews") {
                setIsAZOverviews(false);
                const minOverviewA = a.exercises.length
                    ? Math.min(...a.exercises.map((ov) => ov.name.localeCompare("")))
                    : Infinity;
                const minOverviewB = b.exercises.length
                    ? Math.min(...b.exercises.map((ov) => ov.name.localeCompare("")))
                    : Infinity;
                return minOverviewA - minOverviewB;
            }
            else if (order === "desc_overviews") {
                setIsAZOverviews(true);
                const maxOverviewA = a.exercises.length
                    ? Math.max(...a.exercises.map((ov) => ov.name.localeCompare("")))
                    : -Infinity;
                const maxOverviewB = b.exercises.length
                    ? Math.max(...b.exercises.map((ov) => ov.name.localeCompare("")))
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
                const minTimeA = Math.min(...a.exercises.map((ov) => new Date(ov.createdAt).getTime()));
                const minTimeB = Math.min(...b.exercises.map((ov) => new Date(ov.createdAt).getTime()));
                return minTimeA - minTimeB;
            }
            else if (order === "desc_timeoverviews") {
                setIsTimeOverviews(true);
                const maxTimeA = Math.max(...a.exercises.map((ov) => new Date(ov.createdAt).getTime()));
                const maxTimeB = Math.max(...b.exercises.map((ov) => new Date(ov.createdAt).getTime()));
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
                                        }, ghost: true, onClick: () => navigate(`/admin/courses`), children: [_jsx(FaChevronLeft, {}), "Back"] }) }), _jsxs("div", { ref: secondDivRef, className: "header_categories flex justify-between items-center bg-primary px-5 py-3 mb-2", children: [_jsx("div", { className: "left uppercase", children: _jsx("h2", { className: "font-size-20", children: "C\u00E1c b\u00E0i h\u1ECDc c\u1EE7a ch\u01B0\u01A1ng 1" }) }), _jsx("div", { className: "right uppercase", children: _jsx(Button, { className: "button-save box-shadow-btn-save", style: {
                                                    backgroundColor: "#2d3c88",
                                                    color: "white",
                                                    borderColor: "#4558b7",
                                                    borderWidth: "0.1px",
                                                }, onClick: () => setIsModalCreate(true), children: "Th\u00EAm m\u1EDBi" }) })] }), _jsxs("div", { className: "bg-primary", style: {
                                        height: `calc(${screenHeight}px - ${firstHeight}px - ${secondHeight}px - 32px)`,
                                    }, children: [_jsxs("div", { ref: thirdDivRef, className: "batch_execution flex items-center justify-between border-line-bottom px-5 py-3", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", className: "cursor-pointer w-4 h-4 mr-2", checked: checkboxState && checkboxState.lv1
                                                                ? checkboxState.lv1
                                                                : false, onChange: () => handleCheckboxChange("lv1", (checkboxState && checkboxState.lv1) || false) }), _jsxs(Select, { defaultValue: "Th\u1EF1c hi\u1EC7n h\u00E0ng lo\u1EA1t", style: { width: 180 }, onChange: handleSelectActionMany, children: [checkboxState &&
                                                                    checkboxState.lv2.some((item) => item.status === true) && _jsx(Option, { value: "lessons", children: "Xo\u00E1 t\u1EA5t c\u1EA3 m\u00F4 t\u1EA3" }), checkboxState &&
                                                                    checkboxState.lv3.some((item) => item.child?.some((childItem) => childItem.status === true)) && (_jsx(Option, { value: "exercises", children: "Xo\u00E1 t\u1EA5t c\u1EA3 exercises" }))] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MSInput, { ref: refValue, placeholder: "T\u00ECm ki\u1EBFm...", type: "text", leftIcon: HiOutlineSearch, onChangeInput: handleSearch }), _jsxs(Select, { defaultValue: "L\u1ECDc t\u00ECm ki\u1EBFm", onChange: handleSort, style: { width: 200 }, children: [isAZDesc ? (_jsx(Option, { value: "asc_descs", children: "A-Z (D)" })) : (_jsx(Option, { value: "desc_descs", children: "Z-A (D)" })), isAZOverviews ? (_jsx(Option, { value: "asc_overviews", children: "A-Z (O)" })) : (_jsx(Option, { value: "desc_overviews", children: "Z-A (O)" })), isTimeDesc ? (_jsx(Option, { value: "asc_timedescribe", children: "s\u1EDBm(D)" })) : (_jsx(Option, { value: "desc_timedescribe", children: "mu\u1ED9n((D))" })), isTimeOverviews ? (_jsx(Option, { value: "asc_timeoverviews", children: "s\u1EDBm(O)" })) : (_jsx(Option, { value: "desc_timeoverviews", children: "mu\u1ED9n((O))" }))] })] })] }), _jsx("div", { style: {
                                                height: `calc(100% - ${thirdHeight}px)`,
                                            }, className: "overflow-y-auto", children: filteredData && filteredData.length > 0 ? (filteredData.map((lesson) => (_jsxs("div", { className: "border-[0.4px] border-line-bottom px-5 py-3", children: [_jsxs("div", { className: "flex justify-between border-line-bottom", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx("input", { type: "checkbox", className: "cursor-pointer w-4 h-4 mr-2", checked: (checkboxState &&
                                                                            checkboxState.lv2.find((item) => item._id === lesson._id)?.status) ||
                                                                            false, onChange: () => handleCheckboxChange("lv2", (checkboxState &&
                                                                            checkboxState.lv2.find((item) => item._id === lesson._id)?.status) ||
                                                                            false, lesson._id) }), _jsx("div", { children: _jsx("h4", { className: "bg-secondary px-4 py-2 rounded-lg inline-block leading-[normal] font-size-16 text-white", children: lesson?.name }) })] }), _jsx("div", { className: "flex items-center justify-around min-w-[32px] mb-2 rounded-lg px-4", children: _jsx("div", { className: "flex justify-between items-center rounded-full bg-[#e1e1e1]", children: _jsxs("div", { className: "relative group p-2 icon-dots", children: [_jsx(HiDotsVertical, { className: "cursor-pointer" }), _jsxs("div", { className: "absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md p-2 z-10", style: {
                                                                                    top: "36px",
                                                                                    right: "-20px",
                                                                                }, children: [_jsxs("div", { className: "flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded", onClick: () => handleEditLesson(lesson), children: [_jsx(CiEdit, { className: "mr-2 color-edit" }), _jsx("span", { className: "text-color-primary ", style: {
                                                                                                    fontSize: "12px",
                                                                                                    minWidth: "100px",
                                                                                                }, children: "S\u1EEDa b\u00E0i h\u1ECDc" })] }), _jsxs("div", { className: "flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded", onClick: () => toggleUpdateExercise(lesson._id || "undefined"), children: [_jsx(CiEdit, { className: "mr-2 color-edit" }), _jsx("span", { className: "text-color-primary ", style: {
                                                                                                    fontSize: "12px",
                                                                                                    minWidth: "100px",
                                                                                                }, children: isUpdateExercise[lesson._id || "undefined"]
                                                                                                    ? "Huỷ sửa bài tập"
                                                                                                    : "Sửa bài tập" })] }), _jsxs("div", { className: "flex items-center justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer rounded", onClick: () => notifyDelete("lessons", {
                                                                                            lessons: [lesson._id],
                                                                                        }), children: [_jsx(FiTrash2, { className: "mr-2", style: { color: "red" } }), _jsx("span", { className: "text-color-primary ", style: {
                                                                                                    fontSize: "12px",
                                                                                                    minWidth: "100px",
                                                                                                }, children: "Xo\u00E1 b\u00E0i h\u1ECDc" })] })] }), _jsx("style", { jsx: "true", children: `
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
                              ` })] }) }) })] }), _jsx("div", { className: "mb-2", children: lesson.exercises &&
                                                            lesson?.exercises.map((exercise) => (_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "mb-2", children: [_jsx("div", { className: "", children: _jsx("video", { src: lesson.video, controls: true, style: {
                                                                                    width: "800px",
                                                                                    height: "400px",
                                                                                    marginRight: "8px",
                                                                                } }) }), _jsxs("div", { className: "flex", children: [isUpdateExercise[lesson._id || "undefined"] ? (_jsx(CiEdit, { style: {
                                                                                        fontSize: "16px",
                                                                                        width: "16px",
                                                                                        height: "16px",
                                                                                        flexShrink: 0,
                                                                                        cursor: "pointer",
                                                                                    }, onClick: () => handleEditExercise(exercise), className: "color-edit mt-1 mr-2 shake-animation" })) : (_jsx(MdMenuBook, { style: {
                                                                                        fontSize: "16px",
                                                                                        width: "16px",
                                                                                        height: "16px",
                                                                                        flexShrink: 0,
                                                                                    }, className: "text-color-secondary mt-1 mr-2" })), _jsxs("div", { children: [_jsx("p", { children: exercise.name }), _jsxs("div", { className: "flex items-center text-color-secondary hover-primary", children: [_jsx(IoMdLink, { className: "mr-2" }), _jsx("span", { className: "", children: exercise.link })] })] })] })] }) }, exercise._id))) })] }, lesson._id)))) : (_jsx("div", { children: "No data" })) })] })] }) })] }), isModalCreate && (_jsx(AdminModalV2, { action: "CREATE", isOpen: isModalCreate, onClose: () => setIsModalCreate(false), structData: structData, onSave: createLesson, title: "T\u1EA1o m\u1EDBi b\u00E0i h\u1ECDc" })), isModalUpdate && (_jsx(AdminModalV2, { action: "UPDATE", isOpen: isModalUpdate, onClose: () => setIsModalUpdate(false), structData: structUpdateLesson, onSave: updateLesson, title: "C\u1EADp nh\u1EADt b\u00E0i h\u1ECDc" })), isModalUpdateExercise && (_jsx(AdminModalV2, { action: "UPDATE", isOpen: isModalUpdateExercise, onClose: () => setIsModalUpdateExercise(false), structData: structDataExercise, onSave: updateExercise, title: "C\u1EADp nh\u1EADt b\u00E0i t\u1EADp" })), isModalVisible && (_jsx(PopupNotification, { title: "B\u1EA1n c\u00F3 ch\u1EAFc ch\u1EAFn mu\u1ED1n xo\u00E1?", status: "error", buttonText: "Xo\u00E1 ngay", onButtonClick: deleteFunc, buttonClose: handleClosePopup }))] }));
};
export default Content;
