import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { IconType } from "react-icons";
import "./MsInput.scss";

export interface MSInputHandle {
  focus: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  clear: () => void;
}

interface MSInputProps {
  label?: string;
  placeholder?: string;
  type: "text" | "email" | "number" | "tel" | "money";
  required?: boolean;
  disabled?: boolean;
  validate?: "email" | "phone" | "number";
  leftIcon?: IconType;
  rightIcon?: IconType;
  errorMessage?: string;
  className?: string;
  defaultValue?: string;
  onChangeInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
      onChangeInput,
      onKeyPress,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string | number>(defaultValue); // Lưu số
    const [displayValue, setDisplayValue] = useState<string>(defaultValue); // Lưu chuỗi hiển thị
    const [error, setError] = useState<string>("");

    // Hàm định dạng tiền tệ VNĐ (không bao gồm " VNĐ")
    const formatCurrency = (num: number | string): string => {
      const numValue = typeof num === "string" ? parseFloat(num) : num;
      if (isNaN(numValue)) return "";
      return numValue.toLocaleString("vi-VN");
    };

    // Parse chuỗi số (có thể có dấu chấm) về số
    const parseCurrency = (str: string): number => {
      const cleaned = str.replace(/[^\d]/g, "");
      return parseFloat(cleaned) || 0;
    };

    // Khởi tạo giá trị ban đầu
    useEffect(() => {
      if (type === "money") {
        const numValue = parseCurrency(defaultValue);
        setValue(numValue);
        setDisplayValue(formatCurrency(numValue));
      } else {
        setValue(defaultValue);
        setDisplayValue(defaultValue);
      }
    }, [defaultValue, type]);

    // Expose các phương thức qua ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      getValue: () => {
        if (type === "money") {
          return value.toString(); // Trả về số dưới dạng chuỗi (VD: "1234567")
        }
        return value.toString();
      },
      setValue: (newValue: string) => {
        if (type === "money") {
          const numValue = parseCurrency(newValue);
          setValue(numValue);
          setDisplayValue(formatCurrency(numValue));
        } else {
          setValue(newValue);
          setDisplayValue(newValue);
        }
        validateInput(newValue);
      },
      clear: () => {
        setValue("");
        setDisplayValue("");
        setError("");
      },
    }));

    // Hàm xử lý validation
    const validateInput = (inputValue: string | number) => {
      let validationError = "";
      const valueToValidate =
        type === "money" ? inputValue.toString() : inputValue;

      if (required && !valueToValidate.toString().trim()) {
        validationError = "This field is required.";
      } else if (validate === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valueToValidate.toString())) {
          validationError = "Please enter a valid email.";
        }
      } else if (validate === "phone") {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(valueToValidate.toString())) {
          validationError = "Please enter a valid phone number.";
        }
      } else if (validate === "number" || type === "money") {
        if (isNaN(Number(valueToValidate))) {
          validationError = "Please enter a valid number.";
        }
      }

      setError(validationError);
      return validationError === "";
    };

    // Xử lý khi giá trị thay đổi
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      if (type === "money") {
        // Chỉ cho phép nhập số và dấu chấm
        newValue = newValue.replace(/[^0-9]/g, "");
        const numValue = parseCurrency(newValue);
        setValue(numValue);
        setDisplayValue(newValue ? formatCurrency(numValue) : "");
      } else {
        setValue(newValue);
        setDisplayValue(newValue);
      }
      validateInput(newValue);
      if (onChangeInput) {
        onChangeInput(e);
      }
    };

    // Xử lý khi blur
    const handleBlur = () => {
      if (type === "money" && value !== "") {
        setDisplayValue(formatCurrency(value));
      }
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
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-color-secondary">
              <LeftIcon />
            </div>
          )}
          <input
            ref={inputRef}
            type={type}
            placeholder={placeholder}
            onBlur={handleBlur}
            value={displayValue}
            onChange={handleChange}
            onKeyPress={onKeyPress}
            disabled={disabled}
            className={`w-full ${
              !LeftIcon && !RightIcon && type !== "money" ? "px-11px" : ""
            } py-1 border rounded-md ${LeftIcon ? "pl-8" : ""} ${
              RightIcon || type === "money" ? "px-11px" : ""
            } ${error ? "border-red-500" : "border-gray-300"}`}
          />
          {type === "money" && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-color-secondary">
              VNĐ
            </div>
          )}
          {RightIcon && type !== "money" && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-color-secondary">
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
