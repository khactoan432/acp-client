import React from "react";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  disabled,
  type,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className}
                  px-4 py-1.5 btn-primary  hover:bg-[#00095bbc] rounded-lg text-white focus:outline-none transition duration-200
                  ${
                    disabled ? "bg-gray-400 cursor-not-allowed opacity-50" : ""
                  }`}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
