import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle, useRef, useState, } from "react";
// scss
import "./MsInput.scss";
const MSInput = forwardRef(({ label, placeholder, type, required = false, disabled = false, validate, leftIcon: LeftIcon, rightIcon: RightIcon, errorMessage, className = "", defaultValue = "", onChangeInput, }, ref) => {
    const inputRef = useRef(null);
    const [value, setValue] = useState(defaultValue);
    const [error, setError] = useState("");
    // Expose các phương thức tùy chỉnh ra ngoài thông qua ref
    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        },
        getValue: () => value,
        setValue: (newValue) => {
            setValue(newValue);
            validateInput(newValue); // Validate khi set giá trị
        },
        clear: () => {
            setValue("");
            setError(""); // Xóa lỗi
        },
    }));
    // Hàm xử lý validation
    const validateInput = (inputValue) => {
        let validationError = "";
        if (required && !inputValue.trim()) {
            validationError = "This field is required.";
        }
        else if (validate === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(inputValue)) {
                validationError = "Please enter a valid email.";
            }
        }
        else if (validate === "phone") {
            const phoneRegex = /^[0-9]{10,15}$/; // Số điện thoại có 10-15 chữ số
            if (!phoneRegex.test(inputValue)) {
                validationError = "Please enter a valid phone number.";
            }
        }
        else if (validate === "number") {
            if (isNaN(Number(inputValue))) {
                validationError = "Please enter a valid number.";
            }
        }
        setError(validationError);
        return validationError === "";
    };
    // Xử lý khi giá trị thay đổi
    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        validateInput(newValue); // Kiểm tra giá trị mới
        if (onChangeInput) {
            onChangeInput(e);
        }
    };
    const handleBlur = () => {
        validateInput(value);
    };
    return (_jsxs("div", { className: `w-full ${className}`, children: [label && (_jsx("label", { className: "block mb-1 text-sm font-medium text-gray-700", children: label })), _jsxs("div", { className: "relative", children: [LeftIcon && (_jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-color-secondary", children: _jsx(LeftIcon, {}) })), _jsx("input", { ref: inputRef, type: type, placeholder: placeholder, onBlur: handleBlur, value: value, onChange: handleChange, disabled: disabled, className: `w-full ${!LeftIcon && !RightIcon ? "px-11px" : ""} py-1 border rounded-md ${LeftIcon ? "pl-8 pr-11px" : ""} ${RightIcon ? "pr-10 pl-11px" : ""} ${error ? "border-red-500" : "border-gray-300"}` }), RightIcon && (_jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-color-secondary", children: _jsx(RightIcon, {}) }))] }), error && (_jsx("p", { className: "mt-1 text-sm text-red-500", children: errorMessage || error }))] }));
});
export default MSInput;
