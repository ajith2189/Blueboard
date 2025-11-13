import axiosInstance from "@/utils/axios";
import type { User } from "./adminApi";

export const getPreSignedUrlApi = async (userId: string, fileType: string) => {
  const response = await axiosInstance.get(
    `/user/get-presigned-url/${userId}`,
    {
      params: { fileType },
    }
  );
  return response.data;
};

export const updateProfileApi = async (data: User) => {
  const response = await axiosInstance.get(`/user/update-profile`, {
    data: data,
  });

  return response;
};
