import React from "react";
import "../styles/loading.scss";
interface LoadingProps {
    message?: string;
    size?: "small" | "medium" | "large";
}
declare const Loading: React.FC<LoadingProps>;
export default Loading;
