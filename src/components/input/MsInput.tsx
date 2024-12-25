import React, { forwardRef, useImperativeHandle, useRef } from "react";
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
  validate?: "email" | "phone" | "number"; // Kiểu validation
  leftIcon?: IconType; // Icon bên trái
  rightIcon?: IconType; // Icon bên phải
  errorMessage?: string; // Thông báo lỗi tùy chỉnh
  className?: string; // Thêm style tùy chỉnh
}

const MSInput = forwardRef<MSInputHandle, MSInputProps>(
  (
    {
      label,
      placeholder,
      type,
      required = false,
      validate,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      errorMessage,
      className = "",
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Expose các phương thức tùy chỉnh ra ngoài thông qua ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      getValue: () => inputRef.current?.value || "",
      setValue: (value: string) => {
        if (inputRef.current) {
          inputRef.current.value = value;
        }
      },
      clear: () => {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },
    }));

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block mb-1 text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <LeftIcon />
            </div>
          )}
          <input
            ref={inputRef}
            type={type}
            placeholder={placeholder}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              LeftIcon ? "pl-10" : ""
            } ${RightIcon ? "pr-10" : ""}`}
          />
          {RightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              <RightIcon />
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default MSInput;
