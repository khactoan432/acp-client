import React from "react";
import { IconType } from "react-icons";
import "./MsInput.scss";
interface MSInputHandle {
    focus: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
    clear: () => void;
}
interface MSInputProps {
    label?: string;
    placeholder?: string;
    type: "text" | "email" | "number" | "tel";
    required?: boolean;
    disabled?: boolean;
    validate?: "email" | "phone" | "number";
    leftIcon?: IconType;
    rightIcon?: IconType;
    errorMessage?: string;
    className?: string;
    defaultValue?: string;
    onChangeInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
declare const MSInput: React.ForwardRefExoticComponent<MSInputProps & React.RefAttributes<MSInputHandle>>;
export default MSInput;
