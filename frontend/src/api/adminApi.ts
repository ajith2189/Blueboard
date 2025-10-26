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

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

const defaultParams = { page: 1, limit: 10, role: "user" };

export const getAllUsers = async (
  params: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  } = defaultParams
): Promise<PaginatedResponse<User>> => {
  try {
    console.log("all users called in the api");
    const mergedParams = { ...defaultParams, ...params };

    const response = await axiosInstance.get<PaginatedResponse<User>>(
      "/admin/user",
      { params: mergedParams }
    );

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
