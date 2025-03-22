import React from "react";
import "./notify.scss";
interface PopupNotificationProps {
    title: string;
    status: "success" | "error";
    buttonText?: string;
    onButtonClick?: (arg?: any) => void;
    buttonClose?: () => void;
}
declare const PopupNotification: React.FC<PopupNotificationProps>;
export default PopupNotification;
