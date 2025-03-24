import React from "react";
import { Modal, Button } from "antd";
import "./notify.scss";

// import react icon
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

interface PopupNotificationProps {
  title: string;
  status: "success" | "error";
  buttonText?: string;
  onButtonClick?: (arg?: any) => void;
  buttonClose?: () => void;
}

const PopupNotification: React.FC<PopupNotificationProps> = ({
  title,
  status,
  buttonText,
  onButtonClick,
  buttonClose,
}) => {
  const icon =
    status === "success" ? (
      <CheckCircleOutlined style={{ color: "green", fontSize: "24px" }} />
    ) : (
      <CloseCircleOutlined
        className="text-color-primary"
        style={{ fontSize: "24px" }}
      />
    );

  return (
    <Modal
      open={true}
      title={title}
      footer={null}
      closable={false}
      centered
      width={400}
    >
      <div style={styles.content}>
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            cursor: "pointer",
            height: "20px",
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
