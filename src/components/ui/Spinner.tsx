import React from "react";

interface SpinnerProps {
  size?: string; // Kích thước spinner
  color?: string; // Màu sắc
}

const Spinner: React.FC<SpinnerProps> = ({ size = "6", color = "blue-500" }) => {
  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-${color} border-opacity-50 border-l-2 w-${size} h-${size}`}
    ></div>
  );
};

export default Spinner;