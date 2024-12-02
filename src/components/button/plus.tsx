import React from "react";
import { IconType } from "react-icons"; // Import kiểu dữ liệu cho icon từ react-icons

interface HoverCardProps {
  content: string;
  icon: IconType;
  iconSize?: string; // Kích thước icon, có thể tùy chọn
  textSize?: string; // Kích thước content, có thể tùy chọn
  height?: string; // Chiều cao, có thể tùy chọn
  width?: string; //
  paddingLeft?: string; //
  paddingRight?: string; //
  onClick?: () => void; // Callback function khi click vào nút
}

const ButtonPlus: React.FC<HoverCardProps> = ({
  content,
  icon: Icon,
  iconSize = "text-[32px]",
  textSize = "text-[16px]",
  height = "h-[32px]",
  width = "w-[22%]",
  paddingLeft = "pl-9",
  paddingRight = "pr-4",
  onClick, // Nhận prop onClick
}) => {
  return (
    <div>
      <div
        className={`flex py-4 relative group cursor-pointer ${width}`}
        onClick={onClick} // Gắn sự kiện click tại đây
      >
        <div className="absolute z-[1] bg-[#fff6f4] rounded-full icon-plus transform transition-transform duration-300 group-hover:translate-x-4">
          <Icon className={iconSize} />
        </div>
        <div className="w-[32px] absolute"></div>
        <div
          className={`primary-color-background flex justify-center text-center items-center ${paddingLeft} ${paddingRight} ${height} relative left-[15px] transition-all duration-300
            rounded-tr-[16px] rounded-br-[16px] group-hover:rounded-[16px]`}
        >
          <h4 className={`${textSize} text-white`}>{content}</h4>
        </div>
      </div>
    </div>
  );
};

export default ButtonPlus;
