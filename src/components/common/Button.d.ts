import React from "react";
interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    type?: "submit" | "reset" | "button" | undefined;
}
declare const Button: React.FC<ButtonProps>;
export default Button;
