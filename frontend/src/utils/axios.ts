import axios from "axios";
import { store } from "../store";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // adjust if backend has /api prefix
  withCredentials: true, // allow cookies (important if backend uses refresh tokens)
});

// Request interceptor – attach access token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
