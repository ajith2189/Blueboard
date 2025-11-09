import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { store } from "../store";
import { setAccessToken, logout } from "../features/authSlice";


//  Create Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // allow sending refresh cookies
});


interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}


axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = store.getState().auth.accessToken;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);


//Handle refresh) -----------------------------
 
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If no response or not 401 → reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // If refresh already happening → queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(axiosInstance(originalRequest));
          },
          reject,
        });
      });
    }

    // Otherwise, start refresh
    isRefreshing = true;

    try {
      const res = await axios.post<{ accessToken: string }>(
        "http://localhost:5000/auth/refresh",
        {},
        { withCredentials: true }
      );

      const accessToken = res.data.accessToken;


      store.dispatch(setAccessToken({accessToken}));


      processQueue(null, accessToken);

      // Retry original failed request
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      return axiosInstance(originalRequest);
    } catch (err) {
      processQueue(err, null);
      store.dispatch(logout());
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
