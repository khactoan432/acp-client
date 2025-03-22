import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AppRoutes from "./routes/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";
const App = () => {
    return (_jsxs("div", { children: [_jsx(ToastContainer, {}), _jsx(Router, { children: _jsx(AppRoutes, {}) })] }));
};
export default App;
