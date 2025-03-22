import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import ant
import { Button } from "antd";
// import icon
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
// import components
import AdminHeader from "../../../components/layout/Admin/header";
import Nav from "../../../components/layout/Admin/nav";
import Table from "../../../components/table";
import Loading from "../../../components/loading";
import PopupNotification from "../../../components/popup/notify";
import AdminModalV2 from "../../../components/popup/AdminModalV2";
// import icon react
import { FaChevronLeft } from "react-icons/fa6";
// import axios
import { postData, getData, deleteData, putData } from "../../../axios";
const ExamVideo = () => {
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
    const navigate = useNavigate();
    const { idExam } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchData, setIsFetchData] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalCreateVideoExam, setIsModalCreateVideoExam] = useState(false);
    const [isModalUpdateVideoExam, setIsModalUpdateVideoExam] = useState(false);
    //string
    const [idVideo, setIdVideo] = useState("");
    // store
    const [data, setData] = useState([]);
    const [selectedContent, setSelectedContent] = useState(null);
    // fetch data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await getData(`/api/admin/exam/videos/${idExam}`, {
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
    // define table header
    let columnsCourse = ["describe", "video"];
    let fieldSearch = ["describe"];
    const [structData, setStructData] = useState([]);
    useEffect(() => {
        let arrStruct = [
            {
                name: "describe",
                placeholder: "Nhập mô tả video",
                label: "Mô tả video",
                value: "",
                type: "INPUT",
            },
            {
                name: "video",
                label: "Video",
                type: "VIDEO",
                value: [],
            },
        ];
        if (selectedContent) {
            console.log("selectedContent", selectedContent);
            arrStruct = structData.map((field) => {
                if (selectedContent.hasOwnProperty(field.name)) {
                    return {
                        ...field,
                        value: selectedContent[field.name],
                    };
                }
                return field;
            });
            setIsModalUpdateVideoExam(true);
        }
        setStructData(arrStruct);
    }, [isModalCreateVideoExam, selectedContent]);
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
    // structure data video exam
    let dataExamVideo = data;
    const createVideo = async (data) => {
        // data: video : [File], describe: string
        setIsLoading(true);
        const id = idExam;
        const { describe, video } = data;
        const formData = new FormData();
        if (!id || !video || !describe) {
            console.error("Missing data");
            alert("Thiếu thông tin id || describe || video ");
            return;
        }
        // append form
        video.forEach((file) => formData.append("fileVideo", file));
        formData.append("describe", describe);
        try {
            await postData(`/api/admin/exam/video/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${header}`,
                },
            });
            toast.success("Tạo mới video đề thi thành công!");
        }
        catch (error) {
            toast.error("Tạo mới video đề thi thất bại!", error.message);
            console.error("Error saving data: ", error);
        }
        finally {
            setIsFetchData(!isFetchData);
            setIsLoading(false);
            setIsModalVisible(false);
        }
    };
    // update
    const updateVideoExam = async (data) => {
        //video: string | file, describe: string
        const id = idVideo;
        const { video, describe } = data;
        console.log("video: ", video);
        if (!id || !describe || !video) {
            alert("Thiếu thông tin id || describe || video ");
            return;
        }
        setIsLoading(true);
        try {
            const formData = new FormData();
            if (video !== data.old_video.value) {
                video.forEach((file) => formData.append("fileVideo", file));
            }
            else {
                formData.append("video", video);
            }
            formData.append("describe", describe);
            await putData(`/api/admin/exam/video/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${header}`,
                },
            });
            toast.success("Cập nhật video đề thi thành công!");
        }
        catch (e) {
            toast.error("Cập nhật video đề thi thất bại!", e.message);
            console.error(`Error updating video`, e);
        }
        finally {
            setIsLoading(false);
            setIsFetchData(!isFetchData);
            setIdVideo("");
        }
    };
    // delete
    const deleteVideo = async () => {
        setIsLoading(true);
        const id = idVideo;
        try {
            await deleteData(`/api/admin/exam/video/${id}`, {
                headers: {
                    Authorization: `Bearer ${header}`,
                },
            });
            toast.success("Xóa video đề thi thành công!");
        }
        catch (e) {
            toast.error("Xóa video đề thi thất bại!", e.message);
            console.error("Error deleting data: ", e);
        }
        finally {
            setIsFetchData(!isFetchData);
            setIsLoading(false);
            setIdVideo("");
            setIsModalVisible(false);
        }
    };
    const handleClosePopup = () => {
        setIsModalVisible(false);
        setIdVideo("");
    };
    // handle action table
    const handleActions = (type, row) => {
        if (type === "EDIT") {
            const id = row._id;
            setIdVideo(id);
            setSelectedContent(row);
        }
        if (type === "DELETE") {
            const id = row._id;
            setIdVideo(id);
            setIsModalVisible(true);
        }
    };
    if (isLoading) {
        return _jsx(Loading, { message: "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u...", size: "large" });
    }
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(Nav, {}), _jsxs("div", { className: "flex flex-col flex-1", children: [_jsx(AdminHeader, {}), _jsx("div", { className: "w-full h-full bg-white", children: _jsxs("div", { style: { height: `calc(100% - 8px)` }, className: "m-2 h-full", children: [_jsx("div", { ref: firstDivRef, className: "bg-primary px-5 py-3 mb-2", children: _jsxs(Button, { className: "button-cancel px-5 py-3", style: {
                                            backgroundColor: "white",
                                            color: "#1e2753",
                                            borderColor: "#1e2753",
                                        }, ghost: true, onClick: () => navigate(`/admin/exams`), children: [_jsx(FaChevronLeft, {}), "Back"] }) }), _jsxs("div", { ref: secondDivRef, className: "header_categories flex justify-between items-center bg-primary px-5 py-3 mb-2", children: [_jsx("div", { className: "left uppercase", children: _jsx("h2", { className: "font-size-20", children: "Video \u0111\u1EC1 thi" }) }), _jsx("div", { className: "right uppercase", children: _jsx(Button, { className: "button-save box-shadow-btn-save", style: {
                                                    backgroundColor: "#2d3c88",
                                                    color: "white",
                                                    borderColor: "#4558b7",
                                                    borderWidth: "0.1px",
                                                }, onClick: () => setIsModalCreateVideoExam(true), children: "Th\u00EAm m\u1EDBi" }) })] }), _jsx("div", { className: "bg-primary", style: {
                                        height: `calc(${screenHeight}px - ${firstHeight}px - ${secondHeight}px - 32px)`,
                                    }, children: dataExamVideo && (_jsx(Table, { columns: columnsCourse, data: dataExamVideo, handleAction: handleActions, actions: actions, fieldSearch: fieldSearch })) })] }) })] }), isModalCreateVideoExam && (_jsx(AdminModalV2, { action: "CREATE", isOpen: isModalCreateVideoExam, onClose: () => {
                    setIsModalCreateVideoExam(false);
                }, structData: structData, onSave: createVideo, title: "T\u1EA1o m\u1EDBi video" })), isModalUpdateVideoExam && (_jsx(AdminModalV2, { action: "UPDATE", isOpen: isModalUpdateVideoExam, onClose: () => {
                    setIsModalUpdateVideoExam(false);
                    setSelectedContent(null);
                }, structData: structData, onSave: updateVideoExam, title: "C\u1EADp nh\u1EADt video" })), isModalVisible && (_jsx(PopupNotification, { title: "B\u1EA1n c\u00F3 ch\u1EAFc ch\u1EAFn mu\u1ED1n xo\u00E1 video \u0111\u1EC1 thi n\u00E0y?", status: "error", buttonText: "Xo\u00E1 ngay", onButtonClick: deleteVideo, buttonClose: handleClosePopup }))] }));
};
export default ExamVideo;
