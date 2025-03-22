import React from 'react';
interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRoles: string[];
}
declare const ProtectedRoute: React.FC<ProtectedRouteProps>;
export default ProtectedRoute;
