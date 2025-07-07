import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
import { postData } from "../axios";
import { toast } from "react-toastify";

import Loading from "../components/loading";
import PopupNotification from "../components/popup/notify";

import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [repassword, setRePassword] = useState("");
  const [password, setPassword] = useState("");
  const [codeforceName, setCodeforceName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorValid, setErrorValid] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // const dispatch = useDispatch();
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      const response = await postData(
        "/api/auth/register",
        {
          name: username,
          email: email,
          password: password,
          repassword: repassword,
          phone_number: phoneNumber,
          codeforce_name: codeforceName,
          role: "USER",
        },
        {
          headers: {
            Authorization: `${header}`,
          },
        }
      );
      if (response.status === "OK") {
        toast.success("Tạo tài khoản thành công!");
        setIsModalVisible(true);
      }
    } catch (e) {
      // console.log("aksmd: ", e);
      toast.error(e.response.data.error);
      setErrorValid("general");
    } finally {
      setIsLoading(false);
    }
  };

  const sigin = () => {
    navigate("/login");
  };

  if (isLoading) {
    return <Loading message="Đang tải dữ liệu..." size="large" />;
  }

  return (
    <div style={{ width: "100%", padding: "62px 0px" }}>
      <div style={styles.container}>
        <h1 className="text-color-secondary m-2" style={styles.title}>
          Create an Account
        </h1>
        <div className="flex mb-4">
          <p style={{ marginRight: "8px" }}>Have an account?</p>
          <p
            style={{ ...styles.colorCreate, cursor: "pointer" }}
            onClick={() => sigin()}
          >
            Sign in
          </p>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          {errorValid === "general" && (
            <p style={styles.error}>Invalid registration</p>
          )}

          <label className="text-color-secondary">Name</label>
          <input
            type="text"
            placeholder="Enter Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          {errorValid === "username" && (
            <p style={styles.error}>Name is required</p>
          )}

          <label className="text-color-secondary">Email</label>
          <input
            type="text"
            placeholder="Enter Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          {errorValid === "email" && (
            <p style={styles.error}>Email is required</p>
          )}

          <label className="text-color-secondary">Password</label>
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <div
              style={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {errorValid === "password" && (
            <p style={styles.error}>Password is required</p>
          )}

          <label className="text-color-secondary">Re-enter password</label>
          <div style={styles.passwordWrapper}>
            <input
              type={showRePassword ? "text" : "password"}
              placeholder="Re-enter Password"
              value={repassword}
              onChange={(e) => setRePassword(e.target.value)}
              style={styles.input}
            />
            <div
              style={styles.eyeIcon}
              onClick={() => setShowRePassword(!showRePassword)}
            >
              {showRePassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          {errorValid === "repassword" && (
            <p style={styles.error}>
              {password !== repassword
                ? "Passwords do not match"
                : "Re-enter password is required"}
            </p>
          )}

          <label className="text-color-secondary">Codeforce name</label>
          <input
            type="text"
            placeholder="Enter Your Codeforce Account Name"
            value={codeforceName}
            onChange={(e) => setCodeforceName(e.target.value)}
            style={styles.input}
          />

          <label className="text-color-secondary">Phone Number</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={styles.input}
          />
          {errorValid === "phoneNumber" && (
            <p style={styles.error}>Phone number is required</p>
          )}

          <button className="bg-secondary" type="submit" style={styles.button}>
            Create Account
          </button>
          <p className="mt-4 text-center">
            By creating account, you agree to our
          </p>
          <p
            className="text-center"
            style={{ ...styles.colorCreate, cursor: "pointer" }}
          >
            Terms of Service
          </p>
        </form>
      </div>
      {isModalVisible && (
        <PopupNotification
          title="Đăng ký tài khoản thành công!"
          status="success" // Trạng thái thành công hoặc thất bại
          buttonText="Đăng nhập ngay"
          onButtonClick={sigin}
        />
      )}
    </div>
  );
};

const styles: {
  container: React.CSSProperties;
  title: React.CSSProperties;
  form: React.CSSProperties;
  input: React.CSSProperties;
  button: React.CSSProperties;
  error: React.CSSProperties;
  passwordWrapper: React.CSSProperties;
  eyeIcon: React.CSSProperties;
  colorCreate: React.CSSProperties;
} = {
  container: {
    width: "37.5%",
    minHeight: "536px",
    display: "flex",
    margin: "0 auto",
    padding: "16px 0px",
    flexDirection: "column" as "column",
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
    flexDirection: "column" as "column",
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
