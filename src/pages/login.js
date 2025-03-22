import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { postData } from "../axios";
import Loading from "../components/loading";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
const Login = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let redirectPath = new URLSearchParams(location.search).get("redirect");
    if (redirectPath === "/login") {
        redirectPath = "";
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await postData("/api/auth/login", {
                email: username,
                password: password,
            }, {});
            console.log("response: ", response);
            if (response.token) {
                if (redirectPath) {
                    localStorage.setItem("redirectHistory", redirectPath);
                    navigate(redirectPath);
                }
                else {
                    localStorage.removeItem("redirectHistory");
                    if (response.user.role === "ADMIN") {
                        navigate("/admin/dashboard");
                    }
                    else if (response.user.role === "TEACHER") {
                        navigate("/teacher/dashboard");
                    }
                    else {
                        navigate("/");
                    }
                }
                dispatch(setAuth({ user: response.user, access_token: response.token }));
            }
        }
        catch (error) {
            setError("Invalid username or password");
        }
        finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        }
    };
    const sigUp = () => {
        navigate("/register");
    };
    if (isLoading) {
        return _jsx(Loading, { message: "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u...", size: "large" });
    }
    return (_jsx("div", { style: { width: "100%", padding: "62px 0px" }, children: _jsxs("div", { style: styles.container, children: [_jsx("h1", { className: "text-color-secondary m-2", style: styles.title, children: "Sign In" }), _jsxs("div", { className: "flex mb-4", children: [_jsx("p", { style: { marginRight: "8px" }, children: "New to Our Product?" }), _jsx("p", { style: { ...styles.colorCreate, cursor: "pointer" }, onClick: () => sigUp(), children: "Create an Account" })] }), _jsxs("form", { onSubmit: handleSubmit, style: styles.form, children: [error && _jsx("p", { style: styles.error, children: error }), _jsx("label", { className: "text-color-secondary", children: "Email" }), _jsx("input", { type: "text", placeholder: "Username", value: username, onChange: (e) => setUsername(e.target.value), style: styles.input }), _jsx("label", { className: "text-color-secondary", children: "Password" }), _jsxs("div", { style: styles.passwordWrapper, children: [_jsx("input", { type: showPassword ? "text" : "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), style: styles.input }), _jsx("div", { style: styles.eyeIcon, onClick: () => setShowPassword(!showPassword), children: showPassword ? _jsx(FaEyeSlash, {}) : _jsx(FaEye, {}) })] }), _jsxs("div", { className: "flex items-center mb-[10px]", children: [_jsx("input", { type: "checkbox", id: "rememberMe", className: "w-[20px] h-[20px] m-2" }), _jsx("label", { htmlFor: "rememberMe", children: "Keep me signed in" })] }), _jsx("button", { className: "bg-secondary", type: "submit", style: styles.button, children: "Login" }), _jsx("p", { className: "m-4 text-[#1e5eff] text-center", style: { ...styles.colorCreate, cursor: "pointer" }, children: "Forgot your password?" })] })] }) }));
};
const styles = {
    container: {
        width: "37.5%",
        height: "536px",
        display: "flex",
        margin: "0 auto",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px",
        backgroundColor: "white",
    },
    title: {
        fontSize: "2rem",
        fontWeight: "600",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        width: "77.77%",
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        fontSize: "1rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px",
        color: "#fff",
        fontSize: "1rem",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    error: {
        color: "red",
        marginBottom: "10px",
    },
    colorCreate: {
        color: "#1E5EFF",
    },
    passwordWrapper: {
        position: "relative",
    },
    eyeIcon: {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
    },
};
export default Login;
