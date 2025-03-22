import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from './Header'; // Header của user
import { Outlet } from 'react-router-dom'; // Điều này sẽ render các trang con
import Footer from './Footer';
const Layout = () => {
    return (_jsxs("div", { children: [_jsx(Header, {}), _jsx("main", { children: _jsx(Outlet, {}) }), _jsx(Footer, {})] }));
};
export default Layout;
