import React, { ReactNode } from "react";
interface TooltipProps {
    text: string;
    children: ReactNode;
}
declare const Tooltip: React.FC<TooltipProps>;
export default Tooltip;
