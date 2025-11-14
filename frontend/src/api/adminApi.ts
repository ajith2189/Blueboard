import axiosInstance from "@/utils/axios";

export type User = {
  _id: string;
  name?: string;
  email?: string;
  role?: "user" | "tutor";
  is_blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  profile_picture_url?: string | null;
};
export type Category = {
  category_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}


export const getAllUsers = async (params?: object) => {
  const mergedParams = { page: 1, limit: 10, role: "user", ...params };
  const response = await axiosInstance.get("/admin/users", { params: mergedParams });
  return response.data;
};

export const blockUser = async (userId: string) => {
  const response = await axiosInstance.patch(`/admin/users/${userId}/block`, {
    is_blocked: true,
  });
  return response.data;
};

export const getAllCategories = async (params?:object) => {
  const mergedParams = { page: 1, limit: 10, ...params };
  const response = await axiosInstance.get("/admin/categories", { params: mergedParams });
  return response.data;
};

export const addCategory = async (data: object) => {
  const response = await axiosInstance.post(`/admin/categories/`, data);
  return response.data;
};

export const updateCategory = async (categoryId: string, data: object) => {
  const response = await axiosInstance.put(`/admin/categories/${categoryId}`, data);
  return response.data;
};

export const deleteCategory = async (categoryId: string) => {
  const response = await axiosInstance.delete(`/admin/categories/${categoryId}`);
  return response.data;
};

export const getCategoryById = async (id: string) => {
  const response = await axiosInstance.get(`/admin/categories/${id}`);
  return response.data;
};
