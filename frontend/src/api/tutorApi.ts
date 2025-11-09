import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";

export const TutorLoginApi = async (data: any) => {
  const response = await axiosInstance.post("/tutor/login", data);
  return response.data;
};

export const tutorGoogleLogin =async (credential: string) => {
  try {
    const response = await axiosInstance.post("/auth/google", { credential });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};