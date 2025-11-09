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
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
