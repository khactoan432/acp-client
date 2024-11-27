import React, { ReactNode } from "react";

interface TooltipProps {
  text: string; // Nội dung tooltip
  children: ReactNode; // Phần tử mà tooltip áp dụng
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group w-fit">
      {children}
      <div className="absolute w-fit bottom-full left-1/2 transform -translate-x-1/2 translate-y-2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="w-fit">{text}</p>
      </div>
    </div>
  );
};

export default Tooltip;