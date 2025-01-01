import { current } from "@reduxjs/toolkit";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { IconType } from "react-icons";

// Định nghĩa interface cho các phương thức của ref
interface MSInputHandle {
  focus: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  clear: () => void;
}

interface MSInputProps {
  label?: string; // Nhãn của input
  placeholder?: string;
  type: "text" | "email" | "number" | "tel"; // Loại input
  required?: boolean; // Input có bắt buộc không
  disabled?: boolean; // Input
  validate?: "email" | "phone" | "number"; // Kiểu validation
  leftIcon?: IconType; // Icon bên trái
  rightIcon?: IconType; // Icon bên phải
  errorMessage?: string; // Thông báo lỗi tùy chỉnh
  className?: string; // Thêm style tùy chỉnh
  defaultValue?: string;
}

const MSInput = forwardRef<MSInputHandle, MSInputProps>(
  (
    {
      label,
      placeholder,
      type,
      required = false,
      disabled = false,
      validate,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      errorMessage,
      className = "",
      defaultValue = "",
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string>(defaultValue);
    const [error, setError] = useState<string>("");

    // Expose các phương thức tùy chỉnh ra ngoài thông qua ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      getValue: () => value,
      setValue: (newValue: string) => {
        setValue(newValue);
        validateInput(newValue); // Validate khi set giá trị
      },
      clear: () => {
        setValue("");
        setError(""); // Xóa lỗi
      },
    }));

    // Hàm xử lý validation
    const validateInput = (inputValue: string) => {
      let validationError = "";

      if (required && !inputValue.trim()) {
        validationError = "This field is required.";
      } else if (validate === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputValue)) {
          validationError = "Please enter a valid email.";
        }
      } else if (validate === "phone") {
        const phoneRegex = /^[0-9]{10,15}$/; // Số điện thoại có 10-15 chữ số
        if (!phoneRegex.test(inputValue)) {
          validationError = "Please enter a valid phone number.";
        }
      } else if (validate === "number") {
        if (isNaN(Number(inputValue))) {
          validationError = "Please enter a valid number.";
        }
      }

      setError(validationError);
      return validationError === "";
    };

    // Xử lý khi giá trị thay đổi
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      validateInput(newValue); // Kiểm tra giá trị mới
    };
    const handleBlur = () => {
      validateInput(value);
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none primary-color-text">
              <LeftIcon />
            </div>
          )}
          <input
            ref={inputRef}
            type={type}
            placeholder={placeholder}
            onBlur={handleBlur}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              LeftIcon ? "pl-10" : ""
            } ${RightIcon ? "pr-10" : ""} ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {RightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none primary-color-text">
              <RightIcon />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{errorMessage || error}</p>
        )}
      </div>
    );
  }
);

export default MSInput;
