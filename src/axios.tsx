import axios from "axios";
import { navigateTo } from "./helpers/navigation";
import store from "./redux/store";
import { logout } from "./redux/slices/authSlice";

const api = axios.create({
  baseURL: "https://backend-dot-durable-pipe-444206-d0.as.r.appspot.com",
  // baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});
const TOKEN_EXPIRED = "Token expired.";

// Hàm gửi yêu cầu GET
export const getData = async (endpoint: string, header: object) => {
  try {
    const response = await api.get(endpoint, header);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log("Error response: ", error.response);
      if (error.response.data?.message === TOKEN_EXPIRED) {
        console.log("Token expired");
        store.dispatch(logout());
        navigateTo("/login", { state: { from: window.location.pathname } });
        throw new Error(TOKEN_EXPIRED);
      }
    }
    console.error("Error fetching data", error);
    throw error;
  }
};

// Hàm gửi yêu cầu POST
export const postData = async (
  endpoint: string,
  data: object,
  header: object
) => {
  try {
    const response = await api.post(endpoint, data, header);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log("Error response: ", error.response);
      if (error.response.data?.message === TOKEN_EXPIRED) {
        console.log("Token expired");
        store.dispatch(logout());
        navigateTo("/login", { state: { from: window.location.pathname } });
        throw new Error(TOKEN_EXPIRED);
      }
    }
    console.error("Error posting data", error);
    throw error;
  }
};

// Hàm gửi yêu cầu PUT
export const putData = async (
  endpoint: string,
  data: object,
  header: object
) => {
  try {
    const response = await api.put(endpoint, data, header);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log("Error response: ", error.response);
      if (error.response.data?.message === TOKEN_EXPIRED) {
        console.log("Token expired");
        store.dispatch(logout());
        navigateTo("/login", { state: { from: window.location.pathname } });
        throw new Error(TOKEN_EXPIRED);
      }
    }
    console.error("Error posting data", error);
    throw error;
  }
};

// Hàm gửi yêu cầu POST
export const deleteData = async (endpoint: string, header: object) => {
  try {
    const response = await api.delete(endpoint, header);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log("Error response: ", error.response);
      if (error.response.data?.message === TOKEN_EXPIRED) {
        console.log("Token expired");
        store.dispatch(logout());
        navigateTo("/login", { state: { from: window.location.pathname } });
        throw new Error(TOKEN_EXPIRED);
      }
    }
    console.error("Error posting data", error);
    throw error;
  }
};

// Hàm gửi yêu cầu POST
export const postFile = async (endpoint: string, data: object) => {
  try {
    const response = await api.post(endpoint, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log("Error response: ", error.response);
      if (error.response.data?.message === TOKEN_EXPIRED) {
        console.log("Token expired");
        store.dispatch(logout());
        navigateTo("/login", { state: { from: window.location.pathname } });
        throw new Error(TOKEN_EXPIRED);
      }
    }
    console.error("Error posting data", error);
    throw error;
  }
};
