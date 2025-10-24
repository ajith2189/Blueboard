import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";

interface LoginCredentials {
  email: string;
  password: string;
}

export const adminLoginApi = async (Credentials: LoginCredentials) => {
  try {
    const response = await axiosInstance.post("/auth/admin/login", Credentials);
    return response.data;
  } catch (error) {

    // instance of AxiosError will let know the TS that this may be any kind of error
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
