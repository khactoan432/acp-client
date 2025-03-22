import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postData } from "../axios";
import { toast } from "react-toastify";
import Loading from "../components/loading";
import PopupNotification from "../components/popup/notify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const Register = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [repassword, setRePassword] = useState("");
    const [password, setPassword] = useState("");
    const [codeforceName, setCodeforceName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errorValid, setErrorValid] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const validateForm = () => {
        if (!username) {
            setErrorValid("username");
            return false;
        }
        if (!email) {
            setErrorValid("email");
            return false;
        }
        if (!password) {
            setErrorValid("password");
            return false;
        }
        if (!repassword) {
            setErrorValid("repassword");
            return false;
        }
        if (password !== repassword) {
            setErrorValid("repassword");
            return false;
        }
        if (!phoneNumber) {
            setErrorValid("phoneNumber");
            return false;
        }
        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Validate form before sending request
        const isValid = validateForm();
        if (!isValid) {
            setIsLoading(false);
            return; // Don't proceed if the form is not valid
        }
        try {
            const header = localStorage.getItem("access_token");
            const response = await postData("/api/auth/register", {
                name: username,
                email: email,
                password: password,
                repassword: repassword,
                phone_number: phoneNumber,
                codeforce_name: codeforceName,
                role: "USER",
            }, {
                headers: {
                    Authorization: `${header}`,
                },
            });
            if (response.status === "OK") {
                toast.success("Tạo tài khoản thành công!");
                setIsModalVisible(true);
            }
        }
        catch (e) {
            console.log("aksmd: ", e);
            toast.error(e.response.data.error);
            setErrorValid("general");
        }
        finally {
            setIsLoading(false);
        }
    };
    const sigin = () => {
        navigate("/login");
    };
    if (isLoading) {
        return _jsx(Loading, { message: "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u...", size: "large" });
    }
    return (_jsxs("div", { style: { width: "100%", padding: "62px 0px" }, children: [_jsxs("div", { style: styles.container, children: [_jsx("h1", { className: "text-color-secondary m-2", style: styles.title, children: "Create an Account" }), _jsxs("div", { className: "flex mb-4", children: [_jsx("p", { style: { marginRight: "8px" }, children: "Have an account?" }), _jsx("p", { style: { ...styles.colorCreate, cursor: "pointer" }, onClick: () => sigin(), children: "Sign in" })] }), _jsxs("form", { onSubmit: handleSubmit, style: styles.form, children: [errorValid === "general" && (_jsx("p", { style: styles.error, children: "Invalid registration" })), _jsx("label", { className: "text-color-secondary", children: "Name" }), _jsx("input", { type: "text", placeholder: "Enter Your Name", value: username, onChange: (e) => setUsername(e.target.value), style: styles.input }), errorValid === "username" && (_jsx("p", { style: styles.error, children: "Name is required" })), _jsx("label", { className: "text-color-secondary", children: "Email" }), _jsx("input", { type: "text", placeholder: "Enter Email address", value: email, onChange: (e) => setEmail(e.target.value), style: styles.input }), errorValid === "email" && (_jsx("p", { style: styles.error, children: "Email is required" })), _jsx("label", { className: "text-color-secondary", children: "Password" }), _jsxs("div", { style: styles.passwordWrapper, children: [_jsx("input", { type: showPassword ? "text" : "password", placeholder: "Enter Password", value: password, onChange: (e) => setPassword(e.target.value), style: styles.input }), _jsx("div", { style: styles.eyeIcon, onClick: () => setShowPassword(!showPassword), children: showPassword ? _jsx(FaEyeSlash, {}) : _jsx(FaEye, {}) })] }), errorValid === "password" && (_jsx("p", { style: styles.error, children: "Password is required" })), _jsx("label", { className: "text-color-secondary", children: "Re-enter password" }), _jsxs("div", { style: styles.passwordWrapper, children: [_jsx("input", { type: showRePassword ? "text" : "password", placeholder: "Re-enter Password", value: repassword, onChange: (e) => setRePassword(e.target.value), style: styles.input }), _jsx("div", { style: styles.eyeIcon, onClick: () => setShowRePassword(!showRePassword), children: showRePassword ? _jsx(FaEyeSlash, {}) : _jsx(FaEye, {}) })] }), errorValid === "repassword" && (_jsx("p", { style: styles.error, children: password !== repassword
                                    ? "Passwords do not match"
                                    : "Re-enter password is required" })), _jsx("label", { className: "text-color-secondary", children: "Codeforce name" }), _jsx("input", { type: "text", placeholder: "Enter Your Codeforce Account Name", value: codeforceName, onChange: (e) => setCodeforceName(e.target.value), style: styles.input }), _jsx("label", { className: "text-color-secondary", children: "Phone Number" }), _jsx("input", { type: "text", placeholder: "Enter your phone number", value: phoneNumber, onChange: (e) => setPhoneNumber(e.target.value), style: styles.input }), errorValid === "phoneNumber" && (_jsx("p", { style: styles.error, children: "Phone number is required" })), _jsx("button", { className: "bg-secondary", type: "submit", style: styles.button, children: "Create Account" }), _jsx("p", { className: "mt-4 text-center", children: "By creating account, you agree to our" }), _jsx("p", { className: "text-center", style: { ...styles.colorCreate, cursor: "pointer" }, children: "Terms of Service" })] })] }), isModalVisible && (_jsx(PopupNotification, { title: "\u0110\u0103ng k\u00FD t\u00E0i kho\u1EA3n th\u00E0nh c\u00F4ng!", status: "success" // Trạng thái thành công hoặc thất bại
                , buttonText: "\u0110\u0103ng nh\u1EADp ngay", onButtonClick: sigin }))] }));
};
const styles = {
    container: {
        width: "37.5%",
        minHeight: "536px",
        display: "flex",
        margin: "0 auto",
        padding: "16px 0px",
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
        margin: "4px 0 10px 0",
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
        paddingLeft: "4px",
        fontSize: "0.65rem",
        marginTop: "2px",
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
    colorCreate: {
        color: "#007bff",
    },
};
export default Register;
