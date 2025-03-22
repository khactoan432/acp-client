import React from "react";
interface ProtectedRouteProps {
    children: JSX.Element;
    redirectPath?: string;
    invertCheck?: boolean;
}
declare const ProtectedRoute: React.FC<ProtectedRouteProps>;
export default ProtectedRoute;
