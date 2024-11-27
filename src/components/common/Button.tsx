import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      className={`${className}
                  px-4 py-2 bg-[#00095bbc] hover:bg-[#00095B] rounded-lg text-white focus:outline-none transition duration-200
                  ${disabled ? 'bg-gray-400 cursor-not-allowed opacity-50' : ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;