import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Modal, Button, Select } from "antd";
import { toast } from "react-toastify";
// imprort react icon
import { CiCirclePlus } from "react-icons/ci";
// import component
import MSInput from "../input/MsInput";
import ImageUploader from "../helps/dropImage";
// import validation
import validateInput from "../../HOC/validateInput";
import ValidateFiles from "../../HOC/validateFiles";
const { Option } = Select;
const AdminModalV2 = ({ action, isOpen, onClose, structData, onSave, title, }) => {
    const [formData, setFormData] = useState({});
    const [arrValue, setArrValue] = useState([]);
    const [uploadVideo, setUploadVideo] = useState([]);
    const [uploadImage, setUploadImage] = useState([]);
    const refValue = useRef([]);
    useEffect(() => {
        if (isOpen) {
            const initialData = {};
            structData.forEach((field) => {
                const keyName = `old_${field.name}`;
                initialData[keyName] = field.type === "ARRAY" ? [] : field.value || "";
            });
            setFormData(initialData);
            if (structData) {
                setFormData((prev) => {
                    const updatedData = {};
                    structData.forEach((field) => {
                        const keyName = `old_${field.name}`;
                        updatedData[keyName] = field;
                    });
                    return { ...prev, ...updatedData };
                });
            }
            if (action === "UPDATE") {
                const arrayFields = structData.filter((item) => item.type === "ARRAY");
                arrayFields.forEach((field) => {
                    if (field.value && Array.isArray(field.value)) {
                        const updatedArrayValues = field.value.map((val, index) => ({
                            _id: val._id ? val._id : "",
                            id: index + 1,
                            value: val.desc,
                        }));
                        setArrValue(updatedArrayValues);
                    }
                });
            }
        }
    }, [isOpen, structData, action]);
    const handleVideoUploaded = (files) => {
        setUploadVideo(files);
    };
    const handleImageUploaded = (files) => {
        setUploadImage(files);
    };
    const handleAddArrayField = () => {
        setArrValue((prev) => [...prev, { id: prev.length + 1, value: "" }]);
    };
    const [currentOption, setCurrentOption] = useState(null);
    const [selectedContent, setSelectedContent] = useState([]);
    const [selectedItemsByOption, setSelectedItemsByOption] = useState(structData.filter((item) => item.name === "type")[0]?.value || {});
    const handleSelectCategoryType = (value, option) => {
        setCurrentOption(value);
        setSelectedContent(option.content);
        if (!selectedItemsByOption[value]) {
            setSelectedItemsByOption((prev) => ({ ...prev, [value]: [] }));
        }
    };
    //--_-- Khi checkbox thay đổi
    const handleCheckbox = (event) => {
        const { checked, value } = event.target;
        setSelectedItemsByOption((prev) => {
            const currentItems = prev[currentOption] || [];
            const updatedItems = checked
                ? [...currentItems, value]
                : currentItems.filter((item) => item !== value);
            return { ...prev, [currentOption]: updatedItems };
        });
    };
    const handleSave = () => {
        // video
        const videoUpdate = structData.filter((item) => item.type === "VIDEO")[0];
        const imageUpdate = structData.filter((item) => item.type === "IMAGE")[0];
        if (videoUpdate) {
            formData.video =
                uploadVideo.length !== 0 ? uploadVideo : videoUpdate.value;
        }
        if (imageUpdate) {
            formData.image =
                uploadImage.length !== 0 ? uploadImage : imageUpdate?.value;
        }
        const isType = structData.filter((item) => item.name === "type")[0];
        if (isType) {
            const allSelectedOption = Object.entries(selectedItemsByOption).map(([type, value]) => ({
                type,
                value,
            }));
            if (allSelectedOption.length > 0) {
                formData.type = allSelectedOption;
            }
            else {
                const defaultOption = [
                    {
                        type: structData.filter((item) => item.name === "type")[0]?.value || "",
                        value: [],
                    },
                ];
                formData.type = defaultOption;
            }
        }
        const finalData = { ...formData };
        structData.forEach((field) => {
            if (field.type === "INPUT" && refValue.current[field.name]) {
                finalData[field.name] = refValue.current[field.name].getValue();
            }
        });
        // Cập nhật giá trị cho các trường kiểu ARRAY
        const arrayFields = structData.filter((item) => item.type === "ARRAY");
        // arrayFields hiện tại chỉ có 1 phần tử
        arrayFields.forEach((field) => {
            const arrayValues = arrValue.map((item, id) => ({
                _id: field.value.length > 0 && field.value[id]?._id
                    ? field.value[id]?._id
                    : "",
                value: refValue.current[`${field.name}_${id}`]?.getValue(),
            }));
            finalData[field.name] = arrayValues;
        });
        const validateForm = Object.keys(finalData)
            .filter((item) => !item.startsWith("old_"))
            .reduce((acc, key) => {
            acc[key] = finalData[key];
            return acc;
        }, {});
        if (validateForm.image && typeof validateForm.image !== "string") {
            if (!ValidateFiles([validateForm.image])) {
                toast.warning("Hình ảnh là bắt buộc!");
                return;
            }
        }
        else if (validateForm.video && typeof validateForm.video !== "string") {
            if (!ValidateFiles([validateForm.video])) {
                toast.warning("Video là bắt buộc!");
                return;
            }
        }
        else {
            Object.keys(validateForm).forEach((key) => {
                const value = validateForm[key];
                if (typeof value === "string") {
                    if (!validateInput({ [key]: value })) {
                        return;
                    }
                }
            });
        }
        onSave(finalData);
        onClose();
    };
    return (_jsx(Modal, { title: title, open: isOpen, onCancel: onClose, footer: null, width: 720, children: _jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "max-h-[560px] overflow-y-auto", children: _jsx("div", { className: "pr-1", children: _jsx("div", { className: "grid grid-cols-2 gap-4", children: structData.map((field, idex) => (_jsxs("div", { className: "flex flex-col gap-1", children: [field.type === "INPUT" && (_jsxs(_Fragment, { children: [_jsx("label", { children: field.label }), _jsx(MSInput, { ref: (el) => {
                                                    refValue.current[field.name] = el;
                                                }, placeholder: field.placeholder, type: field.typeText || "text", required: true, defaultValue: field.value || "", errorMessage: "Invalid input", className: "mb-2" })] })), field.type === "OPTION" && (_jsxs(_Fragment, { children: [_jsx("label", { children: field.label }), _jsx(Select, { defaultValue: typeof field.value === "string" ? field.value : "Chọn", style: { width: "100%" }, onChange: handleSelectCategoryType, children: field.options?.map((option, index) => (_jsx(Option, { value: option.option, content: option.value, children: option.option }, index))) }), _jsx("div", { className: "w-full h-[340px] max-h-[340px]  h-full overflow-y-auto pb-2", children: selectedContent &&
                                                    selectedContent.length > 0 &&
                                                    selectedContent.map((content, idex1) => (_jsx("div", { className: "flex items-center ml-1 mb-1", children: _jsxs("label", { children: [_jsx("input", { type: "checkbox", value: content.value, onChange: handleCheckbox, checked: selectedItemsByOption[currentOption]?.includes(content.value) || false, style: {
                                                                        transform: "scale(1.5)",
                                                                        marginRight: "8px",
                                                                    } }), content.value] }) }, idex1))) })] })), field.type === "ARRAY" && (_jsxs(_Fragment, { children: [_jsx("label", { children: field.label }), _jsx(Button, { icon: _jsx(CiCirclePlus, {}), onClick: handleAddArrayField, children: "Add New" }), arrValue.map((item, id) => (_jsx(MSInput, { ref: (el) => {
                                                    refValue.current[`${field.name}_${id}`] = el;
                                                }, placeholder: `${field.name} ${item.id}`, type: field.typeText || "text", required: true, defaultValue: item.value || "", errorMessage: "Invalid input", className: "mb-2" }, item.id)))] })), field.type === "IMAGE" && (_jsxs(_Fragment, { children: [_jsx("label", { children: field.label }), _jsx(ImageUploader, { titleBtn: "Ch\u1ECDn h\u00ECnh \u1EA3nh", typefile: "image/*", onImagesChange: handleImageUploaded, urls: field?.value ? field.value : "" })] })), field.type === "VIDEO" && (_jsxs(_Fragment, { children: [_jsx("label", { children: field.label }), _jsx(ImageUploader, { titleBtn: "Ch\u1ECDn video", typefile: "video/*", onImagesChange: handleVideoUploaded, urls: field?.value ? field.value : "" })] }))] }, idex))) }) }) }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx(Button, { className: "mr-4 button-cancel", style: {
                                backgroundColor: "white",
                                color: "#1e2753",
                                borderColor: "#1e2753",
                            }, onClick: onClose, ghost: true, children: "Hu\u1EF7" }), _jsx(Button, { className: "button-save", style: {
                                backgroundColor: "#00095b",
                                color: "white",
                                borderColor: "#00095b",
                            }, onClick: handleSave, children: action === "CREATE"
                                ? "Tạo mới"
                                : action === "UPDATE"
                                    ? "Cập nhật"
                                    : "" })] })] }) }));
};
export default AdminModalV2;
