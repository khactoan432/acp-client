import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal, Button } from "antd";
import "./notify.scss";
// import react icon
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
const PopupNotification = ({ title, status, buttonText, onButtonClick, buttonClose, }) => {
    const icon = status === "success" ? (_jsx(CheckCircleOutlined, { style: { color: "green", fontSize: "24px" } })) : (_jsx(CloseCircleOutlined, { className: "text-color-primary", style: { fontSize: "24px" } }));
    return (_jsx(Modal, { open: true, title: title, footer: null, closable: false, centered: true, width: 400, children: _jsxs("div", { style: styles.content, children: [_jsx("div", { style: {
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        cursor: "pointer",
                        height: "20px",
                    }, onClick: buttonClose, children: icon }), _jsx("div", { style: styles.message, children: status === "success" ? (_jsx("p", { style: { color: "green" }, children: "Operation was successful!" })) : (_jsx("p", { style: { color: "red" }, children: "D\u1EEF li\u1EC7u kh\u00F4ng th\u1EC3 kh\u00F4i ph\u1EE5c khi xo\u00E1!" })) }), buttonText && (_jsx(Button, { className: "bg-white", style: {
                        ...styles.button,
                        color: status === "success" ? "green" : "red",
                    }, onClick: onButtonClick, children: buttonText }))] }) }));
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
