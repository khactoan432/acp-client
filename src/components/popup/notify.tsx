import React from "react";
import { Modal, Button } from "antd"; // Bạn có thể dùng Ant Design để hiển thị modal
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"; // Dùng các icon có sẵn của Ant Design

interface PopupNotificationProps {
  title: string;
  status: "success" | "error"; // Trạng thái: success hoặc error
  buttonText?: string; // Nội dung của button (có thể không có nếu không truyền)
  onButtonClick?: () => void; // Hàm khi nhấn nút button
}

const PopupNotification: React.FC<PopupNotificationProps> = ({
  title,
  status,
  buttonText,
  onButtonClick,
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
        {icon}
        <div style={styles.message}>
          {status === "success" ? (
            <p style={{ color: "green" }}>Operation was successful!</p>
          ) : (
            <p style={{ color: "red" }}>
              Something went wrong, please try again.
            </p>
          )}
        </div>

        {/* Hiển thị button nếu có */}
        {buttonText && (
          <Button
            className="btn-primary"
            onClick={onButtonClick}
            style={styles.button}
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
