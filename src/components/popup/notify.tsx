import React from "react";
import { Modal, Button } from "antd"; // Bạn có thể dùng Ant Design để hiển thị modal
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"; // Dùng các icon có sẵn của Ant Design

interface PopupNotificationProps {
  title: string;
  status: "success" | "error"; // Trạng thái: success hoặc error
  buttonText?: string; // Nội dung của button (có thể không có nếu không truyền)
  onButtonClick?: (arg?: any) => void; // Hàm khi nhấn nút button
  buttonClose?: () => void;
}

const PopupNotification: React.FC<PopupNotificationProps> = ({
  title,
  status,
  buttonText,
  onButtonClick,
  buttonClose,
}) => {
  // Cài đặt icon và màu sắc tùy thuộc vào trạng thái
  const icon =
    status === "success" ? (
      <CheckCircleOutlined style={{ color: "green", fontSize: "32px" }} />
    ) : (
      <CloseCircleOutlined style={{ color: "red", fontSize: "32px" }} />
    );

  return (
    <Modal
      visible={true}
      title={title}
      footer={null} // Không cần footer mặc định
      closable={false} // Không cho phép đóng modal bằng nút X
      centered
      width={400}
    >
      <div style={styles.content}>
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            cursor: "pointer",
          }}
          onClick={buttonClose}
        >
          {icon}
        </div>
        <div style={styles.message}>
          {status === "success" ? (
            <p style={{ color: "green" }}>Operation was successful!</p>
          ) : (
            <p style={{ color: "red" }}>Dữ liệu không thể khôi phục khi xoá!</p>
          )}
        </div>

        {/* Hiển thị button nếu có */}
        {buttonText && (
          <Button
            className="bg-white"
            style={{
              ...styles.button,
              color: status === "success" ? "green" : "red",
            }}
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </Modal>
  );
};

const styles = {
  content: {
    textAlign: "center",
    padding: "20px",
  },
  message: {
    marginTop: "10px",
    fontSize: "16px",
  },
  button: {
    marginTop: "20px",
  },
};

export default PopupNotification;
