import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "tutor" | "admin";
  is_blocked: boolean;
  createdAt: string;
  updatedAt: string;
  profile_picture_url: string | null;
}

interface ApiError {
  message: string;
  statusCode?: number;
}

export const getAllTutors = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<User[]>("/admin/tutor");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const apiError: ApiError = {
        message: error.response.data?.message || "Unknown error",
        statusCode: error.response.status,
      };
      throw apiError;
    }
    throw error;
  }
};
