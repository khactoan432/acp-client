// src/components/Loading.tsx

import React from "react";
import "../styles/loading.scss"; // SCSS hoặc CSS file để định kiểu (xem phía dưới)

interface LoadingProps {
  message?: string; // Thông báo tùy chọn khi loading
  size?: "small" | "medium" | "large"; // Kích thước của spinner
}

const Loading: React.FC<LoadingProps> = ({ message = "", size = "medium" }) => {
  return (
    <div className="loading-container">
      <div className={`spinner ${size}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loading;
