import React from "react";
import { IconType } from "react-icons";
interface HoverCardProps {
    content: string;
    icon: IconType;
    iconSize?: string;
    textSize?: string;
    height?: string;
    width?: string;
    top?: string;
    paddingLeft?: string;
    paddingRight?: string;
    onClick?: () => void;
    disabled?: boolean;
}
declare const ButtonPlus: React.FC<HoverCardProps>;
export default ButtonPlus;
