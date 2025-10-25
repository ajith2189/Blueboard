import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "tutor";
  is_blocked: boolean;
  createdAt: string;
  updatedAt: string;
  profile_picture_url: string | null;
};

interface ApiError {
  message: string;
  statusCode?: number;
}

const defaultParams = { page: 1, limit: 10, role: "user" };

export const getAllUsers = async (
  params: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  } = defaultParams

): Promise<User[]> => {
  try {
    console.log("all users called");
    const mergedParams = { ...defaultParams, ...params };

    const response = await axiosInstance.get<User[]>("/admin/user", {
      params: mergedParams,
    });
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
